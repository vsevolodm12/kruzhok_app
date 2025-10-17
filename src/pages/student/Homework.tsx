import React, { useState } from 'react';
import { BookOpen, Download, Upload, CheckCircle, Clock, AlertCircle, FileText, X } from 'lucide-react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';

interface HomeworkItem {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'not-submitted' | 'pending' | 'reviewed';
  grade?: number;
  comment?: string;
  assignmentFile?: string;
  submittedFile?: string;
  curatorFile?: string;
  daysLeft?: number;
}

const Homework: React.FC = () => {
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<number | null>(null);

  const homeworks: HomeworkItem[] = [
    {
      id: 1,
      title: 'Первые князья',
      description: 'Анализ внешней политики первых Рюриковичей. Подготовить эссе на 3-4 страницы.',
      deadline: '12 октября, 23:59',
      status: 'not-submitted',
      assignmentFile: 'hw5_task.pdf',
      daysLeft: 2,
    },
    {
      id: 2,
      title: 'Древняя Русь',
      description: 'Сравнительный анализ теорий происхождения древнерусского государства',
      deadline: '10 октября, 23:59',
      status: 'pending',
      assignmentFile: 'hw4_task.pdf',
      submittedFile: 'hw4_solution.pdf',
    },
    {
      id: 3,
      title: 'Славяне',
      description: 'Восточные славяне в VI-IX веках. Анализ источников.',
      deadline: '5 октября, 23:59',
      status: 'reviewed',
      grade: 92,
      comment: 'Отличная работа! Хорошо раскрыта тема. Обратите внимание на замечания в прикрепленном файле.',
      assignmentFile: 'hw3_task.pdf',
      submittedFile: 'hw3_solution.pdf',
      curatorFile: 'hw3_review.pdf',
    },
    {
      id: 4,
      title: 'Славяне (часть 2)',
      description: 'Дополнительное задание по теме славян',
      deadline: '5 октября, 23:59',
      status: 'reviewed',
      grade: 88,
      comment: 'Хорошо, но можно было больше деталей.',
      assignmentFile: 'hw3_2_task.pdf',
      submittedFile: 'hw3_2_solution.pdf',
    },
  ];

  const getStatusIcon = (status: HomeworkItem['status']) => {
    switch (status) {
      case 'not-submitted':
        return <AlertCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'reviewed':
        return <CheckCircle className="w-5 h-5" />;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingFile(file);
    }
  };

  const handleSubmit = (homeworkId: number) => {
    // Здесь будет логика отправки файла
    console.log('Submitting file for homework', homeworkId, uploadingFile);
    setUploadingFile(null);
    setShowUploadModal(null);
  };

  const getDaysUntilDeadline = (homework: HomeworkItem) => {
    // Если есть явно указанное значение, используем его
    if (homework.daysLeft !== undefined) return homework.daysLeft;
    // Простая логика для демо
    if (homework.deadline.includes('12 октября')) return 2;
    if (homework.deadline.includes('10 октября')) return 0;
    if (homework.deadline.includes('5 октября')) return -5;
    return 1;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary">Домашки</h2>
        <BookOpen className="w-6 h-6 text-primary" />
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <Card>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-primary">
              {homeworks.filter(h => h.status === 'not-submitted').length}
            </div>
            <div className="text-xs lg:text-sm text-secondary mt-1">Не сдано</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-warning-light dark:text-warning-dark">
              {homeworks.filter(h => h.status === 'pending').length}
            </div>
            <div className="text-xs lg:text-sm text-secondary mt-1">На проверке</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl lg:text-3xl font-bold text-success-light dark:text-success-dark">
              {homeworks.filter(h => h.status === 'reviewed').length}
            </div>
            <div className="text-xs lg:text-sm text-secondary mt-1">Проверено</div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1">
        {homeworks.map((homework) => (
          <Card key={homework.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {homework.title}
                  </h3>
                  <p className="text-sm text-secondary mb-3">
                    {homework.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-secondary">
                    <Clock className="w-4 h-4" />
                    <span>Дедлайн: {homework.deadline}</span>
                    {homework.status === 'not-submitted' && (
                      <span className="text-error-light dark:text-error-dark font-medium">
                        (осталось {getDaysUntilDeadline(homework)} дней)
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(homework.status)}
                  <StatusBadge status={homework.status} />
                </div>
              </div>

              {homework.status === 'reviewed' && homework.grade !== undefined && (
                <div className="p-4 bg-success-light/10 dark:bg-success-dark/10 border-2 border-success-light/20 dark:border-success-dark/20 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">Оценка</span>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-success-light dark:text-success-dark">
                        {homework.grade}
                      </span>
                    </div>
                  </div>
                  {homework.comment && (
                    <div className="mt-3 pt-3 border-t border-success-light/20 dark:border-success-dark/20">
                      <p className="text-sm font-medium text-primary mb-1">Комментарий куратора:</p>
                      <p className="text-sm text-secondary">{homework.comment}</p>
                    </div>
                  )}
                </div>
              )}

              <div className={`flex flex-wrap gap-2`}>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                  <Download className="w-4 h-4" />
                  Скачать задание
                </button>
                
                {homework.submittedFile && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                    <FileText className="w-4 h-4" />
                    Моё решение
                  </button>
                )}

                {homework.curatorFile && (
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-light/10 dark:bg-primary-dark/10 rounded-xl text-sm font-medium text-primary-light dark:text-primary-dark hover:opacity-80 transition-opacity">
                    <Download className="w-4 h-4" />
                    Файл с комментариями
                  </button>
                )}

                {homework.status !== 'reviewed' && (
                  <>
                    {!showUploadModal || showUploadModal !== homework.id ? (
                      <button 
                        onClick={() => setShowUploadModal(homework.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 btn-primary"
                      >
                        <Upload className="w-4 h-4" />
                        {homework.status === 'not-submitted' ? 'Отправить решение' : 'Изменить решение'}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          id={`file-upload-${homework.id}`}
                        />
                        <label
                          htmlFor={`file-upload-${homework.id}`}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingFile ? uploadingFile.name : 'Выбрать файл'}
                        </label>
                        {uploadingFile && (
                          <button
                            onClick={() => handleSubmit(homework.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2.5 btn-primary"
                          >
                            Отправить
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setShowUploadModal(null);
                            setUploadingFile(null);
                          }}
                          className="p-2 hover:bg-surfaceSecondary-light dark:hover:bg-surfaceSecondary-dark rounded-xl transition-colors"
                        >
                          <X className="w-5 h-5 text-secondary" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Homework;
