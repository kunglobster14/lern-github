CREATE TABLE IF NOT EXISTS levels (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_th TEXT NOT NULL,
  description_th TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE RESTRICT,
  title_en TEXT NOT NULL,
  title_th TEXT NOT NULL,
  description_th TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vocabulary (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  english TEXT NOT NULL,
  thai TEXT NOT NULL,
  pronunciation_th TEXT,
  part_of_speech TEXT,
  example_en TEXT,
  example_th TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (english, thai)
);

CREATE TABLE IF NOT EXISTS lesson_vocabulary (
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  vocabulary_id BIGINT NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (lesson_id, vocabulary_id)
);

CREATE TABLE IF NOT EXISTS sentence_patterns (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE RESTRICT,
  pattern_en TEXT NOT NULL,
  explanation_th TEXT NOT NULL,
  example_en TEXT NOT NULL,
  example_th TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  question_type TEXT NOT NULL,
  question_text TEXT NOT NULL,
  choices JSONB,
  correct_answer TEXT NOT NULL,
  explanation_th TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_progress (
  user_id TEXT NOT NULL,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','completed')),
  best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score BETWEEN 0 AND 100),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS user_vocabulary (
  user_id TEXT NOT NULL,
  vocabulary_id BIGINT NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
  times_seen INTEGER NOT NULL DEFAULT 0,
  times_correct INTEGER NOT NULL DEFAULT 0,
  times_wrong INTEGER NOT NULL DEFAULT 0,
  mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  last_reviewed_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, vocabulary_id)
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  lesson_id BIGINT REFERENCES lessons(id) ON DELETE SET NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  total_questions INTEGER NOT NULL DEFAULT 0,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS study_sessions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
  items_completed INTEGER NOT NULL DEFAULT 0 CHECK (items_completed >= 0),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_lessons_level_sort ON lessons(level_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_vocabulary_english ON vocabulary(english);
CREATE INDEX IF NOT EXISTS idx_sentence_patterns_level_sort ON sentence_patterns(level_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_lesson_sort ON quiz_questions(lesson_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_review ON user_vocabulary(user_id, next_review_at);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_created ON quiz_attempts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_started ON study_sessions(user_id, started_at DESC);
