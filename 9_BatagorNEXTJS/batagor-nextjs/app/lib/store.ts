// Penyimpanan data admin di localStorage (pengganti site-data.js versi lama).
// Kunci penyimpanan sama dengan versi lama, jadi data lama tetap terbaca.
import { useMemo, useSyncExternalStore } from "react";
import {
  defaultContent,
  defaultQuestions,
  type Bi,
  type ContentKey,
  type QuizQuestion,
} from "./data";

const QUESTIONS_KEY = "batagor.admin.questions";
const CONTENT_KEY = "batagor.admin.content";

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function parse(raw: string | null): unknown {
  try {
    return JSON.parse(raw ?? "null");
  } catch {
    return null;
  }
}

export function cloneDefaultQuestions(): QuizQuestion[] {
  return JSON.parse(JSON.stringify(defaultQuestions));
}

export function cloneDefaultContent(): Record<ContentKey, Bi> {
  return JSON.parse(JSON.stringify(defaultContent));
}

function parseQuestions(raw: string | null): QuizQuestion[] {
  const saved = parse(raw);
  return Array.isArray(saved) && saved.length
    ? (saved as QuizQuestion[])
    : cloneDefaultQuestions();
}

function parseContent(raw: string | null): Record<ContentKey, Bi> {
  const saved = (parse(raw) ?? {}) as Partial<Record<ContentKey, Partial<Bi>>>;
  const content = cloneDefaultContent();
  (Object.keys(content) as ContentKey[]).forEach((key) => {
    const item = saved[key] ?? {};
    content[key] = {
      id: typeof item.id === "string" ? item.id : content[key].id,
      en: typeof item.en === "string" ? item.en : content[key].en,
    };
  });
  return content;
}

/* ---------- Dipakai halaman admin (membaca & menulis langsung) ---------- */
export const loadQuestions = () => parseQuestions(readRaw(QUESTIONS_KEY));
export const loadContent = () => parseContent(readRaw(CONTENT_KEY));
export const saveQuestions = (questions: QuizQuestion[]) =>
  write(QUESTIONS_KEY, questions);
export const saveContent = (content: Record<ContentKey, Bi>) =>
  write(CONTENT_KEY, content);

/* ---------- Dipakai halaman situs (hook) ----------
   localStorage hanya ada di browser, tidak di server. useSyncExternalStore
   memberi nilai awal (getServerSnapshot) saat render di server, lalu otomatis
   beralih ke isi localStorage setelah tampil di browser. */
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useSavedQuestions(): QuizQuestion[] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(QUESTIONS_KEY),
    () => null,
  );
  return useMemo(() => parseQuestions(raw), [raw]);
}

export function useSavedContent(): Record<ContentKey, Bi> {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(CONTENT_KEY),
    () => null,
  );
  return useMemo(() => parseContent(raw), [raw]);
}
