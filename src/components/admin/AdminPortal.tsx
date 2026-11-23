import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cognifyDb } from '@/lib/store';
import { formatDateTime } from '@/lib/utils';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  ShieldCheck, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

interface AdminPortalProps {
  activeTab?: string;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ activeTab = 'admin-overview' }) => {
  const [profiles, setProfiles] = useState(cognifyDb.getProfiles());
  const [courses] = useState(cognifyDb.getCourses());
  const [logs, setLogs] = useState(cognifyDb.getLogs());

  // Search queries
  const [userSearch, setUserSearch] = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  
  // Faculty modal state
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);
  const [facultyName, setFacultyName] = useState('');
  const [facultyEmail, setFacultyEmail] = useState('');
  const [facultyDept, setFacultyDept] = useState('Computer Science');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const facultyList = profiles.filter((p) => p.role === 'faculty');
  const studentList = profiles.filter((p) => p.role === 'student');

  const filteredUsers = profiles.filter((p) => 
    p.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    p.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (p.department && p.department.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.code.toLowerCase().includes(courseSearch.toLowerCase()) ||
    c.department.toLowerCase().includes(courseSearch.toLowerCase())
  );

  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyName || !facultyEmail) return;

    cognifyDb.createFaculty(facultyName, facultyEmail, facultyDept);
    setProfiles(cognifyDb.getProfiles());
    setLogs(cognifyDb.getLogs());
    setIsFacultyModalOpen(false);
    setSuccessMessage(`Faculty member "${facultyName}" successfully provisioned!`);
    setFacultyName('');
    setFacultyEmail('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero matching Mika Sato Neo-Brutalist Header */}
      <div className="border-3 border-black bg-[#FF90E8] p-6 shadow-neo-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#FFDE59] text-xs font-black uppercase tracking-widest border border-black">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Governance Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              ADMIN <span className="bg-white px-2 py-0.5 border-2 border-black inline-block shadow-neo-sm">COMMAND HUB</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black max-w-xl">
              Provision academic faculty, monitor platform-wide student enrolment, inspect curricula, and audit real-time activity telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="lime"
              size="lg"
              onClick={() => setIsFacultyModalOpen(true)}
              className="text-sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              + Create Faculty Account
            </Button>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 border-2 border-black bg-[#CCFF00] shadow-neo font-black text-xs uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      {/* Neo-Brutal Stat Counters (Matching Mika Sato 9, 60+, 34, 0 Boxes) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border-2 border-black bg-white p-4 shadow-neo flex flex-col justify-between">
          <div className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total Faculty</div>
          <div className="text-4xl font-black text-black my-1">{facultyList.length}</div>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 bg-[#CCFF00] border border-black self-start">
            <GraduationCap className="w-3 h-3" /> Instructors Active
          </div>
        </div>

        <div className="border-2 border-black bg-[#FFDE59] p-4 shadow-neo flex flex-col justify-between">
          <div className="text-[10px] font-black uppercase tracking-wider text-black">Enrolled Students</div>
          <div className="text-4xl font-black text-black my-1">{studentList.length}</div>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 bg-white border border-black self-start">
            <Users className="w-3 h-3" /> Learners Registered
          </div>
        </div>

        <div className="border-2 border-black bg-[#C4B5FD] p-4 shadow-neo flex flex-col justify-between">
          <div className="text-[10px] font-black uppercase tracking-wider text-black">Active Courses</div>
          <div className="text-4xl font-black text-black my-1">{courses.length}</div>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 bg-white border border-black self-start">
            <BookOpen className="w-3 h-3" /> Curricula Mapped
          </div>
        </div>

        <div className="border-2 border-black bg-[#70D6FF] p-4 shadow-neo flex flex-col justify-between">
          <div className="text-[10px] font-black uppercase tracking-wider text-black">Audit Telemetry</div>
          <div className="text-4xl font-black text-black my-1">{logs.length}</div>
          <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 bg-white border border-black self-start">
            <ShieldCheck className="w-3 h-3" /> Events Logged
          </div>
        </div>
      </div>

      {/* Main Content Tabs / Sections based on activeTab */}
      {(activeTab === 'admin-overview' || activeTab === 'admin-faculty' || activeTab === 'admin-students') && (
        <Card windowTitle="user_directory.table" headerColor="yellow">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>User & Faculty Directory</CardTitle>
              <CardDescription>
                Search, inspect, and manage university faculty members and registered students.
              </CardDescription>
            </div>
            <div className="w-full sm:w-72">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search user name, email, department..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border-2 border-black">
              <table className="w-full text-left text-xs font-medium border-collapse">
                <thead className="bg-[#FFFDF5] border-b-2 border-black text-black font-black uppercase tracking-wider">
                  <tr>
                    <th className="p-3">User Name</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Joined Date</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black bg-white">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#F8F7FF] transition-colors">
                      <td className="p-3 font-bold text-black flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full border border-black bg-[#FFDE59] flex items-center justify-center font-black text-[10px]">
                          {u.full_name[0]}
                        </div>
                        {u.full_name}
                      </td>
                      <td className="p-3">
                        <Badge 
                          variant={u.role === 'admin' ? 'pink' : u.role === 'faculty' ? 'lime' : 'cyan'}
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono text-[11px] text-slate-700">{u.email}</td>
                      <td className="p-3 text-slate-800 font-semibold">{u.department || 'N/A'}</td>
                      <td className="p-3 text-slate-600">{formatDateTime(u.created_at)}</td>
                      <td className="p-3 text-right">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#CCFF00] border border-black font-black text-[10px] uppercase">
                          <span className="w-1.5 h-1.5 rounded-full bg-black"></span> Active
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-bold uppercase">
                        No users matching search query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses Overview Section */}
      {(activeTab === 'admin-overview' || activeTab === 'admin-courses') && (
        <Card windowTitle="course_catalog.registry" headerColor="lavender">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle>Platform Course Directory</CardTitle>
              <CardDescription>
                Overview of university courses, outcome alignments, and instructor assignments.
              </CardDescription>
            </div>
            <div className="w-full sm:w-72">
              <Input
                icon={<Search className="w-4 h-4" />}
                placeholder="Search courses or codes..."
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCourses.map((c) => (
                <div key={c.id} className="border-2 border-black bg-white p-4 shadow-neo flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-black text-[#CCFF00] font-black text-xs border border-black font-mono">
                        {c.code}
                      </span>
                      <span className="text-[11px] font-bold text-slate-600">{c.department}</span>
                    </div>
                    <h4 className="text-base font-black text-black uppercase">{c.title}</h4>
                    <p className="text-xs text-slate-700 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-xs font-bold text-black">
                    <div>Instructor: <span className="underline">{c.faculty_name}</span></div>
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 bg-[#FFDE59] border border-black text-[10px]">
                        {c.outcomes_count || 6} Bloom LOs
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#70D6FF] border border-black text-[10px]">
                        {c.enrolled_count || 0} Enrolled
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Activity Stream */}
      {(activeTab === 'admin-overview' || activeTab === 'admin-audit') && (
        <Card windowTitle="audit_stream.live" headerColor="pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Real-Time Platform Activity Audit Stream
            </CardTitle>
            <CardDescription>
              Chronological log of critical system operations: account provisioning, course publications, assessment completions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {logs.map((log) => (
                <div 
                  key={log.id} 
                  className="p-3 border-2 border-black bg-[#FFFDF5] shadow-neo-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-black uppercase">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-black">{log.details}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-600">
                    <span className="font-mono text-black font-bold">{log.user_email}</span>
                    <span>•</span>
                    <span>{formatDateTime(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Faculty Creation Modal */}
      <Dialog
        open={isFacultyModalOpen}
        onOpenChange={setIsFacultyModalOpen}
        windowTitle="provision_faculty.form"
        headerColor="lime"
      >
        <DialogHeader>
          <DialogTitle>Create Faculty Account</DialogTitle>
          <DialogDescription>
            Provision a new faculty credentials to allow them to create courses, define Bloom's taxonomy outcomes, and generate AI assessments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateFaculty} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
              Faculty Full Name & Title
            </label>
            <Input
              required
              placeholder="e.g. Dr. Maya Lin"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
              Institutional Email
            </label>
            <Input
              type="email"
              required
              placeholder="e.g. maya.lin@cognify.edu"
              value={facultyEmail}
              onChange={(e) => setFacultyEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">
              Academic Department
            </label>
            <Input
              required
              placeholder="e.g. Electrical & Computer Engineering"
              value={facultyDept}
              onChange={(e) => setFacultyDept(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="white" onClick={() => setIsFacultyModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Provision Account ✦
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
