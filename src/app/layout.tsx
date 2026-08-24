import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FolderGit2, 
  BookOpen, 
  Layers, 
  PlayCircle, 
  Bug, 
  BarChart, 
  Settings,
  CalendarDays
} from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QA-Genie",
  description: "Test Management Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 flex h-screen overflow-hidden`}>
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-blue-600 p-1 rounded">QA</span> - Genie
            </h1>
          </div>
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              <NavItem href="/" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem href="/projects" icon={<FolderGit2 size={20} />} label="Projects" />
              <NavItem href="/repository" icon={<BookOpen size={20} />} label="Test Repository" />
              <NavItem href="/suites" icon={<Layers size={20} />} label="Test Suites" />
              <NavItem href="/sprints" icon={<CalendarDays size={20} />} label="Sprints" />
              <NavItem href="/cycles" icon={<PlayCircle size={20} />} label="Test Cycles" />
              <NavItem href="/executions" icon={<PlayCircle size={20} />} label="Executions" />
              <NavItem href="/defects" icon={<Bug size={20} />} label="Defects" />
              <NavItem href="/reports" icon={<BarChart size={20} />} label="Reports" />
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-800">
             <ul className="space-y-1">
               <NavItem href="/settings" icon={<Settings size={20} />} label="Settings" />
             </ul>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between shrink-0">
            <div className="text-gray-500 text-sm">
              Assessment Platform / <span className="font-medium text-gray-900">Current View</span>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                 A
               </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}

function NavItem({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors">
        {icon}
        <span>{label}</span>
      </Link>
    </li>
  );
}
