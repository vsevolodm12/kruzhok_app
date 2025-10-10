// Типы для будущей интеграции с backend

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'curator' | 'admin';
  avatar?: string;
  telegramId?: number;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  zoomLink: string;
  status: 'upcoming' | 'today' | 'completed';
  materials?: string[];
}

export interface Homework {
  id: number;
  title: string;
  description: string;
  lessonId: number;
  deadline: string;
  status: 'not-submitted' | 'pending' | 'reviewed';
  grade?: number;
  comment?: string;
  fileUrl?: string;
}

export interface Submission {
  id: number;
  homeworkId: number;
  studentId: string;
  studentName: string;
  submittedDate: string;
  fileUrl: string;
  status: 'pending' | 'reviewed';
  grade?: number;
  comment?: string;
}

export interface Progress {
  userId: string;
  attendance: number;
  homeworkCompletion: number;
  averageGrade: number;
  lessons: {
    attended: number;
    total: number;
  };
  homeworks: {
    completed: number;
    total: number;
  };
}

export interface Message {
  id: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  status: 'unread' | 'read' | 'replied';
}

export interface GroupStats {
  totalStudents: number;
  averageAttendance: number;
  averageHomeworkCompletion: number;
  averageGrade: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  curatorId?: string;
  curatorName?: string;
  studentCount: number;
  courseIds: string[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  curatorIds: string[];
  groupIds: string[];
  lessonsCount: number;
}

export interface CuratorWithGroups extends User {
  role: 'curator';
  groups: Group[];
  courses: Course[];
}

