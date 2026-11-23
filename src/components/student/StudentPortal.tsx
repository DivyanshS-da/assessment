import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cognifyDb } from '@/lib/store';
import { Course, Assessment, AssessmentQuestion, StudentSubmission } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  FileText, 
  FileQuestion, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Compass,
  Award
} from 'lucide-react';

interface StudentPortalProps {
  activeTab?: string;
  onNavigateToRadar?: () => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({ 
  activeTab = 'student-dashboard',
  onNavigateToRadar 
}) => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>(cognifyDb.getCourses());
  const [assessments, setAssessments] = useState<Assessment[]>(cognifyDb.getAssessments());
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(
    cognifyDb.getSubmissionsByStudent(currentUser.id)
  );

  // Active exam session state
  const [activeExam, setActiveExam] = useState<Assessment | null>(null);
  const [examQuestions, setExamQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(20 * 60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [justCompletedSubmission, setJustCompletedSubmission] = useState<StudentSubmission | null>(null);

  // Feedback notifications
  const [flashMsg, setFlashMsg] = useState<string | null>(null);

  // Synchronize on mount and updates
  useEffect(() => {
    setCourses(cognifyDb.getCourses());
    setAssessments(cognifyDb.getAssessments());
    setSubmissions(cognifyDb.getSubmissionsByStudent(currentUser.id));
  }, [currentUser.id]);

  // Exam timer countdown
  useEffect(() => {
    if (!activeExam) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeExam]);

  const handleEnroll = (courseId: string) => {
    cognifyDb.enroll(currentUser.id, courseId);
    setCourses(cognifyDb.getCourses());
    setFlashMsg('Successfully enrolled in course!');
    setTimeout(() => setFlashMsg(null), 3000);
  };

  const handleStartExam = (assessment: Assessment) => {
    const questions = cognifyDb.getQuestionsByAssessment(assessment.id);
    if (questions.length === 0) {
      alert('No questions in this assessment.');
      return;
    }
    setActiveExam(assessment);
    setExamQuestions(questions);
    setCurrentQIndex(0);
    setSelectedAnswers({});
    setTimeLeftSeconds(assessment.time_limit_minutes * 60);
    setJustCompletedSubmission(null);
  };

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleFinishExam = () => {
    if (!activeExam) return;
    setIsSubmitting(true);
    const result = cognifyDb.submitAssessment(activeExam.id, currentUser.id, selectedAnswers);
    setSubmissions(cognifyDb.getSubmissionsByStudent(currentUser.id));
    setActiveExam(null);
    setIsSubmitting(false);
    setJustCompletedSubmission(result);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = examQuestions[currentQIndex];

  // If in an active exam session, render the distraction-free Neo-Brutalist Exam Engine
  if (activeExam && currentQuestion) {
    return (
      <div className="space-y-6">
        {/* Exam Header Bar */}
        <div className="border-3 border-black bg-[#CCFF00] p-4 shadow-neo flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] font-black uppercase tracking-wider bg-black text-[#CCFF00] px-2 py-0.5">
              ACTIVE TIMED TEST
            </span>
            <h2 className="text-xl font-black uppercase text-black">{activeExam.title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white border-2 border-black font-mono font-black text-sm shadow-neo-sm">
              <Clock className="w-4 h-4 text-[#FFDE59]" />
              <span>{formatTimer(timeLeftSeconds)}</span>
            </div>
            <Button variant="pink" size="sm" onClick={handleFinishExam} isLoading={isSubmitting}>
              Submit Exam ✦
            </Button>
          </div>
        </div>

        {/* Question Navigator Pills */}
        <div className="border-2 border-black bg-white p-3 shadow-neo flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] font-black uppercase text-slate-500 mr-2">Questions:</span>
          {examQuestions.map((q, idx) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const isCurrent = currentQIndex === idx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQIndex(idx)}
                className={`w-9 h-9 border-2 border-black font-mono font-black text-xs transition-all ${
                  isCurrent
                    ? 'bg-[#FFDE59] text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
                    : isAnswered
                    ? 'bg-[#CCFF00] text-black'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                Q{idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active Question Card */}
        <Card windowTitle={`question_${currentQIndex + 1}_of_${examQuestions.length}.q`} headerColor="lavender">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black pb-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5">
                QUESTION {currentQIndex + 1}
              </span>
              <Badge variant="bloom" bloomLevel={currentQuestion.bloom_level} />
            </div>
            <span className="font-mono text-xs font-black text-black">
              {currentQuestion.points} Points
            </span>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <p className="text-base sm:text-lg font-black text-black leading-snug">
              {currentQuestion.question_text}
            </p>

            <div className="space-y-3">
              {currentQuestion.options?.map((opt) => {
                const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(currentQuestion.id, opt.id)}
                    className={`w-full p-4 border-2 border-black text-left font-bold text-sm transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#CCFF00] text-black shadow-neo translate-x-[-2px] translate-y-[-2px]'
                        : 'bg-white text-black hover:bg-[#FFFDF5] shadow-neo-sm'
                    }`}
                  >
                    <span>{opt.text}</span>
                    <span className="font-mono text-xs font-black px-2 py-0.5 border border-black bg-white">
                      {isSelected ? '✓ SELECTED' : 'CHOOSE'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pagination Controls */}
            <div className="pt-4 border-t-2 border-black flex items-center justify-between">
              <Button
                variant="white"
                disabled={currentQIndex === 0}
                onClick={() => setCurrentQIndex((prev) => prev - 1)}
              >
                ← Previous
              </Button>

              {currentQIndex < examQuestions.length - 1 ? (
                <Button
                  variant="yellow"
                  onClick={() => setCurrentQIndex((prev) => prev + 1)}
                >
                  Next Question →
                </Button>
              ) : (
                <Button variant="lime" onClick={handleFinishExam} isLoading={isSubmitting}>
                  Finish & Submit Test ✦
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-3 border-black bg-[#70D6FF] p-6 shadow-neo-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#70D6FF] text-xs font-black uppercase tracking-widest border border-black">
              <Compass className="w-3.5 h-3.5" />
              <span>Learner Competency Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              STUDENT <span className="bg-white px-2 py-0.5 border-2 border-black inline-block shadow-neo-sm">LEARNING HUB</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black max-w-xl">
              Enrol in courses, inspect study materials, take published assessments, and track your multi-axis cognitive mastery.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="dark" onClick={onNavigateToRadar} className="text-[#CCFF00]">
              <Sparkles className="w-4 h-4 mr-2" />
              View Bloom Radar Chart
            </Button>
          </div>
        </div>
      </div>

      {flashMsg && (
        <div className="p-3 border-2 border-black bg-[#CCFF00] shadow-neo font-black text-xs uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{flashMsg}</span>
          </div>
          <button onClick={() => setFlashMsg(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      {/* Post-Test Result Alert */}
      {justCompletedSubmission && (
        <div className="border-3 border-black bg-[#FFFDF5] p-5 shadow-neo-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-black" />
              <h3 className="text-lg font-black uppercase text-black">
                Assessment Completed & Graded!
              </h3>
            </div>
            <button onClick={() => setJustCompletedSubmission(null)} className="font-bold">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 border-2 border-black bg-[#CCFF00]">
              <div className="text-[10px] font-black uppercase text-black">Total Score</div>
              <div className="text-2xl font-black text-black">
                {justCompletedSubmission.total_score} / {justCompletedSubmission.max_score}
              </div>
            </div>
            <div className="p-3 border-2 border-black bg-[#FFDE59]">
              <div className="text-[10px] font-black uppercase text-black">Percentage</div>
              <div className="text-2xl font-black text-black">
                {justCompletedSubmission.percentage}%
              </div>
            </div>
            <div className="p-3 border-2 border-black bg-[#C4B5FD] flex items-center justify-center">
              <Button variant="dark" size="sm" onClick={onNavigateToRadar} className="text-[#CCFF00]">
                Inspect Bloom Competency Radar →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Take Published Assessments */}
      {(activeTab === 'student-dashboard' || activeTab === 'student-assessments') && (
        <Card windowTitle="available_assessments.quiz" headerColor="yellow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-black" />
              Published Assessments Ready to Take
            </CardTitle>
            <CardDescription>
              Timed competency evaluations testing conceptual recall through synthesis. Instant automated grading upon submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assessments.filter((a) => a.is_published).map((a) => {
                const pastSub = submissions.find((s) => s.assessment_id === a.id);
                return (
                  <div key={a.id} className="border-2 border-black bg-white p-5 shadow-neo flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black bg-black text-[#CCFF00] px-2 py-0.5">
                          {a.course_title || 'CS Course'}
                        </span>
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {a.time_limit_minutes} Mins
                        </span>
                      </div>
                      <h4 className="text-base font-black text-black uppercase leading-tight">{a.title}</h4>
                      <p className="text-xs text-slate-700 font-medium">{a.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                      {pastSub ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#CCFF00] border border-black text-xs font-black">
                            Score: {pastSub.percentage}% ({pastSub.total_score}/{pastSub.max_score})
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-600">Not Attempted</span>
                      )}

                      <Button
                        variant={pastSub ? 'white' : 'lime'}
                        size="sm"
                        onClick={() => handleStartExam(a)}
                      >
                        {pastSub ? 'Retake Exam ✦' : 'Start Assessment ✦'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Course Catalog & Enrolment */}
      {(activeTab === 'student-dashboard' || activeTab === 'student-explore') && (
        <Card windowTitle="course_catalog.browser" headerColor="lavender">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-black" />
              Browse University Courses
            </CardTitle>
            <CardDescription>
              Explore syllabus objectives aligned with Bloom's taxonomy and enrol to access materials and tests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => {
                const enrolled = cognifyDb.isEnrolled(currentUser.id, c.id);
                return (
                  <div key={c.id} className="border-2 border-black bg-white p-5 shadow-neo flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-black bg-black text-[#FFDE59] px-2 py-0.5">
                          {c.code}
                        </span>
                        <span className="text-xs font-bold text-slate-600">{c.department}</span>
                      </div>
                      <h4 className="text-base font-black text-black uppercase leading-tight">{c.title}</h4>
                      <p className="text-xs text-slate-700 font-medium">{c.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                      <div className="text-xs font-bold text-black">
                        Instructor: <span className="underline">{c.faculty_name}</span>
                      </div>

                      {enrolled ? (
                        <span className="px-2.5 py-1 bg-[#CCFF00] border-2 border-black font-black text-xs uppercase flex items-center gap-1 shadow-neo-sm">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled
                        </span>
                      ) : (
                        <Button variant="lime" size="sm" onClick={() => handleEnroll(c.id)}>
                          Enrol in Course +
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section 3: Study Materials Vault */}
      {(activeTab === 'student-dashboard' || activeTab === 'student-materials') && (
        <Card windowTitle="study_materials.res" headerColor="pink">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-black" />
              Course Study Materials & Notes
            </CardTitle>
            <CardDescription>
              Access lecture handouts, slide decks, and reading modules provided by your faculty instructors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.flatMap((c) => cognifyDb.getMaterialsByCourse(c.id)).map((m) => (
                <div key={m.id} className="border-2 border-black bg-white p-4 shadow-neo flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-[#FFDE59] border border-black font-black text-[10px] uppercase">
                        {m.file_type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-600 font-bold">{m.file_size}</span>
                    </div>
                    <h5 className="text-sm font-black text-black leading-snug">{m.title}</h5>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">{m.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 font-bold">Resource</span>
                    <button className="text-xs font-black uppercase text-indigo-700 hover:underline">
                      Open Resource ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
