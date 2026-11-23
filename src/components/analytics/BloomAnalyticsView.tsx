import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cognifyDb } from '@/lib/store';
import { useAuth } from '@/context/AuthContext';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { 
  BarChart3, 
  Target, 
  Sparkles, 
  Award,
  Zap
} from 'lucide-react';

export const BloomAnalyticsView: React.FC = () => {
  const { currentUser } = useAuth();

  // Pure real database calculations: telemetry directly from submissions
  const bloomMastery = useMemo(() => {
    return cognifyDb.getStudentBloomMastery(currentUser.id);
  }, [currentUser.id]);

  const recommendations = useMemo(() => {
    return cognifyDb.getPersonalizedRecommendations(currentUser.id);
  }, [currentUser.id]);

  const submissions = useMemo(() => {
    return cognifyDb.getSubmissionsByStudent(currentUser.id);
  }, [currentUser.id]);

  // Transform for Recharts Radar
  const radarData = useMemo(() => {
    return bloomMastery.map((b) => ({
      subject: b.bloom_level.toUpperCase(),
      score: b.score,
      fullMark: 100,
    }));
  }, [bloomMastery]);

  const submissionHistory = useMemo(() => {
    return submissions.map((s, idx) => ({
      name: `Test #${idx + 1}`,
      percentage: s.percentage,
      score: s.total_score,
      max: s.max_score,
    }));
  }, [submissions]);

  const overallMasteryAvg = Math.round(
    bloomMastery.reduce((acc, b) => acc + b.score, 0) / (bloomMastery.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="border-3 border-black bg-[#C4B5FD] p-6 shadow-neo-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-[#C4B5FD] text-xs font-black uppercase tracking-widest border border-black">
              <Target className="w-3.5 h-3.5" />
              <span>Bloom's Taxonomy Competency Radar</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
              COGNITIVE <span className="bg-white px-2 py-0.5 border-2 border-black inline-block shadow-neo-sm">MASTERY REPORT</span>
            </h1>
            <p className="text-xs sm:text-sm font-bold text-black max-w-xl">
              Multi-dimensional telemetry derived from actual assessment responses. Every question directly maps to cognitive tiers, calculating true competency without estimation.
            </p>
          </div>

          <div className="border-2 border-black bg-white p-3 shadow-neo text-center">
            <div className="text-[10px] font-black uppercase text-slate-500">Aggregate Mastery</div>
            <div className="text-3xl font-black text-black">{overallMasteryAvg}%</div>
            <span className="px-1.5 py-0.2 bg-[#CCFF00] border border-black text-[9px] font-black uppercase">
              {overallMasteryAvg >= 80 ? '✦ PROFICIENT' : '✦ IN PROGRESS'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + Performance Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recharts Radar Chart */}
        <Card windowTitle="bloom_radar_chart.vis" headerColor="lime">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-black" />
              6-Axis Bloom's Taxonomy Radar
            </CardTitle>
            <CardDescription>
              Visualizes relative strength across Remember, Understand, Apply, Analyze, Evaluate, and Create.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[360px] w-full border-2 border-black bg-[#FFFDF5] p-2 shadow-neo-sm flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="#000000" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    stroke="#000000"
                    tick={{ fill: '#000000', fontSize: 11, fontWeight: 900 }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]} 
                    stroke="#000000"
                    tick={{ fill: '#000000', fontSize: 10, fontWeight: 700 }}
                  />
                  <Radar
                    name="Student Mastery"
                    dataKey="score"
                    stroke="#000000"
                    strokeWidth={3}
                    fill="#CCFF00"
                    fillOpacity={0.7}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      border: '2px solid #000000',
                      boxShadow: '3px 3px 0px #000',
                      fontWeight: 900,
                      textTransform: 'uppercase',
                      fontSize: '11px'
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Competency Breakdown Matrix */}
        <Card windowTitle="bloom_tier_matrix.data" headerColor="yellow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-black" />
              Cognitive Domain Performance
            </CardTitle>
            <CardDescription>
              Granular scoring and question accuracy per cognitive level.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bloomMastery.map((b) => (
              <div 
                key={b.bloom_level} 
                className="p-3 border-2 border-black bg-white shadow-neo-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <Badge variant="bloom" bloomLevel={b.bloom_level} />
                  <div>
                    <div className="text-xs font-black uppercase text-black">
                      {b.bloom_level} Mastery
                    </div>
                    <div className="text-[10px] font-bold text-slate-600">
                      Accuracy: {b.correct_questions} / {b.total_questions} questions correct
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-black text-black">
                    {b.score}%
                  </span>
                  <span
                    className={`px-2 py-0.5 border border-black font-black text-[10px] uppercase ${
                      b.status === 'mastered'
                        ? 'bg-[#CCFF00] text-black'
                        : b.status === 'proficient'
                        ? 'bg-[#70D6FF] text-black'
                        : 'bg-[#FF5C5C] text-black'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Personalized AI Remedial Learning Recommendations */}
      <Card windowTitle="personalized_remedial_engine.ai" headerColor="pink">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-black" />
            Personalized AI Learning Recommendations
          </CardTitle>
          <CardDescription>
            Targeted study pathways formulated from detected learning gaps in lower-scoring Bloom levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className="border-2 border-black bg-[#FFFDF5] p-5 shadow-neo flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-black text-[#FFDE59] font-mono text-[10px] font-black uppercase">
                      PRIORITY: {rec.priority}
                    </span>
                    <Badge variant="bloom" bloomLevel={rec.bloom_level} />
                  </div>
                  <h4 className="text-base font-black text-black leading-tight uppercase">
                    {rec.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                    {rec.description}
                  </p>
                </div>

                <div className="pt-3 border-t-2 border-black flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 truncate max-w-[180px]">
                    {rec.courseTitle}
                  </span>
                  <Button variant="lime" size="sm">
                    {rec.actionText} →
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assessment Score History Bar Chart */}
      {submissionHistory.length > 0 && (
        <Card windowTitle="assessment_progression.hist" headerColor="cyan">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-black" />
              Assessment History & Progression
            </CardTitle>
            <CardDescription>
              Chronological score trajectory across completed assessments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full border-2 border-black bg-[#FFFDF5] p-2 shadow-neo-sm">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={submissionHistory}>
                  <XAxis dataKey="name" stroke="#000" tick={{ fontWeight: 800, fontSize: 11 }} />
                  <YAxis domain={[0, 100]} stroke="#000" tick={{ fontWeight: 800, fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #000',
                      boxShadow: '3px 3px 0px #000',
                      fontWeight: 900,
                    }}
                  />
                  <Bar dataKey="percentage" fill="#70D6FF" stroke="#000" strokeWidth={2} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
