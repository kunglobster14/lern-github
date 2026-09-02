import pg from 'pg';

const { Pool } = pg;
const pools = globalThis.__myEnglishPools || (globalThis.__myEnglishPools = new Map());

export function getDbConfig() {
  const mainUrl = String(process.env.MYENGLISH_DATABASE_URL || '').trim();
  const tempUrl = String(process.env.MYENGLISH_TEMP_DATABASE_URL || '').trim();
  if (mainUrl) return { url: mainUrl, mode: 'main', configured: true };
  if (tempUrl) return { url: tempUrl, mode: 'temporary', configured: true };
  return { url: '', mode: 'none', configured: false };
}

export function getPool() {
  const cfg = getDbConfig();
  if (!cfg.configured) return null;
  if (!pools.has(cfg.url)) {
    pools.set(cfg.url, new Pool({
      connectionString: cfg.url,
      max: 3,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000,
      ssl: { rejectUnauthorized: false }
    }));
  }
  return pools.get(cfg.url);
}

export async function schemaStatus() {
  const pool = getPool();
  const cfg = getDbConfig();
  if (!pool) return { ...cfg, ready: false };
  try {
    const result = await pool.query("SELECT to_regclass('public.app_users') AS users, to_regclass('public.learner_state') AS state");
    return { ...cfg, ready: Boolean(result.rows?.[0]?.users && result.rows?.[0]?.state) };
  } catch (error) {
    return { ...cfg, ready: false, error: String(error?.code || error?.message || 'db_error').slice(0, 120) };
  }
}

export async function ensureSchema() {
  const cfg = getDbConfig();
  const pool = getPool();
  if (!pool) throw new Error('database_not_configured');

  const mayInitialize = cfg.mode === 'temporary' || process.env.MYENGLISH_ALLOW_SCHEMA_INIT === '1';
  const status = await schemaStatus();
  if (status.ready) return status;
  if (!mayInitialize) throw new Error('schema_not_initialized');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        username text NOT NULL,
        username_key text NOT NULL UNIQUE,
        display_name text NOT NULL,
        password_salt text NOT NULL,
        password_hash text NOT NULL,
        role text NOT NULL DEFAULT 'learner' CHECK (role IN ('learner','admin')),
        is_active boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        last_login_at timestamptz
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS app_sessions (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
        token_hash text NOT NULL UNIQUE,
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL,
        last_seen_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS learner_state (
        user_id uuid PRIMARY KEY REFERENCES app_users(id) ON DELETE CASCADE,
        state jsonb NOT NULL DEFAULT '{}'::jsonb,
        revision bigint NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await client.query('CREATE INDEX IF NOT EXISTS app_sessions_user_idx ON app_sessions(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS app_sessions_expiry_idx ON app_sessions(expires_at)');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
  return schemaStatus();
}
