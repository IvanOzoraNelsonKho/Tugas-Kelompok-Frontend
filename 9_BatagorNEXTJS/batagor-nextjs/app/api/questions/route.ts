import { NextResponse } from "next/server";
import { readQuestions, replaceQuestions } from "../../lib/db";
import type { QuizQuestion } from "../../lib/data";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(readQuestions());
}

export async function PUT(request: Request) {
  try {
    const questions = (await request.json()) as QuizQuestion[];
    console.log("Dapet request save kuis nih bos, total soal:", questions.length);  
    replaceQuestions(questions);
    return NextResponse.json(readQuestions());
  } catch (error) {
    console.error("Waduh error pas PUT:", error);
    return NextResponse.json({ error: "Gagal nyimpen ke database" }, { status: 500 });
  }
}



