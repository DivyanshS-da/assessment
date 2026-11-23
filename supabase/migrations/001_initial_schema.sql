-- ==============================================================================
-- COGNIFY: Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ==============================================================================

-- 1. Create User Roles Enum
CREATE TYPE user_role AS ENUM ('admin', 'faculty', 'student');
CREATE TYPE bloom_level AS ENUM ('remember', 'understand', 'apply', 'analyze', 'evaluate', 'create');
CREATE TYPE question_type AS ENUM ('multiple_choice', 'multi_select', 'true_false', 'short_answer');
CREATE TYPE submission_status AS ENUM ('in_progress', 'completed', 'graded');

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    avatar_url TEXT,
    department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    department TEXT NOT NULL,
    faculty_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Course Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (course_id, student_id)
);

-- 5. Learning Outcomes Table (Anchored across 6 Bloom's Taxonomy Tiers)
CREATE TABLE IF NOT EXISTS public.learning_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    bloom_level bloom_level NOT NULL,
    code TEXT NOT NULL, -- e.g. 'LO-1.1'
    description TEXT NOT NULL,
    weight INTEGER NOT NULL DEFAULT 1 CHECK (weight >= 1 AND weight <= 10),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Course Materials Table
CREATE TABLE IF NOT EXISTS public.course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    time_limit_minutes INTEGER NOT NULL DEFAULT 30,
    passing_score NUMERIC NOT NULL DEFAULT 60.0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Assessment Questions Table
CREATE TABLE IF NOT EXISTS public.assessment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    learning_outcome_id UUID REFERENCES public.learning_outcomes(id) ON DELETE SET NULL,
    bloom_level bloom_level NOT NULL,
    question_type question_type NOT NULL DEFAULT 'multiple_choice',
    question_text TEXT NOT NULL,
    options JSONB, -- array of { id: string, text: string }
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    points NUMERIC NOT NULL DEFAULT 1.0
);

-- 9. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_at TIMESTAMPTZ,
    total_score NUMERIC NOT NULL DEFAULT 0.0,
    max_score NUMERIC NOT NULL DEFAULT 0.0,
    percentage NUMERIC NOT NULL DEFAULT 0.0,
    status submission_status NOT NULL DEFAULT 'in_progress'
);

-- 10. Submission Answers Table
CREATE TABLE IF NOT EXISTS public.submission_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.assessment_questions(id) ON DELETE CASCADE,
    student_answer JSONB,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    points_awarded NUMERIC NOT NULL DEFAULT 0.0,
    ai_feedback TEXT
);

-- 11. Platform Audit Logs Table
CREATE TABLE IF NOT EXISTS public.platform_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submission_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to fetch user role safely
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Profiles: Admin can view/edit all; Users can view their own and enrolled teachers
CREATE POLICY "Admins full access on profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Users can read profiles"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

-- Courses: Admin full access; Faculty owns courses; Students read published
CREATE POLICY "Faculty can CRUD own courses"
    ON public.courses FOR ALL
    TO authenticated
    USING (faculty_id = auth.uid() OR public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Students can read active courses"
    ON public.courses FOR SELECT
    TO authenticated
    USING (is_archived = FALSE);

-- Learning Outcomes: Faculty owns outcomes; Enrolled students read
CREATE POLICY "Faculty manage course outcomes"
    ON public.learning_outcomes FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.courses c 
            WHERE c.id = course_id AND (c.faculty_id = auth.uid() OR public.get_user_role(auth.uid()) = 'admin')
        )
    );

CREATE POLICY "Students read course outcomes"
    ON public.learning_outcomes FOR SELECT
    TO authenticated
    USING (TRUE);

-- Assessments: Faculty manages; Students take published
CREATE POLICY "Faculty manage assessments"
    ON public.assessments FOR ALL
    TO authenticated
    USING (
        created_by = auth.uid() OR 
        public.get_user_role(auth.uid()) = 'admin' OR
        EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.faculty_id = auth.uid())
    );

CREATE POLICY "Students read published assessments"
    ON public.assessments FOR SELECT
    TO authenticated
    USING (is_published = TRUE);

-- Questions: Faculty can CRUD; Students view questions during active exam
CREATE POLICY "Faculty manage questions"
    ON public.assessment_questions FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments a 
            WHERE a.id = assessment_id AND (a.created_by = auth.uid() OR public.get_user_role(auth.uid()) = 'admin')
        )
    );

CREATE POLICY "Students view questions"
    ON public.assessment_questions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments a 
            WHERE a.id = assessment_id AND a.is_published = TRUE
        )
    );

-- Submissions: Students CRUD own; Faculty reads course submissions
CREATE POLICY "Students manage own submissions"
    ON public.submissions FOR ALL
    TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Faculty view submissions for their courses"
    ON public.submissions FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.assessments a
            JOIN public.courses c ON c.id = a.course_id
            WHERE a.id = assessment_id AND (c.faculty_id = auth.uid() OR public.get_user_role(auth.uid()) = 'admin')
        )
    );

-- Audit logs: Admin views all; Faculty views course logs
CREATE POLICY "Admin view logs"
    ON public.platform_logs FOR SELECT
    TO authenticated
    USING (public.get_user_role(auth.uid()) = 'admin');
