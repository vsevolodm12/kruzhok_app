import React from 'react';
import { TrendingUp, Award, Target, BarChart } from 'lucide-react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { useViewMode } from '../../contexts/ViewModeContext';

interface GradeHistory {
  id: number;
  title: string;
  grade: number;
  date: string;
}

const Progress: React.FC = () => {
  const { isDesktop } = useViewMode();
  
  const attendance = 92;
  const homeworkCompletion = 78;
  const averageGrade = 88;

  const gradeHistory: GradeHistory[] = [
    { id: 1, title: 'Славяне', grade: 92, date: '5 окт' },
    { id: 2, title: 'Славяне (часть 2)', grade: 88, date: '5 окт' },
    { id: 3, title: 'Киевская Русь', grade: 95, date: '1 окт' },
    { id: 4, title: 'Источники', grade: 85, date: '28 сен' },
  ];

  const stats = [
    {
      label: 'Сдано работ',
      value: gradeHistory.length,
      total: 5,
      description: `${gradeHistory.length} из 5 домашек`,
    },
    {
      label: 'Средний балл',
      value: averageGrade,
      total: 100,
      description: `${averageGrade}/100`,
    },
    {
      label: 'Посещаемость',
      value: attendance,
      total: 100,
      description: `${attendance}% занятий`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary">Прогресс</h2>
        <TrendingUp className="w-6 h-6 text-primary" />
      </div>

      {/* Статистика */}
      <div className={`grid gap-4 ${isDesktop ? 'grid-cols-3' : 'grid-cols-3'}`}>
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="text-center">
              <div className="text-xs lg:text-sm text-secondary mb-2">{stat.label}</div>
              <div className="text-2xl lg:text-4xl font-bold text-primary mb-1">
                {stat.value}
                {stat.label !== 'Сдано работ' && (
                  <span className="text-lg lg:text-xl text-secondary">/{stat.total}</span>
                )}
              </div>
              <div className="text-xs text-secondary">{stat.description}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Детальная статистика */}
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Детальная статистика</h3>
        </div>

        <div className="space-y-5">
          <div>
            <ProgressBar 
              progress={attendance} 
              label="Посещаемость" 
              className="mb-1"
            />
            <p className="text-xs text-secondary">
              Присутствовал на 11 из 12 занятий
            </p>
          </div>

          <div>
            <ProgressBar 
              progress={homeworkCompletion} 
              label="Выполнение домашек" 
              className="mb-1"
            />
            <p className="text-xs text-secondary">
              Сдано {gradeHistory.length} из 5 домашек
            </p>
          </div>

          <div>
            <ProgressBar 
              progress={averageGrade} 
              label="Средний балл" 
              className="mb-1"
            />
            <p className="text-xs text-secondary">
              {averageGrade}/100 по всем проверенным работам
            </p>
          </div>
        </div>
      </Card>

      {/* История оценок */}
      <Card>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-primary">История оценок</h3>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-lg">
            <BarChart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">100% система</span>
          </div>
        </div>

        <div className="space-y-3">
          {gradeHistory.map((item, index) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-8 h-8 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {gradeHistory.length - index}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary text-sm truncate">{item.title}</p>
                  <p className="text-xs text-secondary">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className={`px-4 py-2 rounded-xl font-bold text-lg ${
                  item.grade >= 90 
                    ? 'bg-success-light/10 dark:bg-success-dark/10 text-success-light dark:text-success-dark'
                    : item.grade >= 75
                    ? 'bg-primary-light/10 dark:bg-primary-dark/10 text-primary-light dark:text-primary-dark'
                    : item.grade >= 60
                    ? 'bg-warning-light/10 dark:bg-warning-dark/10 text-warning-light dark:text-warning-dark'
                    : 'bg-error-light/10 dark:bg-error-dark/10 text-error-light dark:text-error-dark'
                }`}>
                  {item.grade}
                  <span className="text-sm opacity-60">/100</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {gradeHistory.length === 0 && (
          <div className="text-center py-8">
            <Award className="w-12 h-12 mx-auto mb-3 text-secondary opacity-50" />
            <p className="text-secondary">Оценок пока нет</p>
          </div>
        )}
      </Card>

    </div>
  );
};

export default Progress;
