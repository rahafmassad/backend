CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS content (
  content_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS saved_content (
  user_id INT REFERENCES users(id),
  content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
  PRIMARY KEY(user_id, content_id)
);

CREATE TABLE IF NOT EXISTS chat (
  chat_id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS likes (
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  content_id INT REFERENCES content(content_id) ON DELETE CASCADE,
  PRIMARY KEY(user_id, content_id)
);

CREATE TABLE IF NOT EXISTS follow (
  follower_id INT REFERENCES users(id) ON DELETE CASCADE,
  following_id INT REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY(follower_id, following_id)
);
