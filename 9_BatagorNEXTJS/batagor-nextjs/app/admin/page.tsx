"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import type { Bi, ContentKey, QuizQuestion } from "../lib/data";
import {
  cloneDefaultContent,
  loadContent,
  loadQuestions,
  saveContent,
  saveQuestions,
} from "../lib/store";

type View = "overview" | "quiz" | "content";

const viewTitles: Record<View, string> = {
  overview: "Ringkasan",
  quiz: "Kelola kuis",
  content: "Konten situs",
};

const letters = ["A", "B", "C", "D"];

/* Bentuk data form soal (semua berupa string supaya mudah dipakai di <input>) */
interface QuestionDraft {
  questionId: string;
  questionEn: string;
  optionsId: string[];
  optionsEn: string[];
  answer: number;
}

function emptyDraft(): QuestionDraft {
  return {
    questionId: "",
    questionEn: "",
    optionsId: ["", "", "", ""],
    optionsEn: ["", "", "", ""],
    answer: 0,
  };
}

function toDraft(q: QuizQuestion): QuestionDraft {
  return {
    questionId: q.question.id,
    questionEn: q.question.en,
    optionsId: q.options.map((o) => o.id),
    optionsEn: q.options.map((o) => o.en),
    answer: q.answer,
  };
}

interface Status {
  message: string;
  error: boolean;
}
const noStatus: Status = { message: "", error: false };

/* Pengaturan grup form "Konten situs" */
const contentGroups: {
  title: string;
  caption: string;
  titleKey: ContentKey;
  bodyKey: ContentKey;
  bodyLabel: Bi;
  bodyRows: number;
}[] = [
  {
    title: "Beranda",
    caption: "Judul dan pengantar pembuka",
    titleKey: "homeTitle",
    bodyKey: "homeIntro",
    bodyLabel: { id: "Pengantar", en: "Introduction" },
    bodyRows: 3,
  },
  {
    title: "Tentang Batagor",
    caption: "Bagian pengertian",
    titleKey: "aboutTitle",
    bodyKey: "aboutIntro",
    bodyLabel: { id: "Deskripsi", en: "Description" },
    bodyRows: 4,
  },
  {
    title: "Sejarah Batagor",
    caption: "Judul dan paragraf pembuka",
    titleKey: "historyTitle",
    bodyKey: "historyIntro",
    bodyLabel: { id: "Pengantar", en: "Introduction" },
    bodyRows: 4,
  },
];

const subscribeNoop = () => () => {};

/* Halaman admin membaca localStorage, yang hanya ada di browser.
   Jadi editor baru ditampilkan setelah kode berjalan di browser. */
export default function AdminPage() {
  const isBrowser = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  return isBrowser ? <AdminEditor /> : null;
}

function AdminEditor() {
  const [view, setView] = useState<View>("overview");
  const [storageOk, setStorageOk] = useState<boolean>(true);

  // ---- state kuis ----
  const [questions, setQuestions] = useState<QuizQuestion[]>(loadQuestions);
  const [editingIndex, setEditingIndex] = useState<number>(0);
  const [creating, setCreating] = useState<boolean>(false);
  const [draft, setDraft] = useState<QuestionDraft>(() =>
    toDraft(questions[0]),
  );
  const [questionStatus, setQuestionStatus] = useState<Status>(noStatus);
  const questionFieldRef = useRef<HTMLTextAreaElement>(null);

  // ---- state konten ----
  const [content, setContent] = useState<Record<ContentKey, Bi>>(loadContent);
  const [contentStatus, setContentStatus] = useState<Status>(noStatus);

  /* ===================== KUIS ===================== */
  const selectQuestion = (index: number, list: QuizQuestion[] = questions) => {
    setCreating(false);
    setEditingIndex(index);
    setDraft(toDraft(list[index]));
    setQuestionStatus(noStatus);
  };

  const startNewQuestion = () => {
    setCreating(true);
    setEditingIndex(questions.length);
    setDraft(emptyDraft());
    setQuestionStatus(noStatus);
    questionFieldRef.current?.focus();
  };

  const handleSaveQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const question: QuizQuestion = {
      question: { id: draft.questionId.trim(), en: draft.questionEn.trim() },
      options: draft.optionsId.map((id, i) => ({
        id: id.trim(),
        en: draft.optionsEn[i].trim(),
      })),
      answer: draft.answer,
    };

    let next: QuizQuestion[];
    let nextIndex: number;
    if (creating) {
      next = [...questions, question];
      nextIndex = next.length - 1;
    } else {
      next = questions.map((q, i) => (i === editingIndex ? question : q));
      nextIndex = editingIndex;
    }

    const saved = saveQuestions(next);
    setStorageOk(saved);
    setQuestions(next);
    selectQuestion(nextIndex, next);
    setQuestionStatus({
      message: saved
        ? "Soal tersimpan."
        : "Gagal menyimpan soal di browser ini.",
      error: !saved,
    });
  };

  const handleDeleteQuestion = () => {
    if (creating || questions.length <= 1) return;
    if (!window.confirm("Hapus pertanyaan ini?")) return;

    const next = questions.filter((_, i) => i !== editingIndex);
    const saved = saveQuestions(next);
    setStorageOk(saved);
    setQuestions(next);
    selectQuestion(Math.min(editingIndex, next.length - 1), next);
    setQuestionStatus({
      message: saved ? "Soal dihapus." : "Gagal menyimpan perubahan.",
      error: !saved,
    });
  };

  const updateDraftOption = (
    field: "optionsId" | "optionsEn",
    index: number,
    value: string,
  ) => {
    setDraft({
      ...draft,
      [field]: draft[field].map((v, i) => (i === index ? value : v)),
    });
  };

  /* ===================== KONTEN ===================== */
  const updateContent = (key: ContentKey, lang: keyof Bi, value: string) => {
    setContent({ ...content, [key]: { ...content[key], [lang]: value } });
  };

  const handleSaveContent = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      (Object.keys(content) as ContentKey[]).map((key) => [
        key,
        { id: content[key].id.trim(), en: content[key].en.trim() },
      ]),
    ) as Record<ContentKey, Bi>;

    const saved = saveContent(trimmed);
    setContent(trimmed);
    setStorageOk(saved);
    setContentStatus({
      message: saved
        ? "Konten tersimpan. Muat ulang situs untuk melihat perubahan."
        : "Gagal menyimpan konten di browser ini.",
      error: !saved,
    });
  };

  const handleResetContent = () => {
    const defaults = cloneDefaultContent();
    const saved = saveContent(defaults);
    setContent(defaults);
    setStorageOk(saved);
    setContentStatus({
      message: saved ? "Teks awal dipulihkan." : "Gagal menyimpan perubahan.",
      error: !saved,
    });
  };

  /* ===================== TAMPILAN ===================== */
  const navItem = (v: View, label: string) => (
    <button
      className={`admin-nav-item ${view === v ? "active" : ""}`}
      type="button"
      onClick={() => setView(v)}
    >
      {label}
    </button>
  );

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {/* <a> biasa (bukan <Link>) supaya situs dimuat ulang dengan CSS-nya sendiri */}
        <a className="admin-brand" href="/">
          Batagor<small>Pengelola</small>
        </a>
        <p className="sidebar-caption">Menu</p>
        <nav className="admin-nav" aria-label="Navigasi admin">
          {navItem("overview", "Ringkasan")}
          {navItem("quiz", "Kelola kuis")}
          {navItem("content", "Konten situs")}
        </nav>
        <a className="back-to-site" href="/">
          Buka situs
        </a>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <h1>{viewTitles[view]}</h1>
          <span
            className={`storage-status ${storageOk ? "" : "error"}`}
            role="status"
          >
            <i aria-hidden="true"></i>
            <span className="visually-hidden">
              {storageOk
                ? " Tersimpan di browser ini"
                : " Penyimpanan browser tidak tersedia"}
            </span>
          </span>
        </header>

        {/* ---------- Ringkasan ---------- */}
        <section
          className={`admin-view ${view === "overview" ? "active" : ""}`}
          hidden={view !== "overview"}
        >
          <section className="overview-quick">
            <h2>Pengelolaan</h2>
            <div className="quick-grid">
              <button
                className="quick-link"
                type="button"
                onClick={() => setView("quiz")}
              >
                <strong>Bank soal kuis</strong>
                <small>Tambah, ubah, atau hapus pertanyaan</small>
              </button>
              <button
                className="quick-link"
                type="button"
                onClick={() => setView("content")}
              >
                <strong>Konten halaman</strong>
                <small>Perbarui teks Indonesia dan Inggris</small>
              </button>
            </div>
          </section>

          <section className="managed-content">
            <div className="managed-heading">
              <h2>Bagian konten</h2>
              <button type="button" onClick={() => setView("content")}>
                Edit teks
              </button>
            </div>
            <div className="managed-content-grid">
              <button type="button" onClick={() => setView("content")}>
                <strong>Beranda</strong>
                <span>Judul dan pengantar</span>
              </button>
              <button type="button" onClick={() => setView("content")}>
                <strong>Tentang Batagor</strong>
                <span>Pengertian dan deskripsi</span>
              </button>
              <button type="button" onClick={() => setView("content")}>
                <strong>Sejarah Batagor</strong>
                <span>Judul dan paragraf pembuka</span>
              </button>
            </div>
          </section>
        </section>

        {/* ---------- Kelola kuis ---------- */}
        <section
          className={`admin-view ${view === "quiz" ? "active" : ""}`}
          hidden={view !== "quiz"}
        >
          <div className="section-heading-row">
            <button
              className="button-primary"
              type="button"
              onClick={startNewQuestion}
            >
              Tambah soal
            </button>
          </div>

          <div className="quiz-admin-layout">
            <section className="question-list-panel">
              <div className="list-panel-header">
                <strong>Daftar pertanyaan</strong>
                <span className="count-badge">{questions.length}</span>
              </div>
              <div className="question-list">
                {questions.map((q, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`question-list-item ${!creating && index === editingIndex ? "active" : ""}`}
                    onClick={() => selectQuestion(index)}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span>{q.question.id}</span>
                  </button>
                ))}
                {creating && (
                  <div className="question-list-empty">Soal baru</div>
                )}
              </div>
            </section>

            <form className="question-form" onSubmit={handleSaveQuestion}>
              <div className="form-topline">
                <span className="eyebrow">
                  {creating
                    ? "SOAL BARU"
                    : `PERTANYAAN ${String(editingIndex + 1).padStart(2, "0")}`}
                </span>
                <button
                  className="button-danger"
                  type="button"
                  disabled={creating || questions.length <= 1}
                  title={
                    questions.length <= 1
                      ? "Kuis harus memiliki minimal satu soal"
                      : "Hapus soal ini"
                  }
                  onClick={handleDeleteQuestion}
                >
                  Hapus soal
                </button>
              </div>

              <div className="language-fields">
                <label className="field-label">
                  Pertanyaan <span>ID</span>
                  <textarea
                    ref={questionFieldRef}
                    rows={2}
                    required
                    value={draft.questionId}
                    onChange={(e) =>
                      setDraft({ ...draft, questionId: e.target.value })
                    }
                  />
                </label>
                <label className="field-label">
                  Question <span>EN</span>
                  <textarea
                    rows={2}
                    required
                    value={draft.questionEn}
                    onChange={(e) =>
                      setDraft({ ...draft, questionEn: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="answers-heading">
                <h3>Pilihan jawaban</h3>
                <p>Pilih jawaban yang benar.</p>
              </div>
              <div className="option-list">
                {letters.map((letter, i) => (
                  <div className="option-row" key={letter}>
                    <label
                      className="answer-radio"
                      aria-label={`Tandai pilihan ${i + 1} sebagai jawaban benar`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={i}
                        required
                        checked={draft.answer === i}
                        onChange={() => setDraft({ ...draft, answer: i })}
                      />
                      <span>{letter}</span>
                    </label>
                    <label className="field-label">
                      Pilihan {letter} <span>ID</span>
                      <input
                        required
                        value={draft.optionsId[i]}
                        onChange={(e) =>
                          updateDraftOption("optionsId", i, e.target.value)
                        }
                      />
                    </label>
                    <label className="field-label">
                      Option {letter} <span>EN</span>
                      <input
                        required
                        value={draft.optionsEn[i]}
                        onChange={(e) =>
                          updateDraftOption("optionsEn", i, e.target.value)
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-actions">
                <p
                  className={`form-status ${questionStatus.error ? "error" : ""}`}
                  role="status"
                >
                  {questionStatus.message}
                </p>
                <button className="button-primary" type="submit">
                  Simpan soal
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ---------- Konten situs ---------- */}
        <section
          className={`admin-view ${view === "content" ? "active" : ""}`}
          hidden={view !== "content"}
        >
          <form className="content-form" onSubmit={handleSaveContent}>
            {contentGroups.map((group) => (
              <section className="content-group" key={group.titleKey}>
                <div className="content-group-heading">
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.caption}</p>
                  </div>
                </div>
                <div className="language-fields">
                  <label className="field-label">
                    Judul <span>ID</span>
                    <input
                      required
                      value={content[group.titleKey].id}
                      onChange={(e) =>
                        updateContent(group.titleKey, "id", e.target.value)
                      }
                    />
                  </label>
                  <label className="field-label">
                    Title <span>EN</span>
                    <input
                      required
                      value={content[group.titleKey].en}
                      onChange={(e) =>
                        updateContent(group.titleKey, "en", e.target.value)
                      }
                    />
                  </label>
                </div>
                <div className="language-fields">
                  <label className="field-label">
                    {group.bodyLabel.id} <span>ID</span>
                    <textarea
                      rows={group.bodyRows}
                      required
                      value={content[group.bodyKey].id}
                      onChange={(e) =>
                        updateContent(group.bodyKey, "id", e.target.value)
                      }
                    />
                  </label>
                  <label className="field-label">
                    {group.bodyLabel.en} <span>EN</span>
                    <textarea
                      rows={group.bodyRows}
                      required
                      value={content[group.bodyKey].en}
                      onChange={(e) =>
                        updateContent(group.bodyKey, "en", e.target.value)
                      }
                    />
                  </label>
                </div>
              </section>
            ))}

            <div className="form-actions content-actions">
              <p
                className={`form-status ${contentStatus.error ? "error" : ""}`}
                role="status"
              >
                {contentStatus.message}
              </p>
              <button
                className="button-secondary"
                type="button"
                onClick={handleResetContent}
              >
                Pulihkan teks awal
              </button>
              <button className="button-primary" type="submit">
                Simpan konten
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
