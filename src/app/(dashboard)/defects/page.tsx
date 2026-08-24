import { PrismaClient } from "@prisma/client";
import { Bug, Plus } from "lucide-react";

const prisma = new PrismaClient();

const SeverityBadge = ({ severity }: { severity: string }) => {
  switch (severity) {
    case 'CRITICAL':
      return <span className="text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-bold border border-red-200">CRITICAL</span>;
    case 'HIGH':
      return <span className="text-orange-700 bg-orange-100 px-2 py-1 rounded text-xs font-bold border border-orange-200">HIGH</span>;
    case 'MEDIUM':
      return <span className="text-yellow-700 bg-yellow-100 px-2 py-1 rounded text-xs font-bold border border-yellow-200">MEDIUM</span>;
    case 'LOW':
      return <span className="text-blue-700 bg-blue-100 px-2 py-1 rounded text-xs font-bold border border-blue-200">LOW</span>;
    default:
      return <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs font-bold border border-gray-200">{severity}</span>;
  }
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === 'OPEN') return <span className="text-red-600 font-semibold text-xs">● OPEN</span>;
  if (status === 'IN_PROGRESS') return <span className="text-blue-600 font-semibold text-xs">● IN PROGRESS</span>;
  if (status === 'FIXED') return <span className="text-green-600 font-semibold text-xs">● FIXED</span>;
  if (status === 'CLOSED') return <span className="text-gray-500 font-semibold text-xs">● CLOSED</span>;
  return <span className="text-gray-500 font-semibold text-xs">● {status}</span>;
}

export default async function DefectsPage() {
  const defects = await prisma.defect.findMany({
    include: {
      project: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Defects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm flex items-center gap-2">
          <Plus size={16} /> Report Defect
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Project</th>
                <th className="p-4 font-medium">Severity</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {defects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Bug size={32} className="text-gray-300 mb-2" />
                      <p>No defects reported yet.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                defects.map(defect => (
                  <tr key={defect.id} className="hover:bg-gray-50 text-sm">
                    <td className="p-4 font-medium text-gray-900">{defect.defectId}</td>
                    <td className="p-4 font-medium text-blue-600 cursor-pointer hover:underline max-w-md truncate">
                      {defect.title}
                    </td>
                    <td className="p-4 text-gray-600">{defect.project.key}</td>
                    <td className="p-4"><SeverityBadge severity={defect.severity} /></td>
                    <td className="p-4"><StatusBadge status={defect.status} /></td>
                    <td className="p-4 text-gray-600">{new Date(defect.createdAt).toLocaleDateString()}</td>
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
