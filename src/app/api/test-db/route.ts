import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ success: true, users, env: process.env.POSTGRES_PRISMA_URL ? "URL IS SET" : "URL IS MISSING" });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message });
  }
}
