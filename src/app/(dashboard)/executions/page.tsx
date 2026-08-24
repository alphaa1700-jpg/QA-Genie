import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Play, CheckCircle, XCircle, AlertTriangle, MinusCircle, HelpCircle } from "lucide-react";

const prisma = new PrismaClient();

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'PASS':
      return <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1 rounded text-xs font-bold"><CheckCircle size={14} /> PASS</span>;
    case 'FAIL':
      return <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded text-xs font-bold"><XCircle size={14} /> FAIL</span>;
    case 'BLOCKED':
      return <span className="flex items-center gap-1 text-orange-700 bg-orange-50 px-2 py-1 rounded text-xs font-bold"><AlertTriangle size={14} /> BLOCKED</span>;
    case 'SKIPPED':
      return <span className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded text-xs font-bold"><MinusCircle size={14} /> SKIPPED</span>;
    default:
      return <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-1 rounded text-xs font-bold"><HelpCircle size={14} /> NOT RUN</span>;
  }
};

export default async function ExecutionsPage() {
  const executions = await prisma.execution.findMany({
    include: {
      testCase: {
        include: {
          project: true
        }
      },
      cycle: true
    },
    orderBy: { executionDate: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Test Executions</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm flex items-center gap-2">
          <Play size={16} /> Execute Tests
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Test Case</th>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Cycle</th>
                <th className="p-4 font-medium">Environment</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No executions found.
                  </td>
                </tr>
              ) : (
                executions.map(exec => (
                  <tr key={exec.id} className="hover:bg-gray-50 text-sm">
                    <td className="p-4 font-medium text-blue-600 cursor-pointer hover:underline">
                      {exec.testCase.caseId} - {exec.testCase.title}
                    </td>
                    <td className="p-4 text-gray-600">{exec.testCase.project.key}</td>
                    <td className="p-4 text-gray-600">{exec.cycle.name}</td>
                    <td className="p-4 text-gray-600">{exec.environment}</td>
                    <td className="p-4 text-gray-600">{new Date(exec.executionDate).toLocaleDateString()}</td>
                    <td className="p-4"><StatusBadge status={exec.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
