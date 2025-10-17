import React, { useState } from 'react';
import { CheckSquare, Download, Check, Upload, FileText, X } from 'lucide-react';
import Card from '../../components/Card';
import StatusBadge from '../../components/StatusBadge';

interface Submission {
  id: number;
  studentName: string;
  homework: string;
  submittedDate: string;
  status: 'pending' | 'reviewed';
  grade?: number;
  comment?: string;
  submittedFile: string;
  curatorFile?: string;
}

const Submissions: React.FC = () => {
  
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [grade, setGrade] = useState('');
  const [comment, setComment] = useState('');
  const [curatorFile, setCuratorFile] = useState<File | null>(null);

  const submissions: Submission[] = [
    {
      id: 1,
      studentName: 'Всеволод Марченко',
      homework: 'Источники по монгольскому периоду',
      submittedDate: '8 октября, 15:30',
      status: 'pending',
      submittedFile: 'homework4_vsevolod.pdf',
    },
    {
      id: 2,
      studentName: 'Александр Петров',
      homework: 'Источники по монгольскому периоду',
      submittedDate: '8 октября, 12:15',
      status: 'pending',
      submittedFile: 'homework4_alex.pdf',
    },
    {
      id: 3,
      studentName: 'Мария Сидорова',
      homework: 'Феодальная раздробленность',
      submittedDate: '5 октября, 18:45',
      status: 'reviewed',
      grade: 95,
      comment: 'Отличная работа! Глубокий анализ источников. Обратите внимание на замечания в файле.',
      submittedFile: 'homework3_maria.pdf',
      curatorFile: 'homework3_maria_review.pdf',
    },
    {
      id: 4,
      studentName: 'Дмитрий Козлов',
      homework: 'Феодальная раздробленность',
      submittedDate: '5 октября, 16:20',
      status: 'reviewed',
      grade: 88,
      comment: 'Хорошо, но нужно более детально проработать причинно-следственные связи.',
      submittedFile: 'homework3_dmitry.pdf',
    },
  ];

  const pendingCount = submissions.filter(s => s.status === 'pending').length;

  const handleReview = (submissionId: number) => {
    setReviewingId(submissionId);
    setGrade('');
    setComment('');
    setCuratorFile(null);
  };

  const handleSubmitReview = () => {
    console.log('Submitting review:', { reviewingId, grade, comment, curatorFile });
    setReviewingId(null);
    setGrade('');
    setComment('');
    setCuratorFile(null);
  };

  const handleCuratorFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCuratorFile(file);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success-light dark:text-success-dark';
    if (grade >= 75) return 'text-primary-light dark:text-primary-dark';
    if (grade >= 60) return 'text-warning-light dark:text-warning-dark';
    return 'text-error-light dark:text-error-dark';
  };

  const getGradeBgColor = (grade: number) => {
    if (grade >= 90) return 'bg-success-light/10 dark:bg-success-dark/10 border-success-light/20 dark:border-success-dark/20';
    if (grade >= 75) return 'bg-primary-light/10 dark:bg-primary-dark/10 border-primary-light/20 dark:border-primary-dark/20';
    if (grade >= 60) return 'bg-warning-light/10 dark:bg-warning-dark/10 border-warning-light/20 dark:border-warning-dark/20';
    return 'bg-error-light/10 dark:bg-error-dark/10 border-error-light/20 dark:border-error-dark/20';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">Проверка работ</h2>
          <p className="text-sm text-secondary mt-1">
            {pendingCount} работ ожидают проверки
          </p>
        </div>
        <CheckSquare className="w-6 h-6 text-primary" />
      </div>

      {/* Статистика */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-warning-light/10 dark:bg-warning-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <CheckSquare className="w-6 h-6 text-warning-light dark:text-warning-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">{pendingCount}</p>
            <p className="text-xs lg:text-sm text-secondary">На проверке</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="w-12 h-12 bg-success-light/10 dark:bg-success-dark/10 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Check className="w-6 h-6 text-success-light dark:text-success-dark" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-primary mb-1">
              {submissions.filter(s => s.status === 'reviewed').length}
            </p>
            <p className="text-xs lg:text-sm text-secondary">Проверено</p>
          </div>
        </Card>
      </div>

      {/* Список работ */}
      <div className="grid gap-4 grid-cols-1">
        {submissions.map((submission) => (
          <Card key={submission.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-primary mb-1">
                    {submission.studentName}
                  </h3>
                  <p className="text-sm text-secondary mb-2">{submission.homework}</p>
                  <p className="text-xs text-secondary">Сдано: {submission.submittedDate}</p>
                </div>
                <StatusBadge
                  status={submission.status}
                  label={submission.status === 'pending' ? 'На проверке' : 'Проверено'}
                />
              </div>

              {/* Reviewed Info */}
              {submission.status === 'reviewed' && submission.grade !== undefined && (
                <div className={`p-4 border-2 rounded-xl ${getGradeBgColor(submission.grade)}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-primary">Оценка</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-3xl font-bold ${getGradeColor(submission.grade)}`}>
                        {submission.grade}
                      </span>
                    </div>
                  </div>
                  {submission.comment && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-primary mb-1">Комментарий:</p>
                      <p className="text-sm text-secondary">{submission.comment}</p>
                    </div>
                  )}
                  {submission.curatorFile && (
                    <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
                      <button className="flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity">
                        <FileText className="w-4 h-4" />
                        <span className="underline">Файл с замечаниями: {submission.curatorFile}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Review Form */}
              {reviewingId === submission.id ? (
                <div className="space-y-4 p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl">
                  <h4 className="font-semibold text-primary">Проверка работы</h4>
                  
                  {/* Grade Input */}
                  <div
                    className="p-4 rounded-xl transition-all duration-200"
                    style={{
                      backgroundColor: grade
                        ? Number(grade) >= 90
                          ? 'rgba(52, 199, 89, 0.1)'
                          : Number(grade) >= 70
                          ? 'rgba(10, 94, 176, 0.1)'
                          : Number(grade) >= 50
                          ? 'rgba(255, 149, 0, 0.1)'
                          : 'rgba(255, 59, 48, 0.1)'
                        : 'transparent',
                    }}
                  >
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Оценка (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Введите оценку"
                      className="input"
                      style={{
                        borderColor: grade
                          ? Number(grade) >= 90
                            ? '#34C759'
                            : Number(grade) >= 70
                            ? '#0A5EB0'
                            : Number(grade) >= 50
                            ? '#FF9500'
                            : '#FF3B30'
                          : 'transparent',
                        borderWidth: grade ? '2px' : '2px',
                      }}
                    />
                    {grade && (
                      <p
                        className="text-sm font-medium mt-2"
                        style={{
                          color:
                            Number(grade) >= 90
                              ? '#34C759'
                              : Number(grade) >= 70
                              ? '#0A5EB0'
                              : Number(grade) >= 50
                              ? '#FF9500'
                              : '#FF3B30',
                        }}
                      >
                        {Number(grade) >= 90
                          ? 'Отлично'
                          : Number(grade) >= 70
                          ? 'Хорошо'
                          : Number(grade) >= 50
                          ? 'Удовлетворительно'
                          : 'Неудовлетворительно'}
                      </p>
                    )}
                  </div>

                  {/* Comment Input */}
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Комментарий
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Напишите комментарий к работе..."
                      rows={4}
                      className="textarea"
                    />
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-secondary mb-2">
                      Файл с замечаниями (необязательно)
                    </label>
                    <input
                      type="file"
                      onChange={handleCuratorFileUpload}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      id={`curator-file-${submission.id}`}
                    />
                    <label
                      htmlFor={`curator-file-${submission.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-surface-light dark:bg-surface-dark border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      {curatorFile ? curatorFile.name : 'Загрузить файл'}
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitReview}
                      disabled={!grade || !comment}
                      className="flex-1 btn-primary"
                    >
                      <Check className="w-4 h-4 inline mr-2" />
                      Сохранить оценку
                    </button>
                    <button
                      onClick={() => {
                        setReviewingId(null);
                        setGrade('');
                        setComment('');
                        setCuratorFile(null);
                      }}
                      className="p-3 hover:bg-surface-light dark:hover:bg-surface-dark rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-secondary" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity">
                    <Download className="w-4 h-4" />
                    Скачать работу
                  </button>
                  {submission.status === 'pending' && (
                    <button
                      onClick={() => handleReview(submission.id)}
                      className="flex items-center gap-2 btn-primary"
                    >
                      <Check className="w-4 h-4" />
                      Проверить
                    </button>
                  )}
                  {submission.status === 'reviewed' && (
                    <button
                      onClick={() => handleReview(submission.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl text-sm font-medium text-primary hover:opacity-80 transition-opacity"
                    >
                      Изменить оценку
                    </button>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Submissions;
