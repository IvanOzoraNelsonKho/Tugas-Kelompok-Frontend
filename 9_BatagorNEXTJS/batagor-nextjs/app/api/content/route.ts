import { NextResponse } from "next/server";
import { readContent, replaceContent } from "../../lib/db";
import type { Bi, ContentKey } from "../../lib/data";

export const runtime = "nodejs";

export function GET() {
  return NextResponse.json(readContent());
}

export async function PUT(request: Request) {
  const content = (await request.json()) as Record<ContentKey, Bi>;
  replaceContent(content);
  return NextResponse.json(readContent());
}
