import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { testCaseId, status, notes } = body;

    // 1. Validate payload
    if (!testCaseId || !status) {
      return NextResponse.json({ error: "Missing required fields: testCaseId, status" }, { status: 400 });
    }

    // 2. Find the Test Case
    const testCase = await prisma.testCase.findFirst({
      where: { caseId: testCaseId },
      include: { project: true }
    });

    if (!testCase) {
      return NextResponse.json({ error: \`TestCase \${testCaseId} not found\` }, { status: 404 });
    }

    // 3. Find or Create an "Automated Runs" Cycle for this Project
    let cycle = await prisma.cycle.findFirst({
      where: { 
        projectId: testCase.projectId,
        name: "Automated Nightly Suite" 
      }
    });

    if (!cycle) {
      // Find a sprint or create a dummy one
      let sprint = await prisma.sprint.findFirst({ where: { projectId: testCase.projectId } });
      if (!sprint) {
        sprint = await prisma.sprint.create({
          data: {
            name: "Automation Sprint",
            projectId: testCase.projectId
          }
        });
      }
      
      cycle = await prisma.cycle.create({
        data: {
          name: "Automated Nightly Suite",
          status: "ACTIVE",
          projectId: testCase.projectId,
          sprintId: sprint.id
        }
      });
    }

    // 4. Record the Execution
    const execution = await prisma.execution.create({
      data: {
        status: status.toUpperCase(), // PASS, FAIL, etc.
        notes: notes || "Executed via CI/CD Automation",
        testCaseId: testCase.id,
        cycleId: cycle.id
      }
    });

    // 5. If it failed, optionally create a defect
    if (status.toUpperCase() === 'FAIL') {
      await prisma.defect.create({
        data: {
          title: \`[Auto-Defect] \${testCase.title} Failed\`,
          description: \`Automated test run failed. Notes: \${notes}\`,
          status: "OPEN",
          severity: "HIGH",
          executionId: execution.id,
          projectId: testCase.projectId
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: \`Execution recorded for \${testCaseId}\`,
      executionId: execution.id
    });

  } catch (error: any) {
    console.error("Reporter API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
