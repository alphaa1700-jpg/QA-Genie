import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

const prisma = new PrismaClient();

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      owner: true,
      _count: {
        select: {
          testCases: true,
          defects: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} />
          New Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search projects..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
                <th className="p-4 font-medium">Key</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Owner</th>
                <th className="p-4 font-medium text-right">Tests</th>
                <th className="p-4 font-medium text-right">Defects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No projects found. Create one to get started.
                  </td>
                </tr>
              ) : (
                projects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{project.key}</td>
                    <td className="p-4">
                      <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline font-medium">
                        {project.name}
                      </Link>
                      {project.description && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">{project.description}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        {project.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-700">{project.owner.name}</td>
                    <td className="p-4 text-right text-sm text-gray-700">{project._count.testCases}</td>
                    <td className="p-4 text-right text-sm text-gray-700">{project._count.defects}</td>
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
