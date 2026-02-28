import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const todos = await prisma.todo.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description : null;
  const status = body?.status === "done" ? "done" : "pending";

  if (!title) {
    return NextResponse.json({ message: "title zorunlu" }, { status: 400 });
  }

  const created = await prisma.todo.create({
    data: { title, description, status },
  });

  return NextResponse.json(created, { status: 201 });
}