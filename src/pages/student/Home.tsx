import React from 'react';
import { Video, Clock, TrendingUp, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';

const Home: React.FC = () => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Приветствие */}
      <div className="pt-2">
        <h2 className="text-xl lg:text-4xl font-bold text-primary mb-2">
          Привет, Всеволод!
        </h2>
        <p className="text-secondary text-sm lg:text-base">Продолжай в том же духе</p>
      </div>

      {/* Блоки контента */}
      <div className="space-y-4 lg:space-y-6">
        {/* Ближайшие занятия */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Ближайшие занятия
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* История */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-course-history-light/10 dark:bg-course-history-dark/10 text-course-history-light dark:text-course-history-dark text-xs font-medium rounded-lg">
                        История
                      </span>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-primary mb-2">
                      Древняя Русь: от призвания варягов до Владимира
                    </h3>
                    <div className="space-y-1 text-sm text-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>10 октября, 18:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Онлайн (Zoom)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Обществознание */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-course-social-light/10 dark:bg-course-social-dark/10 text-course-social-light dark:text-course-social-dark text-xs font-medium rounded-lg">
                        Обществознание
                      </span>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-primary mb-2">
                      Политические режимы и их характеристики
                    </h3>
                    <div className="space-y-1 text-sm text-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>12 октября, 19:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Онлайн (Zoom)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Прогресс */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Твой прогресс
          </h3>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-primary">История</h4>
                  <span className="text-sm text-secondary">75%</span>
                </div>
                <ProgressBar progress={75} />
                <div className="text-sm text-secondary">
                  <p>Изучено: 15 из 20 тем</p>
                  <p>Следующая: Московское царство</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-primary">Обществознание</h4>
                  <span className="text-sm text-secondary">60%</span>
                </div>
                <ProgressBar progress={60} />
                <div className="text-sm text-secondary">
                  <p>Изучено: 12 из 20 тем</p>
                  <p>Следующая: Право и мораль</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Домашние задания */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Домашние задания
          </h3>
          <div className="space-y-3">
            <Card hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-primary mb-1">
                    Эссе по истории
                  </h4>
                  <p className="text-sm text-secondary">
                    Сравнительный анализ политики Ивана III и Ивана IV
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary">До 15 октября</span>
                </div>
              </div>
            </Card>

            <Card hover>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-primary mb-1">
                    Тест по обществознанию
                  </h4>
                  <p className="text-sm text-secondary">
                    Политические режимы и формы правления
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-secondary">До 18 октября</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;