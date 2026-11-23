export type UserRole = 'admin' | 'faculty' | 'student';

export type BloomLevel = 
  | 'remember' 
  | 'understand' 
  | 'apply' 
  | 'analyze' 
  | 'evaluate' 
  | 'create';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
  created_at: string;
}

export interface LearningOutcome {
  id: string;
  course_id: string;
  bloom_level: BloomLevel;
  code: string;
  description: string;
  weight: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
  department: string;
  faculty_id: string;
  faculty_name?: string;
  enrolled_count?: number;
  outcomes_count?: number;
  materials_count?: number;
  created_at: string;
}

export interface AssessmentQuestion {
  id: string;
  assessment_id: string;
  bloom_level: BloomLevel;
  learning_outcome_id?: string;
  question_type: 'multiple_choice' | 'multi_select' | 'true_false' | 'short_answer';
  question_text: string;
  options?: { id: string; text: string }[];
  correct_answer: string | string[];
  explanation: string;
  points: number;
}

export interface Assessment {
  id: string;
  course_id: string;
  course_title?: string;
  title: string;
  description: string;
  time_limit_minutes: number;
  passing_score: number;
  is_published: boolean;
  question_count?: number;
  created_at: string;
}

export interface StudentSubmission {
  id: string;
  assessment_id: string;
  assessment_title?: string;
  student_id: string;
  started_at: string;
  submitted_at: string;
  total_score: number;
  max_score: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'graded';
}

export interface BloomMasteryData {
  bloom_level: BloomLevel;
  score: number; // 0 - 100
  total_questions: number;
  correct_questions: number;
  status: 'mastered' | 'proficient' | 'developing' | 'needs_remediation';
}
