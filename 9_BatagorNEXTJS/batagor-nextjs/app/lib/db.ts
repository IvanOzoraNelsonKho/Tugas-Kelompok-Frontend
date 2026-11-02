import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import {
  defaultContent,
  defaultQuestions,
  type Bi,
  type ContentKey,
  type QuizQuestion,
} from "./data";

const dataDirectory =
  process.env.BATAGOR_DATA_DIR ??
  path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "batagor.db");

let database: Database.Database | undefined;
/*buka databse */
function getDatabase(): Database.Database {
  if (!database) {
    fs.mkdirSync(dataDirectory, { recursive: true });
    database = new Database(databasePath);
    database.pragma("journal_mode = WAL");
    database.pragma("foreign_keys = ON");
    database.exec(`
      CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        id_text TEXT NOT NULL,
        en_text TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id TEXT NOT NULL,
        question_en TEXT NOT NULL,
        answer INTEGER NOT NULL CHECK (answer BETWEEN 0 AND 3)
      );
      CREATE TABLE IF NOT EXISTS quiz_options (
        question_id INTEGER NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
        option_index INTEGER NOT NULL CHECK (option_index BETWEEN 0 AND 3),
        id_text TEXT NOT NULL,
        en_text TEXT NOT NULL,
        PRIMARY KEY (question_id, option_index)
      );
    `);
    seedDatabase(database);
  }
  return database;
}

function seedDatabase(db: Database.Database) {
  const contentCount = db
    .prepare("SELECT COUNT(*) AS count FROM content")
    .get() as { count: number };
  if (contentCount.count === 0) {
    const insert = db.prepare(
      "INSERT INTO content (key, id_text, en_text) VALUES (?, ?, ?)",
    );
    const seed = db.transaction(() => {
      for (const [key, value] of Object.entries(defaultContent)) {
        insert.run(key, value.id, value.en);
      }
    });
    seed();
  }

  const questionCount = db
    .prepare("SELECT COUNT(*) AS count FROM quiz_questions")
    .get() as { count: number };
  if (questionCount.count === 0) {
    replaceQuestionsInDatabase(db, defaultQuestions);
  }
}

export function readContent(): Record<ContentKey, Bi> {
  const db = getDatabase();
  const result = { ...defaultContent };
  const rows = db
    .prepare("SELECT key, id_text, en_text FROM content")
    .all() as { key: ContentKey; id_text: string; en_text: string }[];
  for (const row of rows) {
    if (row.key in result) {
      result[row.key] = { id: row.id_text, en: row.en_text };
    }
  }
  return result;
}

export function replaceContent(content: Record<ContentKey, Bi>) {
  const db = getDatabase();
  if (!content || typeof content !== "object") {
    throw new Error("Format konten tidak valid.");
  }
  const replace = db.prepare(
    "INSERT INTO content (key, id_text, en_text) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET id_text = excluded.id_text, en_text = excluded.en_text",
  );
  const save = db.transaction(() => {
    for (const [key, value] of Object.entries(content)) {
      replace.run(key, value.id.trim(), value.en.trim());
    }
  });
  save();
}
/* penyimpanan dan seeding buat quiz*/
export function readQuestions(): QuizQuestion[] {
  const db = getDatabase();
  const questions = db
    .prepare(
      "SELECT id, question_id, question_en, answer FROM quiz_questions ORDER BY id",
    )
    .all() as {
    id: number;
    question_id: string;
    question_en: string;
    answer: number;
  }[];
  const options = db
    .prepare(
      "SELECT question_id, option_index, id_text, en_text FROM quiz_options ORDER BY question_id, option_index",
    )
    .all() as {
    question_id: number;
    option_index: number;
    id_text: string;
    en_text: string;
  }[];
  return questions.map((question) => ({
    question: { id: question.question_id, en: question.question_en },
    options: options
      .filter((option) => option.question_id === question.id)
      .map((option) => ({ id: option.id_text, en: option.en_text })),
    answer: question.answer,
  }));
}
/* penyimpanan dan seeding buat quiz*/
function replaceQuestionsInDatabase(
  db: Database.Database,
  questions: QuizQuestion[],
) {
  /*array buat ngecek daftar soal*/
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("woy Minimal harus ada satu soal.");
  }
  /*transaksi buat penghapusan dan penyimpanan soal baru kalo error batal */
  const clear = db.transaction(() => {
    db.exec("DELETE FROM quiz_options; DELETE FROM quiz_questions;");
    const insertQuestion = db.prepare(
      "INSERT INTO quiz_questions (question_id, question_en, answer) VALUES (?, ?, ?)",
    );
    const insertOption = db.prepare(
      "INSERT INTO quiz_options (question_id, option_index, id_text, en_text) VALUES (?, ?, ?, ?)",
    );
    for (const question of questions) {
      /*validasi soal*/
      if (
        question.options.length !== 4 ||
        question.answer < 0 ||
        question.answer > 3 ||
        !question.question.id.trim() ||
        !question.question.en.trim() ||
        question.options.some(
          (option) => !option.id.trim() || !option.en.trim(),
        )
      ) {
        throw new Error(
          "Setiap soal harus memiliki pertanyaan, 4 pilihan, dan jawaban valid.",
        );
      }
      /*masukkan soal ke database*/
      const result = insertQuestion.run(
        question.question.id.trim(),
        question.question.en.trim(),
        question.answer,
      );
      //masukin empat pilihan ke database//
      question.options.forEach((option, index) => {
        insertOption.run(
          result.lastInsertRowid,
          index,
          option.id.trim(),
          option.en.trim(),
        );
      });
    }
  });
  clear();
}
/*ambil quiz*/
export function replaceQuestions(questions: QuizQuestion[]) {
  replaceQuestionsInDatabase(getDatabase(), questions);
}
