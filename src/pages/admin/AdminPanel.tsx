import React, { useState } from 'react';
import { UserPlus, BookOpen, Users, Mail, Key, Save, X, Check, Edit2, Trash2, Calendar } from 'lucide-react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ScheduleManagement from '../../components/ScheduleManagement';
import type { User, Course, Group } from '../../types';

type Tab = 'curators' | 'schedule' | 'courses' | 'groups';

interface CuratorFormData {
  name: string;
  email: string;
  telegramId: string;
  password: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('curators');
  
  // Кураторы
  const [curators, setCurators] = useState<User[]>([
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
  ]);

  // Курсы (уже существующие)
  const [courses, setCourses] = useState<Course[]>([
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
      curatorIds: [],
      groupIds: [],
      lessonsCount: 12,
    },
    {
      id: 'course3',
      name: 'Российская империя XVIII-XIX века',
      description: 'От Петра I до Николая II',
      curatorIds: [],
      groupIds: [],
      lessonsCount: 16,
    },
  ]);

  // Группы (уже существующие)
  const [groups, setGroups] = useState<Group[]>([
    {
      id: '1',
      name: 'История России 2025 (утренняя)',
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
      curatorId: undefined,
      curatorName: undefined,
      studentCount: 8,
      courseIds: ['course1'],
    },
    {
      id: '3',
      name: 'Древняя Русь - спецкурс',
      description: 'Углубленное изучение древнерусского периода',
      curatorId: undefined,
      curatorName: undefined,
      studentCount: 6,
      courseIds: ['course2'],
    },
  ]);

  // Модальное окно для создания куратора
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCurator, setEditingCurator] = useState<User | null>(null);
  const [formData, setFormData] = useState<CuratorFormData>({
    name: '',
    email: '',
    telegramId: '',
    password: '',
  });

  // Открыть модалку создания/редактирования куратора
  const handleOpenModal = (curator?: User) => {
    if (curator) {
      setEditingCurator(curator);
      setFormData({
        name: curator.name,
        email: curator.email,
        telegramId: curator.telegramId?.toString() || '',
        password: '',
      });
    } else {
      setEditingCurator(null);
      setFormData({
        name: '',
        email: '',
        telegramId: '',
        password: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCurator(null);
  };

  // Создать/обновить куратора
  const handleSubmitCurator = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCurator) {
      setCurators(curators.map(c => 
        c.id === editingCurator.id 
          ? { 
              ...c, 
              name: formData.name, 
              email: formData.email,
              telegramId: parseInt(formData.telegramId)
            }
          : c
      ));
    } else {
      const newCurator: User = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: 'curator',
        telegramId: parseInt(formData.telegramId),
      };
      setCurators([...curators, newCurator]);
    }
    
    handleCloseModal();
  };

  // Удалить куратора
  const handleDeleteCurator = (curatorId: string) => {
    if (confirm('Вы уверены, что хотите удалить этого куратора?')) {
      setCurators(curators.filter(c => c.id !== curatorId));
      // Убрать куратора из курсов
      setCourses(courses.map(course => ({
        ...course,
        curatorIds: course.curatorIds.filter(id => id !== curatorId)
      })));
      // Убрать куратора из групп
      setGroups(groups.map(group => 
        group.curatorId === curatorId 
          ? { ...group, curatorId: undefined, curatorName: undefined }
          : group
      ));
    }
  };

  // Сбросить пароль
  const handleResetPassword = (curator: User) => {
    alert(`Письмо для сброса пароля отправлено на ${curator.email}`);
  };

  // Назначить/убрать куратора на курс
  const toggleCuratorOnCourse = (courseId: string, curatorId: string) => {
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        const isAssigned = course.curatorIds.includes(curatorId);
        return {
          ...course,
          curatorIds: isAssigned
            ? course.curatorIds.filter(id => id !== curatorId)
            : [...course.curatorIds, curatorId]
        };
      }
      return course;
    }));
  };

  // Назначить куратора на группу
  const assignCuratorToGroup = (groupId: string, curatorId: string) => {
    const curator = curators.find(c => c.id === curatorId);
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { 
            ...group, 
            curatorId: curatorId,
            curatorName: curator?.name
          }
        : group
    ));
  };

  // Убрать куратора с группы
  const removeCuratorFromGroup = (groupId: string) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, curatorId: undefined, curatorName: undefined }
        : group
    ));
  };

  const getCuratorNames = (curatorIds: string[]) => {
    return curatorIds
      .map(id => curators.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Не назначены';
  };

  const tabs = [
    { id: 'curators' as Tab, label: 'Кураторы', icon: UserPlus },
    { id: 'schedule' as Tab, label: 'Расписание', icon: Calendar },
    { id: 'courses' as Tab, label: 'Курсы', icon: BookOpen },
    { id: 'groups' as Tab, label: 'Группы', icon: Users },
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Панель администратора
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Управление кураторами, курсами и группами
        </p>
      </div>

      {/* Табы */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      <div>
        {/* Вкладка: Расписание */}
        {activeTab === 'schedule' && (
          <ScheduleManagement />
        )}

        {/* Вкладка: Логинить кураторов */}
        {activeTab === 'curators' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Всего кураторов: {curators.length}
              </p>
              <Button onClick={() => handleOpenModal()}>
                <UserPlus className="w-5 h-5 mr-2" />
                Создать куратора
              </Button>
            </div>

            <div className="grid gap-4">
              {curators.map((curator) => (
                <Card key={curator.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary-600 dark:text-primary-400">
                          {curator.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {curator.name}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {curator.email}
                          </span>
                          {curator.telegramId && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              TG: {curator.telegramId}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleResetPassword(curator)}
                      >
                        <Key className="w-4 h-4 mr-1" />
                        Сбросить пароль
                      </Button>
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleOpenModal(curator)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteCurator(curator.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка: Назначить на курсы */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Выберите кураторов для каждого курса
            </p>

            <div className="grid gap-4">
              {courses.map((course) => (
                <Card key={course.id} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {course.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{course.lessonsCount} занятий</span>
                        <span>•</span>
                        <span>{course.groupIds.length} групп</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          Назначенные кураторы:
                        </h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {getCuratorNames(course.curatorIds)}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {curators.map((curator) => {
                          const isAssigned = course.curatorIds.includes(curator.id);
                          return (
                            <label
                              key={curator.id}
                              className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isAssigned}
                                  onChange={() => toggleCuratorOnCourse(course.id, curator.id)}
                                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                                  {curator.name}
                                </span>
                              </div>
                              {isAssigned && (
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                              )}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Вкладка: Назначить на группы */}
        {activeTab === 'groups' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Назначьте куратора для каждой группы студентов
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {groups.map((group) => (
                <Card key={group.id} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {group.description}
                      </p>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        👥 {group.studentCount} студентов
                      </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Куратор группы
                      </label>
                      
                      {group.curatorId ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <div className="flex items-center">
                            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {group.curatorName}
                            </span>
                          </div>
                          <Button
                            variant="secondary"
                            size="small"
                            onClick={() => removeCuratorFromGroup(group.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              assignCuratorToGroup(group.id, e.target.value);
                            }
                          }}
                          value=""
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                        >
                          <option value="">Выберите куратора...</option>
                          {curators.map((curator) => (
                            <option key={curator.id} value={curator.id}>
                              {curator.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Модальное окно создания/редактирования куратора */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingCurator ? 'Редактировать куратора' : 'Создать нового куратора'}
            </h2>
            <form onSubmit={handleSubmitCurator} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ФИО
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="Иван Иванов"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                  placeholder="ivanov@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Telegram ID
                </label>
                <input
                  type="number"
                  value={formData.telegramId}
                  onChange={(e) => setFormData({ ...formData, telegramId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="123456789"
                />
              </div>
              {!editingCurator && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Пароль
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required={!editingCurator}
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingCurator ? 'Сохранить' : 'Создать'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

