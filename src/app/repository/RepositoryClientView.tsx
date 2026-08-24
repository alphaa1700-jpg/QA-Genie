"use client";

import { useState } from "react";
import { Folder, FileText, ChevronRight, Sparkles } from "lucide-react";
import AITestCaseModal from "./AITestCaseModal";

export default function RepositoryClientView({ projects }: { projects: any[] }) {
  const [selectedModule, setSelectedModule] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-full">
      {/* Sidebar Tree */}
      <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-800">Test Repository</h2>
        </div>
        <div className="p-2">
          {projects.map(project => (
            <div key={project.id} className="mb-2">
              <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-800 cursor-default">
                <ChevronRight size={16} className="text-gray-400" />
                <Folder size={16} className="text-blue-500" />
                {project.name}
              </div>
              <div className="pl-6 border-l border-gray-200 ml-4 mt-1 space-y-1">
                {project.modules.map((module: any) => (
                  <div 
                    key={module.id} 
                    onClick={() => setSelectedModule(module)}
                    className={`flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded text-sm cursor-pointer ${selectedModule?.id === module.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                  >
                    <Folder size={14} className={selectedModule?.id === module.id ? "text-blue-600" : "text-blue-400"} />
                    {module.name}
                    <span className="ml-auto text-xs text-gray-400">{module.testCases.length}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {selectedModule ? selectedModule.name : "Test Cases"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {selectedModule ? "Manage test cases for this module." : "Select a module to view test cases."}
              </p>
            </div>
            {selectedModule && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium text-sm flex items-center gap-2"
              >
                <Sparkles size={16} /> AI Generate Test Case
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-auto">
           {!selectedModule ? (
             <div className="bg-white p-12 rounded-lg border border-dashed border-gray-300 flex flex-col items-center justify-center text-center h-64">
               <FileText size={48} className="text-gray-300 mb-4" />
               <h3 className="text-lg font-medium text-gray-900">Select a Module</h3>
               <p className="text-gray-500 max-w-sm mt-2">
                 Choose a module from the repository tree on the left to view and manage its test cases.
               </p>
             </div>
           ) : (
             <div className="space-y-4">
               {selectedModule.testCases.length === 0 ? (
                 <p className="text-gray-500 text-center py-8">No test cases in this module yet.</p>
               ) : (
                 selectedModule.testCases.map((tc: any) => (
                   <div key={tc.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                     <h3 className="font-medium text-blue-700">{tc.caseId}: {tc.title}</h3>
                     <p className="text-sm text-gray-600 mt-1">{tc.description}</p>
                   </div>
                 ))
               )}
             </div>
           )}
        </div>
      </div>

      {selectedModule && (
        <AITestCaseModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          projectId={selectedModule.projectId}
          moduleId={selectedModule.id}
        />
      )}
    </div>
  );
}
