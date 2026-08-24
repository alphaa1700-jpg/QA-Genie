"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function saveGeminiKey(apiKey: string) {
  const session = await getServerSession();
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { geminiApiKey: apiKey }
  });

  return { success: true };
}
