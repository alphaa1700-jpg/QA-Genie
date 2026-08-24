"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function createProject(data: { name: string, key: string, description: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) throw new Error("User not found");

  const project = await prisma.project.create({
    data: {
      name: data.name,
      key: data.key,
      description: data.description,
      ownerId: user.id
    }
  });

  return { success: true, projectId: project.id };
}
