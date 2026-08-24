import Link from "next/link";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const projectsCount = await prisma.project.count();
  const testCasesCount = await prisma.testCase.count();
  const executionsCount = await prisma.execution.count();
  const defectsCount = await prisma.defect.count({ where: { status: "OPEN" } });
  
  const executions = await prisma.execution.findMany();
  const passCount = executions.filter(e => e.status === "PASS").length;
  const passRate = executions.length ? Math.round((passCount / executions.length) * 100) : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">QA-Genie Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{projectsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Test Cases</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{testCasesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Total Executions</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{executionsCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Open Defects</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{defectsCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4">Pass Rate Overview</h2>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div className="bg-green-500 h-4 rounded-full" style={{ width: `${passRate}%` }}></div>
        </div>
        <p className="text-gray-600">Current pass rate: <span className="font-bold text-gray-900">{passRate}%</span></p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
           <ul className="space-y-3">
             <li><Link href="/projects" className="text-blue-600 hover:underline">View Projects</Link></li>
             <li><Link href="/repository" className="text-blue-600 hover:underline">Test Repository</Link></li>
             <li><Link href="/executions" className="text-blue-600 hover:underline">Test Executions</Link></li>
             <li><Link href="/defects" className="text-blue-600 hover:underline">Defects</Link></li>
           </ul>
         </div>
      </div>
    </div>
  );
}
