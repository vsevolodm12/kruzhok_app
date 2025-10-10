import React from 'react';
import { BarChart3, TrendingUp, Users, Award, Target } from 'lucide-react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { useViewMode } from '../../contexts/ViewModeContext';

interface StudentProgress {
  id: number;
  name: string;
  attendance: number;
  homeworkCompletion: number;
  averageGrade: number;
}

const Reports: React.FC = () => {
  const { isDesktop } = useViewMode();

  const groupStats = {
    totalStudents: 15,
    averageAttendance: 87,
    averageHomeworkCompletion: 82,
    averageGrade: 86,
    completedLessons: 12,
    totalLessons: 15,
  };

  const topStudents: StudentProgress[] = [
    {
      id: 1,
      name: 'Мария Сидорова',
      attendance: 100,
      homeworkCompletion: 100,
      averageGrade: 95,
    },
    {
      id: 2,
      name: 'Александр Петров',
      attendance: 92,
      homeworkCompletion: 90,
      averageGrade: 92,
    },
    {
      id: 3,
      name: 'Всеволод Марченко',
      attendance: 92,
      homeworkCompletion: 78,
      averageGrade: 88,
    },
  ];

  const allStudents: StudentProgress[] = [
    ...topStudents,
    {
      id: 4,
      name: 'Дмитрий Козлов',
      attendance: 85,
      homeworkCompletion: 85,
      averageGrade: 85,
    },
    {
      id: 5,
      name: 'Елена Смирнова',
      attendance: 78,
      homeworkCompletion: 70,
      averageGrade: 80,
    },
    {
      id: 6,
      name: 'Анна Иванова',
      attendance: 75,
      homeworkCompletion: 65,
      averageGrade: 75,
    },
    {
      id: 7,
      name: 'Петр Смирнов',
      attendance: 82,
      homeworkCompletion: 75,
      averageGrade: 82,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">Отчётность</h2>
          <p className="text-sm text-secondary mt-1">Общая статистика группы • 100% система оценки</p>
        </div>
        <BarChart3 className="w-6 h-6 text-primary" />
      </div>

      {/* Общая статистика */}
      <div className={`grid gap-4 ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'}`}>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{groupStats.totalStudents}</p>
            <p className="text-xs lg:text-sm text-secondary">Студентов</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-light/10 dark:bg-success-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-success-light dark:text-success-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{groupStats.averageGrade}</p>
            <p className="text-xs lg:text-sm text-secondary">Средний балл</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning-light/10 dark:bg-warning-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-warning-light dark:text-warning-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{groupStats.averageAttendance}%</p>
            <p className="text-xs lg:text-sm text-secondary">Посещаемость</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <BarChart3 className="w-6 h-6 text-primary-light dark:text-primary-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{groupStats.averageHomeworkCompletion}%</p>
            <p className="text-xs lg:text-sm text-secondary">Сдача ДЗ</p>
          </div>
        </Card>
      </div>

      {/* Средние показатели группы */}
      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4">Показатели группы</h3>
        <div className="space-y-4">
          <div>
            <ProgressBar
              progress={groupStats.averageAttendance}
              label="Посещаемость"
            />
            <p className="text-xs text-secondary mt-1">
              В среднем студенты посещают {groupStats.averageAttendance}% занятий
            </p>
          </div>
          <div>
            <ProgressBar
              progress={groupStats.averageHomeworkCompletion}
              label="Выполнение домашек"
            />
            <p className="text-xs text-secondary mt-1">
              В среднем студенты сдают {groupStats.averageHomeworkCompletion}% домашних заданий
            </p>
          </div>
          <div>
            <ProgressBar
              progress={groupStats.averageGrade}
              label="Средний балл (100 система)"
            />
            <p className="text-xs text-secondary mt-1">
              Средний балл по всем проверенным работам: {groupStats.averageGrade}/100
            </p>
          </div>
        </div>
      </Card>

      {/* Топ студентов */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Топ-3 студента</h3>
        </div>

        <div className="space-y-3">
          {topStudents.map((student, index) => (
            <div
              key={student.id}
              className="p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold ${
                  index === 0
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : index === 1
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                    : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-primary">{student.name}</p>
                  <p className="text-xs text-secondary">Средний балл: {student.averageGrade}/100</p>
                </div>
              </div>

              <div className={`grid gap-3 ${isDesktop ? 'grid-cols-3' : 'grid-cols-3'}`}>
                <div className="text-center p-2 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <p className="text-xs text-secondary mb-1">Посещ.</p>
                  <p className="text-sm font-bold text-primary">{student.attendance}%</p>
                </div>
                <div className="text-center p-2 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <p className="text-xs text-secondary mb-1">Домашки</p>
                  <p className="text-sm font-bold text-primary">{student.homeworkCompletion}%</p>
                </div>
                <div className="text-center p-2 bg-surface-light dark:bg-surface-dark rounded-lg">
                  <p className="text-xs text-secondary mb-1">Балл</p>
                  <p className="text-sm font-bold text-primary">{student.averageGrade}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Все студенты */}
      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4">Все студенты</h3>
        <div className="space-y-3">
          {allStudents.map((student) => (
            <div
              key={student.id}
              className="p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-primary">{student.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-secondary">Средний балл:</span>
                  <span className={`text-lg font-bold ${
                    student.averageGrade >= 90
                      ? 'text-success-light dark:text-success-dark'
                      : student.averageGrade >= 75
                      ? 'text-primary-light dark:text-primary-dark'
                      : student.averageGrade >= 60
                      ? 'text-warning-light dark:text-warning-dark'
                      : 'text-error-light dark:text-error-dark'
                  }`}>
                    {student.averageGrade}
                  </span>
                  <span className="text-xs text-secondary">/100</span>
                </div>
              </div>
              <div className="space-y-2">
                <ProgressBar
                  progress={student.attendance}
                  label="Посещаемость"
                  showPercentage
                />
                <ProgressBar
                  progress={student.homeworkCompletion}
                  label="Домашки"
                  showPercentage
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Reports;
