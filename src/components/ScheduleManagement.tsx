import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, Plus, Save, Users, Video, FileText } from 'lucide-react';
import Card from './Card';
import Button from './Button';

interface Lesson {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  teacher: string;
  zoomLink?: string;
  recordingLink?: string;
  materialLink?: string;
  groupIds: string[];
  course: 'history' | 'mhk' | 'literature' | 'social';
  status: 'scheduled' | 'today' | 'completed';
}

interface LessonFormData {
  title: string;
  date: string;
  time: string;
  description: string;
  teacher: string;
  zoomLink: string;
  course: 'history' | 'mhk' | 'literature' | 'social';
  groupIds: string[];
}

const ScheduleManagement: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<'history' | 'mhk' | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: '1',
      title: 'Древняя Русь: от призвания варягов до Владимира',
      date: '2025-10-10',
      time: '18:00',
      description: 'Формирование государства, первые князья, принятие христианства',
      teacher: 'Станкевич А.В.',
      zoomLink: 'https://zoom.us/j/123456789',
      materialLink: 'lecture1.pdf',
      groupIds: ['1', '2'],
      course: 'history',
      status: 'today',
    },
    {
      id: '2',
      title: 'Искусство Древнего Египта',
      date: '2025-10-11',
      time: '19:00',
      description: 'Пирамиды, храмы, скульптура и живопись Древнего Египта',
      teacher: 'Петрова М.С.',
      zoomLink: 'https://zoom.us/j/987654321',
      materialLink: 'lecture_egypt.pdf',
      groupIds: ['3'],
      course: 'mhk',
      status: 'today',
    },
  ]);

  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    date: '',
    time: '',
    description: '',
    teacher: '',
    zoomLink: '',
    course: 'history',
    groupIds: [],
  });

  const groups = [
    { id: '1', name: 'История России 2025 (утренняя)' },
    { id: '2', name: 'История России 2025 (вечерняя)' },
    { id: '3', name: 'МХК 2025' },
  ];

  const handleOpenModal = (lesson?: Lesson) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        date: lesson.date,
        time: lesson.time,
        description: lesson.description,
        teacher: lesson.teacher,
        zoomLink: lesson.zoomLink || '',
        course: lesson.course,
        groupIds: lesson.groupIds,
      });
    } else {
      setEditingLesson(null);
      setFormData({
        title: '',
        date: '',
        time: '',
        description: '',
        teacher: '',
        zoomLink: '',
        course: 'history',
        groupIds: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleSubmitLesson = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingLesson) {
      setLessons(lessons.map(l => 
        l.id === editingLesson.id 
          ? { ...l, ...formData, status: l.status }
          : l
      ));
    } else {
      const newLesson: Lesson = {
        id: Date.now().toString(),
        ...formData,
        status: 'scheduled',
      };
      setLessons([...lessons, newLesson]);
    }
    
    handleCloseModal();
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот урок?')) {
      setLessons(lessons.filter(l => l.id !== lessonId));
    }
  };

  const toggleGroupSelection = (groupId: string) => {
    setFormData(prev => ({
      ...prev,
      groupIds: prev.groupIds.includes(groupId)
        ? prev.groupIds.filter(id => id !== groupId)
        : [...prev.groupIds, groupId]
    }));
  };

  const filteredLessons = selectedCourse === 'all' 
    ? lessons 
    : lessons.filter(l => l.course === selectedCourse);

  const upcomingLessons = filteredLessons.filter(l => l.status === 'scheduled' || l.status === 'today');
  const completedLessons = filteredLessons.filter(l => l.status === 'completed');

  const getCourseColor = (course: string) => {
    switch (course) {
      case 'history': return 'bg-course-history-light dark:bg-course-history-dark';
      case 'mhk': return 'bg-course-mhk-light dark:bg-course-mhk-dark';
      case 'literature': return 'bg-course-literature-light dark:bg-course-literature-dark';
      case 'social': return 'bg-course-social-light dark:bg-course-social-dark';
      default: return 'bg-primary-light dark:bg-primary-dark';
    }
  };

  const getCourseLabel = (course: string) => {
    switch (course) {
      case 'history': return 'История';
      case 'mhk': return 'МХК';
      case 'literature': return 'Литература';
      case 'social': return 'Обществознание';
      default: return course;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Управление расписанием
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Всего {filteredLessons.length} занятий
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-5 h-5 mr-2" />
          Добавить урок
        </Button>
      </div>

      {/* Course Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCourse('all')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
            selectedCourse === 'all'
              ? 'bg-primary-light dark:bg-primary-dark text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          Все курсы
        </button>
        <button
          onClick={() => setSelectedCourse('history')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
            selectedCourse === 'history'
              ? 'bg-course-history-light dark:bg-course-history-dark text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          История
        </button>
        <button
          onClick={() => setSelectedCourse('mhk')}
          className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
            selectedCourse === 'mhk'
              ? 'bg-course-mhk-light dark:bg-course-mhk-dark text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          МХК
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredLessons.length}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Всего</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
              {upcomingLessons.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Предстоящих</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-light dark:text-success-dark">
              {completedLessons.length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Завершено</div>
          </div>
        </Card>
      </div>

      {/* Upcoming Lessons */}
      {upcomingLessons.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Предстоящие уроки
          </h4>
          <div className="space-y-3">
            {upcomingLessons.map((lesson) => (
              <Card key={lesson.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 ${getCourseColor(lesson.course)} text-white text-xs font-medium rounded-lg`}>
                          {getCourseLabel(lesson.course)}
                        </span>
                        {lesson.status === 'today' && (
                          <span className="px-2 py-1 bg-warning-light/10 dark:bg-warning-dark/10 text-warning-light dark:text-warning-dark text-xs font-medium rounded-lg">
                            Сегодня
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {lesson.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(lesson.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {lesson.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {lesson.groupIds.length} {lesson.groupIds.length === 1 ? 'группа' : 'группы'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleOpenModal(lesson)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="danger"
                        size="small"
                        onClick={() => handleDeleteLesson(lesson.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {lesson.zoomLink && (
                    <div className="flex gap-2">
                      <a
                        href={lesson.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-4 py-2 ${getCourseColor(lesson.course)} text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity`}
                      >
                        <Video className="w-4 h-4" />
                        Zoom
                      </a>
                      {lesson.materialLink && (
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
                          <FileText className="w-4 h-4" />
                          Материалы
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl p-6 my-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {editingLesson ? 'Редактировать урок' : 'Добавить урок'}
            </h2>
            <form onSubmit={handleSubmitLesson} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Название урока
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Дата
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Время
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Преподаватель
                </label>
                <input
                  type="text"
                  value={formData.teacher}
                  onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ссылка на Zoom
                </label>
                <input
                  type="url"
                  value={formData.zoomLink}
                  onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                  placeholder="https://zoom.us/j/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Курс
                </label>
                <select
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                >
                  <option value="history">История</option>
                  <option value="mhk">МХК</option>
                  <option value="literature">Литература</option>
                  <option value="social">Обществознание</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Группы
                </label>
                <div className="space-y-2">
                  {groups.map((group) => (
                    <label
                      key={group.id}
                      className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.groupIds.includes(group.id)}
                        onChange={() => toggleGroupSelection(group.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                        {group.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  {editingLesson ? 'Сохранить' : 'Создать'}
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

export default ScheduleManagement;

