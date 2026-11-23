import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cognifyDb } from '@/lib/store';
import { BloomLevel } from '@/types';
import { AiAssessmentService, ValidatedQuestion } from '@/services/aiAssessmentService';
import { 
  Sparkles, 
  CheckCircle2, 
  BrainCircuit, 
  Clock 
} from 'lucide-react';

interface AiAssessmentGeneratorProps {
  initialCourseId?: string;
  onAssessmentPublished?: (assessmentId: string) => void;
}

export const AiAssessmentGenerator: React.FC<AiAssessmentGeneratorProps> = ({
  initialCourseId,
  onAssessmentPublished,
}) => {
  const courses = cognifyDb.getCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialCourseId || courses[0]?.id || 'crs-1');
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Generator form parameters
  const [topic, setTopic] = useState('Binary Search Trees, Heaps & Graph Traversal');
  const [selectedBlooms, setSelectedBlooms] = useState<BloomLevel[]>([
    'remember',
    'understand',
    'apply',
    'analyze',
    'evaluate',
    'create',
  ]);
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [difficulty, setDifficulty] = useState<'foundational' | 'intermediate' | 'advanced'>('intermediate');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPayload, setGeneratedPayload] = useState<{
    title: string;
    description: string;
    timeLimitMinutes: number;
    questions: ValidatedQuestion[];
  } | null>(null);

  const [publishedSuccess, setPublishedSuccess] = useState<string | null>(null);

  const bloomLevels: BloomLevel[] = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];

  const toggleBloom = (lvl: BloomLevel) => {
    if (selectedBlooms.includes(lvl)) {
      if (selectedBlooms.length > 1) {
        setSelectedBlooms(selectedBlooms.filter((b) => b !== lvl));
      }
    } else {
      setSelectedBlooms([...selectedBlooms, lvl]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedPayload(null);
    setPublishedSuccess(null);

    const outcomes = cognifyDb.getOutcomesByCourse(selectedCourseId).map((o) => o.description);

    try {
      const result = await AiAssessmentService.generateAssessment({
        courseId: selectedCourseId,
        courseCode: selectedCourse?.code || 'CS-301',
        courseTitle: selectedCourse?.title || 'Data Structures',
        topic,
        targetBloomLevels: selectedBlooms,
        questionCount,
        difficulty,
        learningOutcomesContext: outcomes,
      });

      setGeneratedPayload(result);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishAssessment = () => {
    if (!generatedPayload) return;

    const questionsToSave = generatedPayload.questions.map((q) => ({
      bloom_level: q.bloom_level,
      question_type: q.question_type || ('multiple_choice' as const),
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points: q.points,
    }));

    const newAssessment = cognifyDb.createAssessmentWithQuestions(
      selectedCourseId,
      generatedPayload.title,
      generatedPayload.description,
      generatedPayload.timeLimitMinutes,
      questionsToSave
    );

    setPublishedSuccess(
      `Assessment "${newAssessment.title}" successfully published and accessible to students!`
    );
    setGeneratedPayload(null);
    onAssessmentPublished?.(newAssessment.id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-3 border-black bg-[#FFDE59] p-6 shadow-neo-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#FFDE59] text-xs font-black uppercase tracking-widest border border-black">
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Google Gemini 1.5 Assessment Engine</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              AI ASSESSMENT <span className="bg-white px-2 py-0.5 border-2 border-black inline-block shadow-neo-sm">GENERATOR</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black max-w-xl">
              Synthesize rigorously validated questions anchored to Bloom's taxonomy cognitive levels. 
              All AI outputs pass strict Zod schema validation before publishing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-black text-[#CCFF00] font-black text-xs uppercase border border-black shadow-neo-sm font-mono">
              ✦ ZERO HALLUCINATIONS
            </span>
          </div>
        </div>
      </div>

      {publishedSuccess && (
        <div className="p-4 border-2 border-black bg-[#CCFF00] shadow-neo font-black text-xs uppercase flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span>{publishedSuccess}</span>
          </div>
          <button onClick={() => setPublishedSuccess(null)} className="font-bold text-sm">✕</button>
        </div>
      )}

      {/* Generation Config Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card windowTitle="generator_params.prompt" headerColor="lime" className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-black" />
              Generation Parameters
            </CardTitle>
            <CardDescription>
              Configure cognitive targets and syllabus scope for the Gemini pipeline.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Target Course</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full h-11 border-2 border-black bg-white px-3 text-xs font-black uppercase shadow-neo-sm focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code}: {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1">Assessment Topic</label>
                <Input
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Asymptotic Bounds & Balanced Trees"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-black mb-1.5">
                  Target Bloom's Taxonomy Tiers ({selectedBlooms.length} selected)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {bloomLevels.map((lvl) => {
                    const isChecked = selectedBlooms.includes(lvl);
                    return (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => toggleBloom(lvl)}
                        className={`p-2 border-2 border-black text-left font-black text-[11px] uppercase transition-all ${
                          isChecked
                            ? 'bg-[#CCFF00] text-black shadow-neo-sm translate-x-[-1px] translate-y-[-1px]'
                            : 'bg-white text-slate-700 hover:bg-slate-100 shadow-none'
                        }`}
                      >
                        <span className="mr-1">{isChecked ? '☑' : '☐'}</span>
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Question Count</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full h-11 border-2 border-black bg-white px-3 text-xs font-black uppercase shadow-neo-sm focus:outline-none"
                  >
                    <option value={4}>4 Questions</option>
                    <option value={6}>6 Questions (Full Bloom)</option>
                    <option value={8}>8 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-black mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full h-11 border-2 border-black bg-white px-3 text-xs font-black uppercase shadow-neo-sm focus:outline-none"
                  >
                    <option value="foundational">Foundational</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="lime"
                size="lg"
                isLoading={isGenerating}
                className="w-full mt-2"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? 'Synthesizing with Gemini...' : 'Generate Assessment ✦'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Generated Questions Review Studio */}
        <div className="lg:col-span-2 space-y-4">
          {generatedPayload ? (
            <Card windowTitle="ai_generated_payload.json" headerColor="cyan">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-black pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-black text-[#CCFF00] font-mono text-[10px] font-black uppercase">
                      ZOD VALIDATED
                    </span>
                    <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {generatedPayload.timeLimitMinutes} Mins
                    </span>
                  </div>
                  <CardTitle className="text-xl mt-1">{generatedPayload.title}</CardTitle>
                  <CardDescription>{generatedPayload.description}</CardDescription>
                </div>

                <Button variant="lime" onClick={handlePublishAssessment}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Publish Assessment ✦
                </Button>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="text-xs font-black uppercase text-black">
                  Generated Questions ({generatedPayload.questions.length})
                </div>

                {generatedPayload.questions.map((q, idx) => (
                  <div key={idx} className="border-2 border-black bg-white p-4 shadow-neo space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black bg-black text-white px-2 py-0.5">
                          Q{idx + 1}
                        </span>
                        <Badge variant="bloom" bloomLevel={q.bloom_level} />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-700">
                        {q.points} Points
                      </span>
                    </div>

                    <p className="text-sm font-bold text-black leading-snug">{q.question_text}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.id}
                          className={`p-2 border text-xs font-medium flex items-center justify-between ${
                            opt.id === q.correct_answer
                              ? 'border-2 border-black bg-[#CCFF00] font-bold text-black'
                              : 'border-black bg-slate-50 text-slate-800'
                          }`}
                        >
                          <span>{opt.text}</span>
                          {opt.id === q.correct_answer && (
                            <span className="text-[10px] font-black uppercase bg-black text-white px-1">
                              KEY
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-2 border border-black bg-[#FFFDF5] text-[11px] font-semibold text-slate-700">
                      <span className="font-bold text-black uppercase">Explanation:</span> {q.explanation}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <div className="border-3 border-black bg-white p-12 shadow-neo-lg text-center space-y-4">
              <div className="w-16 h-16 rounded-full border-2 border-black bg-[#C4B5FD] mx-auto flex items-center justify-center shadow-neo">
                <BrainCircuit className="w-8 h-8 text-black" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase text-black">Ready for AI Generation</h3>
                <p className="text-xs font-bold text-slate-600 max-w-md mx-auto">
                  Select your target Bloom's taxonomy levels on the left and click "Generate Assessment" to trigger the Gemini schema pipeline.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
