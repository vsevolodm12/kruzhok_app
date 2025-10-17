import React, { useState } from 'react';
import { Calendar, Video, Clock, FileText, PlayCircle } from 'lucide-react';
import Card from '../../components/Card';

interface Lesson {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  teacher: string;
  status: 'upcoming' | 'today' | 'completed';
  zoomLink?: string;
  recordingLink?: string;
  materialLink?: string;
}

interface Course {
  id: string;
  name: string;
  color: {
    light: string;
    dark: string;
  };
  lessons: Lesson[];
}

const Schedule: React.FC = () => {
  
  const [selectedCourse, setSelectedCourse] = useState('history');

  const courses: Course[] = [
    {
      id: 'history',
      name: 'История России',
      color: {
        light: '#007AFF',
        dark: '#0A84FF',
      },
      lessons: [
        {
          id: 1,
          date: '10 октября',
          time: '18:00',
          title: 'Древняя Русь: от призвания варягов до Владимира',
          description: 'Формирование государства, первые князья, принятие христианства',
          teacher: 'Станкевич А.В.',
          status: 'today',
          zoomLink: 'https://zoom.us/j/123456789',
          materialLink: '#',
        },
        {
          id: 2,
          date: '12 октября',
          time: '18:00',
          title: 'Монгольское нашествие и Золотая Орда',
          description: 'Батыево нашествие, политика русских князей, последствия ига',
          teacher: 'Станкевич А.В.',
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/123456789',
        },
        {
          id: 3,
          date: '5 октября',
          time: '18:00',
          title: 'Феодальная раздробленность на Руси',
          description: 'Причины раздробленности, крупнейшие княжества, особенности развития',
          teacher: 'Станкевич А.В.',
          status: 'completed',
          recordingLink: 'https://zenclass.ru/video/123',
          materialLink: '#',
        },
      ],
    },
    {
      id: 'mhk',
      name: 'История МХК',
      color: {
        light: '#AF52DE',
        dark: '#8E3AB3',
      },
      lessons: [
        {
          id: 1,
          date: '11 октября',
          time: '19:00',
          title: 'Искусство Древнего Рима',
          description: 'Архитектура, скульптура, живопись эпохи империи',
          teacher: 'Петрова М.И.',
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/987654321',
        },
        {
          id: 2,
          date: '14 октября',
          time: '19:00',
          title: 'Византийское искусство',
          description: 'Мозаики, иконопись, храмовая архитектура',
          teacher: 'Петрова М.И.',
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/987654321',
        },
      ],
    },
    {
      id: 'literature',
      name: 'Литература',
      color: {
        light: '#52DE8E',
        dark: '#34C759',
      },
      lessons: [
        {
          id: 1,
          date: '13 октября',
          time: '17:00',
          title: 'Поэзия Серебряного века',
          description: 'Символизм, акмеизм, футуризм',
          teacher: 'Иванова Е.С.',
          status: 'upcoming',
          zoomLink: 'https://zoom.us/j/555666777',
        },
      ],
    },
  ];

  const currentCourse = courses.find(c => c.id === selectedCourse) || courses[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary">Расписание</h2>
        <Calendar className="w-6 h-6 text-primary" />
      </div>

      {/* Course Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:flex-wrap lg:overflow-visible lg:pb-0 lg:mx-0 lg:px-0">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourse(course.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              selectedCourse === course.id
                ? 'text-white shadow-lg'
                : 'bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark text-secondary hover:opacity-80'
            }`}
            style={
              selectedCourse === course.id
                ? {
                    backgroundColor: course.color.light,
                  }
                : undefined
            }
          >
            {course.name}
          </button>
        ))}
      </div>

      {/* Lessons Grid */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {currentCourse.lessons.map((lesson) => (
          <Card 
            key={lesson.id} 
            hover={lesson.status !== 'completed'}
            className={lesson.status === 'completed' ? 'opacity-60' : ''}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="flex flex-col items-center justify-center min-w-[60px] p-3 rounded-xl"
                    style={{
                      backgroundColor: `${currentCourse.color.light}15`,
                    }}
                  >
                    <span 
                      className="text-xs font-medium"
                      style={{ color: currentCourse.color.light }}
                    >
                      {lesson.date.split(' ')[1]}
                    </span>
                    <span 
                      className="text-lg font-bold"
                      style={{ color: currentCourse.color.light }}
                    >
                      {lesson.date.split(' ')[0]}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-secondary text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{lesson.time}</span>
                    </div>
                    <p className="text-xs text-secondary">
                      Преподаватель: {lesson.teacher}
                    </p>
                    <p className="text-xs text-secondary">
                      {lesson.zoomLink ? 'Формат: Zoom (онлайн)' : lesson.recordingLink ? 'Формат: ZenClass (запись)' : ''}
                    </p>
                  </div>
                </div>
                {lesson.status === 'today' && (
                  <span 
                    className="px-3 py-1 text-white text-xs font-medium rounded-lg flex-shrink-0"
                    style={{ backgroundColor: currentCourse.color.light }}
                  >
                    Сегодня
                  </span>
                )}
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {lesson.title}
                </h3>
                <p className="text-sm text-secondary">
                  {lesson.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                {lesson.status !== 'completed' && lesson.zoomLink && (
                  <button 
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: currentCourse.color.light }}
                  >
                    <Video className="w-4 h-4" />
                    Zoom
                  </button>
                )}
                {lesson.status === 'completed' && lesson.recordingLink && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-lg text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                    <PlayCircle className="w-4 h-4" />
                    Запись
                  </button>
                )}
                {lesson.materialLink && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-lg text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                    <FileText className="w-4 h-4" />
                    Конспект
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {currentCourse.lessons.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto mb-4 text-secondary opacity-50" />
          <p className="text-secondary">Занятий пока нет</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;

