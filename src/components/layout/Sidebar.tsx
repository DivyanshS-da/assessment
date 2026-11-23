import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  FileText, 
  Sparkles, 
  BarChart3, 
  Users, 
  ShieldCheck, 
  GraduationCap,
  Compass,
  FileQuestion,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab }) => {
  const { role } = useAuth();

  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'admin-overview', label: 'Platform Dashboard', icon: LayoutDashboard },
          { id: 'admin-faculty', label: 'Faculty Provisioning', icon: GraduationCap },
          { id: 'admin-students', label: 'Student Directory', icon: Users },
          { id: 'admin-courses', label: 'Course Directory', icon: BookOpen },
          { id: 'admin-audit', label: 'Platform Activity Stream', icon: ShieldCheck },
        ];
      case 'faculty':
        return [
          { id: 'faculty-dashboard', label: 'Faculty Studio', icon: LayoutDashboard },
          { id: 'faculty-courses', label: 'Manage Courses', icon: BookOpen },
          { id: 'faculty-outcomes', label: "Bloom's 6 Tiers Studio", icon: Target },
          { id: 'faculty-materials', label: 'Course Material Vault', icon: FileText },
          { id: 'faculty-ai-gen', label: 'Gemini AI Assessment Gen', icon: Sparkles, badge: 'AI' },
          { id: 'faculty-analytics', label: 'Class Competency & Gaps', icon: BarChart3 },
        ];
      case 'student':
        return [
          { id: 'student-dashboard', label: 'Student Hub', icon: LayoutDashboard },
          { id: 'student-explore', label: 'Browse & Enrol', icon: Compass },
          { id: 'student-materials', label: 'Study Resources', icon: FolderOpen },
          { id: 'student-assessments', label: 'Take Assessments', icon: FileQuestion },
          { id: 'student-radar', label: "My Bloom Competency", icon: BarChart3 },
          { id: 'student-remedials', label: 'Personalized AI Paths', icon: Sparkles, badge: 'AI' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const roleColors = {
    admin: 'bg-[#FF90E8]',
    faculty: 'bg-[#CCFF00]',
    student: 'bg-[#70D6FF]',
  };

  return (
    <aside className="w-64 bg-white border-r-3 border-black flex flex-col justify-between p-4 shrink-0 select-none">
      <div className="space-y-5">
        {/* Workspace Card Header with Traffic Light Dots */}
        <div className="border-2 border-black bg-white shadow-neo-sm overflow-hidden">
          <div className={`px-3 py-1 border-b-2 border-black flex items-center justify-between ${roleColors[role]}`}>
            <span className="font-mono text-[10px] font-black uppercase tracking-tight text-black">
              ooo workspace.cfg
            </span>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-black bg-white"></span>
              <span className="w-2 h-2 rounded-full border border-black bg-black"></span>
            </div>
          </div>
          <div className="p-2.5 bg-[#FFFDF5]">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active Workspace</div>
            <div className="text-sm font-black uppercase text-black capitalize flex items-center gap-1.5 mt-0.5">
              <span>✦</span> {role} Console
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 border-2 border-black text-xs font-black uppercase tracking-wider transition-all text-left ${
                  isActive
                    ? 'bg-[#CCFF00] text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
                    : 'bg-white text-black hover:bg-[#FFDE59] shadow-none'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-black shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black bg-[#FF90E8] text-black border border-black shadow-[1px_1px_0px_#000]">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Box */}
      <div className="pt-4 border-t-2 border-black space-y-2">
        <div className="p-2.5 border-2 border-black bg-[#C4B5FD] shadow-neo-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-wider text-black">Bloom's Taxonomy</div>
          <div className="text-[11px] font-extrabold text-black mt-0.5">6 Outcome Tiers Mapped</div>
        </div>
        <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-600">
          <HelpCircle className="w-3 h-3 text-black" />
          <span>Cognify v1.0 • Neo-Brutalist Edition</span>
        </div>
      </div>
    </aside>
  );
};
