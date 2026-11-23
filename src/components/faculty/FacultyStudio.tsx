import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cognifyDb } from '@/lib/store';
import { BloomLevel, Course } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getBloomColor } from '@/lib/utils';
import { 
  Target, 
  FileText, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Upload, 
  BarChart3, 
  Sparkles,
  Layers
} from 'lucide-react';

interface FacultyStudioProps {
  activeTab?: string;
  onNavigateToAiGen?: (courseId: string) => void;
}

export const FacultyStudio: React.FC<FacultyStudioProps> = ({ 
  activeTab = 'faculty-dashboard',
  onNavigateToAiGen 
}) => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>(cognifyDb.getCourses());
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'crs-1');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Learning outcomes for active course
  const [outcomes, setOutcomes] = useState(cognifyDb.getOutcomesByCourse(selectedCourseId));
  const [materials, setMaterials] = useState(cognifyDb.getMaterialsByCourse(selectedCourseId));

  // Course creation modal state
  const [isNewCourseOpen, setIsNewCourseOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState(currentUser.department || 'Computer Science');
  const [newDesc, setNewDesc] = useState('');

  // Outcome creation modal state
  const [isNewOutcomeOpen, setIsNewOutcomeOpen] = useState(false);
  const [outcomeBloom, setOutcomeBloom] = useState<BloomLevel>('apply');
  const [outcomeCode, setOutcomeCode] = useState('');
  const [outcomeDesc, setOutcomeDesc] = useState('');
  const [outcomeWeight, setOutcomeWeight] = useState(3);

  // Material upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialDesc, setMaterialDesc] = useState('');

  // Feedback notifications
  const [flashMsg, setFlashMsg] = useState<string | null>(null);

  const bloomLevels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

  const refreshCourseData = (courseId: string) => {
    setSelectedCourseId(courseId);
    setOutcomes(cognifyDb.getOutcomesByCourse(courseId));
    setMaterials(cognifyDb.getMaterialsByCourse(courseId));
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newTitle) return;

    const created = cognifyDb.createCourse(newCode, newTitle, newDesc, newDept, currentUser.id);
    setCourses(cognifyDb.getCourses());
    refreshCourseData(created.id);
    setIsNewCourseOpen(false);
    setNewCode('');
    setNewTitle('');
    setNewDesc('');
    setFlashMsg(`Course ${created.code} successfully created!`);
    setTimeout(() => setFlashMsg(null), 3500);
  };

  const handleAddOutcome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcomeCode || !outcomeDesc) return;

    cognifyDb.addLearningOutcome(selectedCourseId, outcomeBloom, outcomeCode, outcomeDesc, outcomeWeight);
    setOutcomes(cognifyDb.getOutcomesByCourse(selectedCourseId));
    setCourses(cognifyDb.getCourses());
    setIsNewOutcomeOpen(false);
    setOutcomeCode('');
    setOutcomeDesc('');
    setFlashMsg(`Defined Bloom Outcome [${outcomeBloom.toUpperCase()}]!`);
    setTimeout(() => setFlashMsg(null), 3500);
  };

  const handleUploadMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle) return;

    cognifyDb.uploadCourseMaterial(selectedCourseId, materialTitle, materialDesc);
    setMaterials(cognifyDb.getMaterialsByCourse(selectedCourseId));
    setCourses(cognifyDb.getCourses());
    setIsUploadOpen(false);
    setMaterialTitle('');
    setMaterialDesc('');
    setFlashMsg(`Material "${materialTitle}" added to course vault!`);
    setTimeout(() => setFlashMsg(null), 3500);
  };

  const analytics = cognifyDb.getCourseClassAnalytics(selectedCourseId);

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="border-3 border-black bg-[#CCFF00] p-6 shadow-neo-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#CCFF00] text-xs font-black uppercase tracking-widest border border-black">
              <Layers className="w-3.5 h-3.5" />
              <span>Instructional Studio & Bloom Framework</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              FACULTY <span className="bg-white px-2 py-0.5 border-2 border-black inline-block shadow-neo-sm">COURSE STUDIO</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black max-w-xl">
              Architect competency-aligned curricula across all six Bloom's taxonomy levels, deposit learning materials, and initiate AI assessment pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="white" onClick={() => setIsNewCourseOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              New Course
            </Button>
            <Button 
              variant="dark" 
              onClick={() => onNavigateToAiGen?.(selectedCourseId)}
              className="text-white"
            >
              <Sparkles className="w-4 h-4 mr-2 text-[#CCFF00]" />
              Launch Gemini Generator
            </Button>
          </div>
        </div>
      </div>

      {flashMsg && (
        <div className="p-3 border-2 border-black bg-[#FFDE59] shadow-neo font-black text-xs uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{flashMsg}</span>
          </div>
          <button onClick={() => setFlashMsg(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      {/* Course Selector Tabs Bar */}
      <div className="border-2 border-black bg-white p-3 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 whitespace-nowrap">
            Selected Course:
          </span>
          {courses.map((c) => (
            <button
              key={c.id}
              onClick={() => refreshCourseData(c.id)}
              className={`px-3 py-1.5 text-xs font-black uppercase border-2 border-black whitespace-nowrap transition-all ${
                selectedCourseId === c.id
                  ? 'bg-[#FFDE59] text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
                  : 'bg-white text-black hover:bg-slate-100'
              }`}
            >
              {c.code}
            </button>
          ))}
        </div>

        <div className="text-xs font-bold text-slate-600 truncate">
          Active: <span className="text-black font-black">{selectedCourse?.title}</span>
        </div>
      </div>

      {/* Section 1: Bloom's Taxonomy 6-Level Outcomes Manager */}
      {(activeTab === 'faculty-dashboard' || activeTab === 'faculty-outcomes') && (
        <Card windowTitle="bloom_outcomes_matrix.cfg" headerColor="lavender">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-black" />
                Bloom's Taxonomy Learning Outcomes Studio
              </CardTitle>
              <CardDescription>
                Define explicit competencies anchored to all 6 cognitive tiers. Assessments generated by Gemini will directly validate these outcomes.
              </CardDescription>
            </div>
            <Button variant="lime" size="sm" onClick={() => setIsNewOutcomeOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Add Outcome
            </Button>
          </CardHeader>
          <CardContent>
            {/* 6 Bloom Levels Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bloomLevels.map((lvl) => {
                const lvlOutcomes = outcomes.filter((o) => o.bloom_level === lvl);
                const bloomInfo = getBloomColor(lvl);

                return (
                  <div key={lvl} className="border-2 border-black bg-white shadow-neo flex flex-col justify-between">
                    <div className={`p-2.5 border-b-2 border-black flex items-center justify-between ${bloomInfo.bg}`}>
                      <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
                        ✦ {lvl}
                      </span>
                      <span className="px-1.5 py-0.2 bg-white text-black border border-black text-[10px] font-black">
                        {lvlOutcomes.length} Defined
                      </span>
                    </div>

                    <div className="p-3 space-y-2 flex-1">
                      {lvlOutcomes.length === 0 ? (
                        <div className="py-6 text-center text-xs font-bold text-slate-400 italic">
                          No outcome defined yet for Level {bloomLevels.indexOf(lvl) + 1}.
                        </div>
                      ) : (
                        lvlOutcomes.map((o) => (
                          <div key={o.id} className="p-2 border border-black bg-[#FFFDF5] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-black bg-black text-white px-1.5">
                                {o.code}
                              </span>
                              <span className="text-[10px] font-bold text-slate-600">
                                Weight: {o.weight}x
                              </span>
                            </div>
                            <p className="text-xs font-semibold text-black leading-snug">{o.description}</p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-2 border-t border-black bg-slate-50 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setOutcomeBloom(lvl);
                          setOutcomeCode(`LO-${bloomLevels.indexOf(lvl) + 1}.${lvlOutcomes.length + 1}`);
                          setIsNewOutcomeOpen(true);
                        }}
                        className="text-[10px] font-black uppercase text-black hover:underline"
                      >
                        + Add {lvl} Outcome
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Course Materials Vault */}
      {(activeTab === 'faculty-dashboard' || activeTab === 'faculty-materials') && (
        <Card windowTitle="course_material_vault.res" headerColor="cyan">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-black" />
                Course Materials & Study Vault
              </CardTitle>
              <CardDescription>
                Deposit syllabus modules, lecture slides, and research notes. Gemini parses these materials to contextualize question generation.
              </CardDescription>
            </div>
            <Button variant="yellow" size="sm" onClick={() => setIsUploadOpen(true)}>
              <Upload className="w-4 h-4 mr-1.5" />
              Upload Document
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {materials.map((m) => (
                <div key={m.id} className="border-2 border-black bg-white p-4 shadow-neo flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#FFDE59] border border-black font-black text-[10px] uppercase">
                        {m.file_type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-600 font-bold">{m.file_size}</span>
                    </div>
                    <h4 className="text-sm font-black text-black leading-snug">{m.title}</h4>
                    <p className="text-xs text-slate-700 font-medium">{m.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">Uploaded</span>
                    <button className="text-xs font-black uppercase text-indigo-700 hover:underline">
                      Download ↓
                    </button>
                  </div>
                </div>
              ))}
              {materials.length === 0 && (
                <div className="col-span-3 py-10 text-center font-bold text-slate-500 uppercase">
                  No materials uploaded yet for this course.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Class Performance & Learning Gap Analytics */}
      {(activeTab === 'faculty-dashboard' || activeTab === 'faculty-analytics') && (
        <Card windowTitle="class_analytics_and_gaps.telemetry" headerColor="pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-black" />
              Class Performance & Bloom Learning Gaps
            </CardTitle>
            <CardDescription>
              Real telemetry synthesized from student submissions across all Bloom levels.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stat summaries */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="border-2 border-black bg-[#CCFF00] p-4 shadow-neo">
                <div className="text-[10px] font-black uppercase text-black">Class Mastery Average</div>
                <div className="text-3xl font-black text-black mt-1">{analytics.classAverage}%</div>
                <div className="text-[10px] font-bold text-black mt-1">Based on active cohort submissions</div>
              </div>

              <div className="border-2 border-black bg-white p-4 shadow-neo">
                <div className="text-[10px] font-black uppercase text-slate-600">Total Submissions Graded</div>
                <div className="text-3xl font-black text-black mt-1">{analytics.totalSubmissions}</div>
                <div className="text-[10px] font-bold text-slate-600 mt-1">Instant automatic evaluation</div>
              </div>

              <div className="border-2 border-black bg-[#FF8A50] p-4 shadow-neo">
                <div className="text-[10px] font-black uppercase text-black">Identified Learning Gaps</div>
                <div className="text-3xl font-black text-black mt-1">{analytics.identifiedGaps.length}</div>
                <div className="text-[10px] font-black uppercase text-black mt-1">
                  Requires Remedial Attention
                </div>
              </div>
            </div>

            {/* Bloom Mastery Breakdown Across Entire Class */}
            <div className="border-2 border-black bg-white p-4 shadow-neo space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-black">
                Class-Wide Bloom's Taxonomy Cognitive Mastery Spectrum
              </h4>
              <div className="space-y-3">
                {analytics.bloomBreakdown.map((b) => (
                  <div key={b.level} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-black uppercase">
                      <span className="flex items-center gap-1.5">
                        <Badge variant="bloom" bloomLevel={b.level as BloomLevel} />
                        {b.isGap && (
                          <span className="px-1.5 py-0.2 bg-[#FF5C5C] text-black border border-black text-[9px] font-black">
                            GAP DETECTED
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-black">{b.score}%</span>
                    </div>
                    <div className="h-3 border-2 border-black bg-slate-100 overflow-hidden shadow-neo-sm">
                      <div
                        className={`h-full border-r-2 border-black ${
                          b.isGap ? 'bg-[#FF5C5C]' : b.score >= 80 ? 'bg-[#CCFF00]' : 'bg-[#FFDE59]'
                        }`}
                        style={{ width: `${b.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gap Action Plan Notification */}
            {analytics.identifiedGaps.length > 0 && (
              <div className="p-4 border-2 border-black bg-[#FFFDF5] shadow-neo space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#FF5C5C]">
                  <AlertTriangle className="w-4 h-4 text-black" />
                  <span>Instructor Remedial Action Advisory</span>
                </div>
                <p className="text-xs font-bold text-black leading-relaxed">
                  Students are demonstrating critical conceptual difficulty in <strong>Bloom [EVALUATE]</strong> (45% class average). 
                  Recommended action: upload supplementary synthesis case studies or conduct a targeted live review on architectural trade-offs.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal: Create Course */}
      <Dialog
        open={isNewCourseOpen}
        onOpenChange={setIsNewCourseOpen}
        windowTitle="new_course.builder"
        headerColor="lime"
      >
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            Register an academic course. Once established, you can define its Bloom learning outcomes and deposit materials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateCourse} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Course Code</label>
              <Input
                required
                placeholder="e.g. CS-450"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Department</label>
              <Input
                required
                value={newDept}
                onChange={(e) => setNewDept(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Course Title</label>
            <Input
              required
              placeholder="e.g. Distributed Systems & Cloud Architecture"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Course Syllabus Overview</label>
            <Input
              placeholder="Summary of course scope and goals..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="white" onClick={() => setIsNewCourseOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="lime">
              Create Course ✦
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal: Define Learning Outcome */}
      <Dialog
        open={isNewOutcomeOpen}
        onOpenChange={setIsNewOutcomeOpen}
        windowTitle="define_outcome.lo"
        headerColor="yellow"
      >
        <DialogHeader>
          <DialogTitle>Define Bloom's Taxonomy Outcome</DialogTitle>
          <DialogDescription>
            Map an instructional objective to one of the 6 cognitive domains.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddOutcome} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Bloom Level</label>
              <select
                value={outcomeBloom}
                onChange={(e) => setOutcomeBloom(e.target.value as BloomLevel)}
                className="w-full h-11 border-2 border-black bg-white px-3 text-xs font-black uppercase shadow-neo-sm focus:outline-none"
              >
                {bloomLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    Level {bloomLevels.indexOf(lvl) + 1}: {lvl.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-black uppercase text-black mb-1">Outcome Code</label>
              <Input
                required
                placeholder="e.g. LO-3.2"
                value={outcomeCode}
                onChange={(e) => setOutcomeCode(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Competency Description</label>
            <Input
              required
              placeholder="e.g. Implement Dijkstra shortest path using a priority queue..."
              value={outcomeDesc}
              onChange={(e) => setOutcomeDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Weight Multiplier (1-5)</label>
            <Input
              type="number"
              min={1}
              max={5}
              value={outcomeWeight}
              onChange={(e) => setOutcomeWeight(Number(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="white" onClick={() => setIsNewOutcomeOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="yellow">
              Save Outcome ✦
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Modal: Upload Material */}
      <Dialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        windowTitle="upload_vault.io"
        headerColor="cyan"
      >
        <DialogHeader>
          <DialogTitle>Upload Course Material</DialogTitle>
          <DialogDescription>
            Add notes, slides, or reading material to the course repository.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUploadMaterial} className="space-y-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Document Title</label>
            <Input
              required
              placeholder="e.g. Lecture 4: Balanced Tree Rotations.pdf"
              value={materialTitle}
              onChange={(e) => setMaterialTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">Description / Topic Tags</label>
            <Input
              placeholder="e.g. Covers AVL and Red-Black tree rotation algorithms..."
              value={materialDesc}
              onChange={(e) => setMaterialDesc(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="white" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cyan">
              Upload Material ✦
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
};
