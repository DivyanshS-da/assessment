import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { AdminPortal } from './components/admin/AdminPortal';
import { FacultyStudio } from './components/faculty/FacultyStudio';
import { AiAssessmentGenerator } from './components/faculty/AiAssessmentGenerator';
import { StudentPortal } from './components/student/StudentPortal';
import { BloomAnalyticsView } from './components/analytics/BloomAnalyticsView';

function MainContent() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [targetCourseForGen, setTargetCourseForGen] = useState<string | undefined>(undefined);

  // Synchronize default tabs when role switches
  const currentTab = (() => {
    if (activeTab === 'dashboard') {
      if (role === 'admin') return 'admin-overview';
      if (role === 'faculty') return 'faculty-dashboard';
      return 'student-dashboard';
    }
    return activeTab;
  })();

  const handleSelectTab = (tab: string) => {
    setActiveTab(tab);
  };

  const handleNavigateToAiGen = (courseId: string) => {
    setTargetCourseForGen(courseId);
    setActiveTab('faculty-ai-gen');
  };

  const handleNavigateToRadar = () => {
    setActiveTab('student-radar');
  };

  return (
    <AppShell activeTab={currentTab} onSelectTab={handleSelectTab}>
      {/* Dynamic Role-Based View Router */}
      {role === 'admin' && (
        <AdminPortal activeTab={currentTab} />
      )}

      {role === 'faculty' && (
        <>
          {currentTab === 'faculty-ai-gen' ? (
            <AiAssessmentGenerator
              initialCourseId={targetCourseForGen}
              onAssessmentPublished={() => setActiveTab('faculty-dashboard')}
            />
          ) : (
            <FacultyStudio
              activeTab={currentTab}
              onNavigateToAiGen={handleNavigateToAiGen}
            />
          )}
        </>
      )}

      {role === 'student' && (
        <>
          {currentTab === 'student-radar' || currentTab === 'student-remedials' ? (
            <BloomAnalyticsView />
          ) : (
            <StudentPortal
              activeTab={currentTab}
              onNavigateToRadar={handleNavigateToRadar}
            />
          )}
        </>
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
