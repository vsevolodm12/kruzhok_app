import React from 'react';
import { Video, Clock, TrendingUp, BookOpen, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../../components/Card';
import ProgressBar from '../../components/ProgressBar';
import { useViewMode } from '../../contexts/ViewModeContext';

const Home: React.FC = () => {
  const { isDesktop } = useViewMode();

  return (
    <div className="space-y-6">
      {/* Приветствие */}
      <div className="pt-2">
        <h2 className="text-2xl lg:text-4xl font-bold text-primary mb-2">
          Привет, Всеволод!
        </h2>
        <p className="text-secondary text-sm lg:text-base">Продолжай в том же духе</p>
      </div>

      {/* Блоки контента */}
      <div className="space-y-6">
        {/* Ближайшие занятия */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            Ближайшие занятия
          </h3>
          <div className={`grid gap-4 ${isDesktop ? 'lg:grid-cols-2' : 'grid-cols-1'}`}>
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
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-course-history-light dark:bg-course-history-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                </div>
                <button className="bg-course-history-light dark:bg-course-history-dark text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 w-full text-sm">
                  Перейти в Zoom
                </button>
              </div>
            </Card>

            {/* МХК */}
            <Card>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-course-mhk-light/10 dark:bg-course-mhk-dark/10 text-course-mhk-light dark:text-course-mhk-dark text-xs font-medium rounded-lg">
                        МХК
                      </span>
                    </div>
                    <h3 className="text-base lg:text-lg font-semibold text-primary mb-2">
                      Искусство Древнего Египта
                    </h3>
                    <div className="space-y-1 text-sm text-secondary">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>11 октября, 19:00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        <span>Онлайн (Zoom)</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 lg:w-14 lg:h-14 bg-course-mhk-light dark:bg-course-mhk-dark rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                </div>
                <button className="bg-course-mhk-light dark:bg-course-mhk-dark text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 w-full text-sm">
                  Перейти в Zoom
                </button>
              </div>
            </Card>
          </div>
        </div>

        {/* Ближайший дедлайн */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Ближайший дедлайн
          </h3>
          <Card>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base lg:text-lg font-semibold text-primary mb-2">
                    Первые князья
                  </h3>
                  <div className="space-y-1 text-sm text-secondary">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>12 октября, 23:59</span>
                    </div>
                    <div className="flex items-center gap-2 text-error-light dark:text-error-dark font-medium">
                      <Clock className="w-4 h-4" />
                      <span>Осталось 2 дня</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 h-12 lg:w-14 lg:h-14 bg-warning-light/10 dark:bg-warning-dark/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 lg:w-7 lg:h-7 text-warning-light dark:text-warning-dark" />
                </div>
              </div>
              <button className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <BookOpen className="w-4 h-4" />
                Открыть задание
              </button>
            </div>
          </Card>
        </div>

        {/* Статистика */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Статистика
          </h3>
          <Card>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-secondary mt-1">Посещено</div>
              </div>
              <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-center">
                <div className="text-2xl font-bold text-success-light dark:text-success-dark">4</div>
                <div className="text-xs text-secondary mt-1">Сдано ДЗ</div>
              </div>
              <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">88</div>
                <div className="text-xs text-secondary mt-1">Ср. балл</div>
              </div>
              <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-center">
                <div className="text-2xl font-bold text-warning-light dark:text-warning-dark">1</div>
                <div className="text-xs text-secondary mt-1">Не сдано</div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <ProgressBar progress={92} label="Посещаемость" />
                <p className="text-xs text-secondary mt-1">12 из 13 занятий</p>
              </div>
              <div>
                <ProgressBar progress={80} label="Выполнение домашек" />
                <p className="text-xs text-secondary mt-1">4 из 5 сдано</p>
              </div>
              <div>
                <ProgressBar progress={88} label="Средний балл" />
                <p className="text-xs text-secondary mt-1">88 по всем работам</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Быстрые действия - только mobile */}
      {!isDesktop && (
        <div className="grid gap-4 grid-cols-2">
          <button className="btn-secondary flex items-center justify-center gap-2 py-4">
            <CalendarIcon className="w-5 h-5" />
            <span>Расписание</span>
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2 py-4">
            <BookOpen className="w-5 h-5" />
            <span>Домашки</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
