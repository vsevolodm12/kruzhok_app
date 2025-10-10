import type { Lesson, Homework, Submission, Progress, User, GroupStats, Group, Course } from '../types';

// Mock данные для демонстрации

export const currentUser: User = {
  id: '1',
  name: 'Всеволод Марченко',
  email: 'vsevolod@example.com',
  role: 'student',
  telegramId: 123456789,
};

export const curator: User = {
  id: '2',
  name: 'Юля Арбузова',
  email: 'arbuzova@example.com',
  role: 'curator',
};

export const admin: User = {
  id: '4',
  name: 'Администратор',
  email: 'admin@example.com',
  role: 'admin',
};

export const mockLessons: Lesson[] = [
  {
    id: 1,
    title: 'Древняя Русь: от призвания варягов до Владимира',
    description: 'Формирование государства, первые князья, принятие христианства',
    date: '2025-10-10',
    time: '18:00',
    zoomLink: 'https://zoom.us/j/123456789',
    status: 'today',
  },
  {
    id: 2,
    title: 'Монгольское нашествие и Золотая Орда',
    description: 'Батыево нашествие, политика русских князей, последствия ига',
    date: '2025-10-12',
    time: '18:00',
    zoomLink: 'https://zoom.us/j/987654321',
    status: 'upcoming',
  },
  {
    id: 3,
    title: 'Возвышение Москвы и объединение земель',
    description: 'Иван Калита, Дмитрий Донской, Куликовская битва, стояние на Угре',
    date: '2025-10-15',
    time: '18:00',
    zoomLink: 'https://zoom.us/j/456789123',
    status: 'upcoming',
  },
];

export const mockHomework: Homework[] = [
  {
    id: 1,
    title: 'Первые князья',
    description: 'Написать эссе о внешней и внутренней политике Владимира Святого',
    lessonId: 1,
    deadline: '2025-10-12',
    status: 'not-submitted',
  },
  {
    id: 2,
    title: 'Источники по монгольскому периоду',
    description: 'Анализ летописных источников: "Повесть о разорении Рязани Батыем"',
    lessonId: 1,
    deadline: '2025-10-08',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Феодальная раздробленность',
    description: 'Сравнительный анализ политического строя княжеств XII-XIII веков',
    lessonId: 2,
    deadline: '2025-10-05',
    status: 'reviewed',
    grade: 95,
    comment: 'Отличная работа! Глубокий анализ источников.',
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 1,
    homeworkId: 2,
    studentId: '1',
    studentName: 'Всеволод Марченко',
    submittedDate: '2025-10-08T15:30:00',
    fileUrl: '/submissions/hw4_vsevolod.zip',
    status: 'pending',
  },
  {
    id: 2,
    homeworkId: 2,
    studentId: '3',
    studentName: 'Александр Петров',
    submittedDate: '2025-10-08T12:15:00',
    fileUrl: '/submissions/hw4_alex.zip',
    status: 'pending',
  },
];

export const mockProgress: Progress = {
  userId: '1',
  attendance: 92,
  homeworkCompletion: 78,
  averageGrade: 88,
  lessons: {
    attended: 11,
    total: 12,
  },
  homeworks: {
    completed: 7,
    total: 9,
  },
};

export const mockGroupStats: GroupStats = {
  totalStudents: 15,
  averageAttendance: 87,
  averageHomeworkCompletion: 82,
  averageGrade: 86,
};

export const mockGroups: Group[] = [
  {
    id: '1',
    name: 'История России 2025',
    description: 'Основная группа по истории России',
    curatorId: '2',
    curatorName: 'Юля Арбузова',
    studentCount: 15,
    courseIds: ['course1'],
  },
  {
    id: '2',
    name: 'История России 2025 (вечерняя)',
    description: 'Вечерняя группа для взрослых слушателей',
    curatorId: '3',
    curatorName: 'Иван Петров',
    studentCount: 8,
    courseIds: ['course1'],
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course1',
    name: 'История России: от Древней Руси до ХХ века',
    description: 'Полный курс истории России с древнейших времен до современности',
    curatorIds: ['2'],
    groupIds: ['1', '2'],
    lessonsCount: 24,
  },
  {
    id: 'course2',
    name: 'Древняя Русь и средневековье',
    description: 'Углубленное изучение периода от IX до XVII века',
    curatorIds: ['2', '3'],
    groupIds: [],
    lessonsCount: 12,
  },
];

export const mockCurators: User[] = [
  {
    id: '2',
    name: 'Юля Арбузова',
    email: 'arbuzova@example.com',
    role: 'curator',
    telegramId: 987654321,
  },
  {
    id: '3',
    name: 'Иван Петров',
    email: 'petrov@example.com',
    role: 'curator',
    telegramId: 555666777,
  },
];

