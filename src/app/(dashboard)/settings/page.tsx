"use client";

import { useState } from "react";
import { saveGeminiKey } from "@/actions/settings";
import { Key } from "lucide-react";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    try {
      await saveGeminiKey(apiKey);
      setStatus("Saved successfully!");
      setApiKey(""); // clear it for security in this demo
    } catch (e) {
      setStatus("Error saving key.");
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
           <Key size={20} className="text-blue-600" />
           AI Integration (Google Gemini)
        </h2>
        <p className="text-gray-600 text-sm mb-6">
           Enter your Google Gemini API key to enable AI-powered test case generation and analysis.
           This key will be stored securely and used only for your account.
        </p>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gemini API Key</label>
            <input 
              type="password"
              placeholder="AIzaSy..." 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" 
              required
            />
          </div>
          <div className="flex items-center gap-4">
            <button 
              type="submit" 
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
            >
              Save Key
            </button>
            {status && <span className="text-sm text-gray-600">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
