import React, { useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users, ChevronDown, ChevronUp, CheckCircle, XCircle, X } from 'lucide-react';
import Card from '../../components/Card';
import { useViewMode } from '../../contexts/ViewModeContext';

interface Student {
  id: number;
  name: string;
  submitted: boolean;
  submittedDate?: string;
}

interface HomeworkTask {
  id: number;
  title: string;
  description: string;
  lesson: string;
  deadline: string;
  submitted: number;
  total: number;
  students: Student[];
}

const CuratorHomework: React.FC = () => {
  const { isDesktop } = useViewMode();
  const [expandedTasks, setExpandedTasks] = useState<number[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');

  const homeworkTasks: HomeworkTask[] = [
    {
      id: 1,
      title: 'Первые князья',
      description: 'Написать эссе о внешней и внутренней политике Владимира Святого. Объем 3-4 страницы.',
      lesson: 'Древняя Русь: от призвания варягов до Владимира',
      deadline: '12 октября, 23:59',
      submitted: 8,
      total: 15,
      students: [
        { id: 1, name: 'Всеволод Марченко', submitted: true, submittedDate: '10 окт, 15:30' },
        { id: 2, name: 'Александр Петров', submitted: true, submittedDate: '10 окт, 18:45' },
        { id: 3, name: 'Мария Сидорова', submitted: false },
        { id: 4, name: 'Дмитрий Козлов', submitted: true, submittedDate: '11 окт, 09:15' },
        { id: 5, name: 'Анна Иванова', submitted: false },
        { id: 6, name: 'Петр Смирнов', submitted: true, submittedDate: '10 окт, 20:30' },
        { id: 7, name: 'Елена Волкова', submitted: true, submittedDate: '11 окт, 14:20' },
        { id: 8, name: 'Сергей Федоров', submitted: false },
        { id: 9, name: 'Ольга Николаева', submitted: true, submittedDate: '10 окт, 22:15' },
        { id: 10, name: 'Игорь Соколов', submitted: false },
        { id: 11, name: 'Татьяна Морозова', submitted: true, submittedDate: '11 окт, 11:45' },
        { id: 12, name: 'Андрей Васильев', submitted: false },
        { id: 13, name: 'Наталья Павлова', submitted: true, submittedDate: '10 окт, 19:00' },
        { id: 14, name: 'Владимир Орлов', submitted: false },
        { id: 15, name: 'Екатерина Лебедева', submitted: false },
      ],
    },
    {
      id: 2,
      title: 'Источники по монгольскому периоду',
      description: 'Анализ летописных источников: "Повесть о разорении Рязани Батыем"',
      lesson: 'Монгольское нашествие и Золотая Орда',
      deadline: '8 октября, 23:59',
      submitted: 14,
      total: 15,
      students: [
        { id: 1, name: 'Всеволод Марченко', submitted: true, submittedDate: '8 окт, 15:30' },
        { id: 2, name: 'Александр Петров', submitted: true, submittedDate: '8 окт, 12:15' },
        // ... остальные студенты
      ],
    },
  ];

  const toggleExpanded = (taskId: number) => {
    setExpandedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const getSubmissionColor = (submitted: number, total: number) => {
    const percentage = (submitted / total) * 100;
    if (percentage === 100) return 'text-success-light dark:text-success-dark';
    if (percentage >= 70) return 'text-primary-light dark:text-primary-dark';
    return 'text-warning-light dark:text-warning-dark';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">Домашние задания</h2>
          <p className="text-sm text-secondary mt-1">Всего {homeworkTasks.length} заданий</p>
        </div>
        <BookOpen className="w-6 h-6 text-primary" />
      </div>

      {/* Кнопка создания */}
      <button 
        onClick={() => setShowCreateModal(!showCreateModal)}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Создать домашку для группы
      </button>

      {/* Модальное окно создания домашки */}
      {showCreateModal && (
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">Новое домашнее задание</h3>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedGroup('');
                }}
                className="p-2 hover:bg-surfaceSecondary-light dark:hover:bg-surfaceSecondary-dark rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>
            </div>

            {/* Выбор группы */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Выберите группу
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="input"
              >
                <option value="">Выберите группу...</option>
                <option value="history-9">История 9 класс</option>
                <option value="history-10">История 10 класс</option>
                <option value="history-11">История 11 класс</option>
                <option value="mhk-9">МХК 9 класс</option>
                <option value="mhk-10">МХК 10 класс</option>
              </select>
            </div>

            {/* Название задания */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Название задания
              </label>
              <input
                type="text"
                placeholder="Домашка #6: ..."
                className="input"
              />
            </div>

            {/* Описание */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Описание задания
              </label>
              <textarea
                placeholder="Подробное описание задания..."
                rows={4}
                className="textarea"
              />
            </div>

            {/* Дедлайн */}
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">
                Дедлайн
              </label>
              <input
                type="datetime-local"
                className="input"
              />
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2">
              <button 
                className="flex-1 btn-primary"
                disabled={!selectedGroup}
              >
                Создать задание
              </button>
              <button 
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedGroup('');
                }}
                className="px-6 btn-secondary"
              >
                Отмена
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Список заданий */}
      <div className={`grid gap-4 ${isDesktop ? 'grid-cols-1' : 'grid-cols-1'}`}>
        {homeworkTasks.map((task) => (
          <Card key={task.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">{task.title}</h3>
                  <p className="text-sm text-secondary mb-3">{task.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button className="p-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-lg hover:opacity-80 transition-opacity">
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button className="p-2 bg-error-light/10 dark:bg-error-dark/10 rounded-lg hover:opacity-80 transition-opacity">
                    <Trash2 className="w-4 h-4 text-error-light dark:text-error-dark" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl">
                  <p className="text-xs text-secondary mb-1">К уроку</p>
                  <p className="text-sm font-medium text-primary">{task.lesson}</p>
                </div>
                <div className="p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl">
                  <p className="text-xs text-secondary mb-1">Дедлайн</p>
                  <p className="text-sm font-medium text-primary">{task.deadline}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary">Прогресс сдачи</span>
                  <span className={`text-sm font-bold ${getSubmissionColor(task.submitted, task.total)}`}>
                    {task.submitted} / {task.total}
                  </span>
                </div>
                <div className="w-full h-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-light dark:bg-primary-dark transition-all duration-500 rounded-full"
                    style={{ width: `${(task.submitted / task.total) * 100}%` }}
                  />
                </div>
              </div>

              {/* Expand Button */}
              <button
                onClick={() => toggleExpanded(task.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <Users className="w-4 h-4" />
                {expandedTasks.includes(task.id) ? 'Скрыть список' : 'Показать кто сдал'}
                {expandedTasks.includes(task.id) ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Students List */}
              {expandedTasks.includes(task.id) && (
                <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid gap-2">
                    {task.students.map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          student.submitted
                            ? 'bg-success-light/10 dark:bg-success-dark/10'
                            : 'bg-error-light/10 dark:bg-error-dark/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {student.submitted ? (
                            <CheckCircle className="w-5 h-5 text-success-light dark:text-success-dark flex-shrink-0" />
                          ) : (
                            <XCircle className="w-5 h-5 text-error-light dark:text-error-dark flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-primary">{student.name}</p>
                            {student.submittedDate && (
                              <p className="text-xs text-secondary">{student.submittedDate}</p>
                            )}
                          </div>
                        </div>
                        <span className={`text-xs font-medium ${
                          student.submitted
                            ? 'text-success-light dark:text-success-dark'
                            : 'text-error-light dark:text-error-dark'
                        }`}>
                          {student.submitted ? 'Сдано' : 'Не сдано'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CuratorHomework;
