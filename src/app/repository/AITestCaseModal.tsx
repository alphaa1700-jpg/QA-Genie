"use client";

import { useState } from "react";
import { generateTestCaseAI } from "@/actions/ai";
import { Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AITestCaseModal({ 
  isOpen, 
  onClose,
  projectId,
  moduleId 
}: { 
  isOpen: boolean, 
  onClose: () => void,
  projectId: string,
  moduleId: string
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!title) return;
    setLoading(true);
    setError("");
    try {
      await generateTestCaseAI(title, projectId, moduleId);
      setLoading(false);
      onClose();
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Sparkles className="text-blue-600" size={20} />
            AI Test Case Generator
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What do you want to test?
          </label>
          <input 
            type="text"
            placeholder="e.g. Verify password reset flow with invalid email"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleGenerate}
            disabled={loading || !title}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Generating..." : "Generate Test Case"}
          </button>
        </div>
      </div>
    </div>
  );
}
