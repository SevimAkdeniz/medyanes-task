export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function isValidObjectId(id: string) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));

  const data: {
    title?: string;
    description?: string | null;
    status?: "pending" | "done";
  } = {};

  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.description === "string") data.description = body.description;
  if (body.description === null) data.description = null;
  if (body.status === "pending" || body.status === "done") data.status = body.status;

  try {
    const updated = await prisma.todo.update({
      where: { id },
      data,
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    if (String(e?.code) === "P2025") {
      return NextResponse.json({ message: "Kayıt bulunamadı" }, { status: 404 });
    }
    console.error("PUT /api/todos/[id] error:", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;

  if (!isValidObjectId(id)) {
    return NextResponse.json({ message: "Geçersiz id" }, { status: 400 });
  }

  try {
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (String(e?.code) === "P2025") {
      return NextResponse.json({ message: "Kayıt bulunamadı" }, { status: 404 });
    }
    console.error("DELETE /api/todos/[id] error:", e);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}