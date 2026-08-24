const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing
  await prisma.defectExecution.deleteMany();
  await prisma.defect.deleteMany();
  await prisma.execution.deleteMany();
  await prisma.cycle.deleteMany();
  await prisma.sprint.deleteMany();
  await prisma.suiteCase.deleteMany();
  await prisma.suite.deleteMany();
  await prisma.testCaseStep.deleteMany();
  await prisma.testCase.deleteMany();
  await prisma.scenario.deleteMany();
  await prisma.module.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding database...');

  const user = await prisma.user.create({
    data: {
      email: 'admin@qahub.local',
      name: 'Admin User',
      password: 'password123', // In a real app this would be hashed
      role: 'ADMIN'
    }
  });

  const project1 = await prisma.project.create({
    data: {
      key: 'ASP',
      name: 'Assessment Platform',
      description: 'Online assessment platform',
      ownerId: user.id,
      modules: {
        create: [
          { name: 'Authentication' },
          { name: 'Student Registration' },
          { name: 'Examination' }
        ]
      }
    }
  });

  const modules = await prisma.module.findMany({ where: { projectId: project1.id } });
  const authModule = modules.find(m => m.name === 'Authentication');

  const scenario1 = await prisma.scenario.create({
    data: {
      title: 'User Login',
      description: 'Verify login functionality',
      projectId: project1.id,
      moduleId: authModule.id,
    }
  });

  const tc1 = await prisma.testCase.create({
    data: {
      caseId: 'TC-001',
      title: 'Verify login with valid credentials',
      description: 'User should be able to login with valid username and password',
      projectId: project1.id,
      moduleId: authModule.id,
      scenarioId: scenario1.id,
      preconditions: 'User must be registered',
      steps: {
        create: [
          { stepNumber: 1, action: 'Open login page', expectedResult: 'Login page is displayed' },
          { stepNumber: 2, action: 'Enter valid username', expectedResult: 'Username is entered' },
          { stepNumber: 3, action: 'Enter valid password', expectedResult: 'Password is entered' },
          { stepNumber: 4, action: 'Click Login', expectedResult: 'User is logged in successfully' },
        ]
      }
    }
  });

  const tc2 = await prisma.testCase.create({
    data: {
      caseId: 'TC-002',
      title: 'Verify login with invalid credentials',
      projectId: project1.id,
      moduleId: authModule.id,
      scenarioId: scenario1.id,
      steps: {
        create: [
          { stepNumber: 1, action: 'Open login page' },
          { stepNumber: 2, action: 'Enter invalid credentials', testData: 'wrong@user.com' },
          { stepNumber: 3, action: 'Click Login', expectedResult: 'Error message is shown' },
        ]
      }
    }
  });

  const suite1 = await prisma.suite.create({
    data: {
      name: 'Smoke Test Suite',
      projectId: project1.id,
      cases: {
        create: [
          { testCaseId: tc1.id },
          { testCaseId: tc2.id }
        ]
      }
    }
  });

  const sprint1 = await prisma.sprint.create({
    data: {
      name: 'Sprint 24',
      status: 'ACTIVE',
      projectId: project1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    }
  });

  const cycle1 = await prisma.cycle.create({
    data: {
      name: 'Sprint 24 Smoke Testing',
      projectId: project1.id,
      sprintId: sprint1.id,
      suiteId: suite1.id,
      status: 'IN_PROGRESS',
      environment: 'QA'
    }
  });

  const exec1 = await prisma.execution.create({
    data: {
      testCaseId: tc1.id,
      cycleId: cycle1.id,
      sprintId: sprint1.id,
      environment: 'QA',
      status: 'PASS',
      actualResult: 'Logged in successfully',
      executedBy: user.id
    }
  });

  const exec2 = await prisma.execution.create({
    data: {
      testCaseId: tc2.id,
      cycleId: cycle1.id,
      sprintId: sprint1.id,
      environment: 'QA',
      status: 'FAIL',
      actualResult: 'Server returns 500 instead of 401',
      executedBy: user.id
    }
  });

  const defect1 = await prisma.defect.create({
    data: {
      defectId: 'DEF-001',
      title: 'Login API returns 500 for invalid credentials',
      projectId: project1.id,
      severity: 'HIGH',
      status: 'OPEN',
      executions: {
        create: [
          { executionId: exec2.id }
        ]
      }
    }
  });

  console.log('Database seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
