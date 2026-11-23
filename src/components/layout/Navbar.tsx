import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types';
import { Sparkles, User, Shield, GraduationCap, Compass } from 'lucide-react';

interface NavbarProps {
  onOpenRegisterModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenRegisterModal }) => {
  const { currentUser, role, switchRole } = useAuth();

  const getRoleIcon = (r: UserRole) => {
    if (r === 'admin') return <Shield className="w-3.5 h-3.5 text-black" />;
    if (r === 'faculty') return <GraduationCap className="w-3.5 h-3.5 text-black" />;
    return <Compass className="w-3.5 h-3.5 text-black" />;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b-3 border-black select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo in Neo-Brutal Box */}
        <div className="flex items-center gap-3">
          <div className="bg-[#CCFF00] border-2 border-black px-3 py-1 shadow-neo-sm font-black text-xl tracking-tighter flex items-center gap-1.5 uppercase">
            <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
            <span>COGNIFY</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-700 bg-[#FFDE59] px-2 py-0.5 border border-black shadow-[1px_1px_0px_#000]">
            <Sparkles className="w-3 h-3 text-black" />
            <span>AI Competency & Bloom Engine</span>
          </div>
        </div>

        {/* Right side: Role Switcher & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Role Toggle Bar */}
          <div className="flex items-center gap-1 bg-[#F4F0EA] p-1 border-2 border-black shadow-neo-sm">
            <span className="text-[10px] font-black uppercase tracking-wider px-1 text-slate-600 hidden lg:inline">
              Role:
            </span>
            {(['admin', 'faculty', 'student'] as UserRole[]).map((r) => {
              const active = role === r;
              const activeColor = r === 'admin' ? 'bg-[#FF90E8]' : r === 'faculty' ? 'bg-[#CCFF00]' : 'bg-[#70D6FF]';
              return (
                <button
                  key={r}
                  onClick={() => switchRole(r)}
                  className={`flex items-center gap-1 text-xs font-black uppercase tracking-wider px-2.5 py-1 border-2 border-black transition-all ${
                    active
                      ? `${activeColor} text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]`
                      : 'bg-white text-slate-700 hover:bg-[#FFDE59] shadow-none'
                  }`}
                >
                  {getRoleIcon(r)}
                  <span className="capitalize">{r}</span>
                </button>
              );
            })}
          </div>

          {/* Student Register CTA */}
          <button
            onClick={onOpenRegisterModal}
            className="hidden sm:inline-flex items-center text-xs font-black uppercase tracking-wider px-3 py-1.5 bg-[#FFDE59] text-black border-2 border-black shadow-neo-sm hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
          >
            + Register
          </button>

          {/* Current Profile Card */}
          <div className="flex items-center gap-2 pl-2 border-l-2 border-black">
            <div className="w-8 h-8 rounded-full border-2 border-black bg-[#C4B5FD] flex items-center justify-center font-black text-xs text-black shadow-neo-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-black leading-tight text-black truncate max-w-[130px]">
                {currentUser.full_name}
              </div>
              <div className="text-[10px] font-bold text-slate-600 leading-tight">
                {currentUser.department || currentUser.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
