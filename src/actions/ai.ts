"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function generateTestCaseAI(title: string, projectId: string, moduleId: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user?.geminiApiKey) {
    throw new Error("No Gemini API Key found. Please add it in Settings.");
  }

  const genAI = new GoogleGenerativeAI(user.geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are an expert QA Engineer. 
    Write a detailed test case for the following title: "${title}".
    Respond in STRICT JSON format matching this schema, with NO markdown formatting around it:
    {
      "description": "Brief description",
      "preconditions": "Preconditions to test",
      "steps": [
        { "stepNumber": 1, "action": "Step action", "expectedResult": "Expected result" }
      ]
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // Clean up potential markdown formatting
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedText);

    // Create the test case in DB
    const testCase = await prisma.testCase.create({
      data: {
        caseId: `TC-${Math.floor(Math.random() * 10000)}`,
        title,
        description: parsed.description,
        preconditions: parsed.preconditions,
        projectId,
        moduleId,
        steps: {
          create: parsed.steps
        }
      }
    });

    return { success: true, testCaseId: testCase.id };
  } catch (e: any) {
    console.error(e);
    throw new Error("Failed to generate test case from AI: " + e.message);
  }
}
