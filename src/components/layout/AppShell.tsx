import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { TickerMarquee } from '@/components/ui/TickerMarquee';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

interface AppShellProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ activeTab, onSelectTab, children }) => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentDept, setStudentDept] = useState('Computer Science');
  const { registerStudent } = useAuth();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail) return;
    registerStudent(studentName, studentEmail, studentDept);
    setIsRegisterOpen(false);
    setStudentName('');
    setStudentEmail('');
    onSelectTab('student-dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F4F0EA] flex flex-col text-black antialiased">
      <Navbar onOpenRegisterModal={() => setIsRegisterOpen(true)} />
      <TickerMarquee />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full neo-grid-subtle">
          {children}
        </main>
      </div>

      {/* Student Self-Registration Neo-Brutalist Modal */}
      <Dialog 
        open={isRegisterOpen} 
        onOpenChange={setIsRegisterOpen} 
        windowTitle="student_registration.form" 
        headerColor="lime"
      >
        <DialogHeader>
          <DialogTitle>Student Registration</DialogTitle>
          <DialogDescription>
            Join Cognify to enrol in outcome-based courses, take AI assessments, and receive personalized Bloom competency analytics.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Full Name</label>
            <Input
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Jordan Lee"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Email Address</label>
            <Input
              type="email"
              required
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder="e.g. jordan.lee@student.cognify.edu"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Academic Department</label>
            <Input
              value={studentDept}
              onChange={(e) => setStudentDept(e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="white" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Complete Registration ✦
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
