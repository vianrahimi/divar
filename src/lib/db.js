import { DatabaseSync } from 'node:sqlite';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'database.sqlite');
const db = new DatabaseSync(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    price INTEGER NOT NULL,
    time TEXT NOT NULL,
    timeHours REAL NOT NULL,
    categoryId INTEGER NOT NULL,
    cityId INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    condition TEXT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES categories (id),
    FOREIGN KEY (cityId) REFERENCES cities (id)
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at INTEGER NOT NULL
  );
`);

export default db;
