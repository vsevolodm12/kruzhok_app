// Вспомогательные функции

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = { 
    day: 'numeric', 
    month: 'long',
    year: 'numeric' 
  };
  return d.toLocaleDateString('ru-RU', options);
};

export const formatTime = (time: string): string => {
  return time;
};

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const dateStr = formatDate(d);
  const timeStr = d.toLocaleTimeString('ru-RU', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  return `${dateStr}, ${timeStr}`;
};

export const getDaysUntil = (date: string | Date): number => {
  const target = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getTimeUntil = (date: string | Date): string => {
  const days = getDaysUntil(date);
  
  if (days < 0) return 'Просрочено';
  if (days === 0) return 'Сегодня';
  if (days === 1) return 'Завтра';
  if (days < 7) return `Через ${days} дня`;
  if (days < 30) return `Через ${Math.floor(days / 7)} недель`;
  
  return `Через ${Math.floor(days / 30)} месяцев`;
};

export const getGradeColor = (grade: number): string => {
  if (grade >= 90) return 'text-green-600 dark:text-green-400';
  if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
  if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-orange-600 dark:text-orange-400';
};

export const getProgressColor = (progress: number): string => {
  if (progress >= 90) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 50) return 'bg-yellow-500';
  return 'bg-orange-500';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const downloadFile = (url: string, filename: string): void => {
  // Заглушка для скачивания файла
  console.log(`Скачивание файла: ${filename} из ${url}`);
  // В реальном приложении здесь будет логика скачивания
};

export const uploadFile = (file: File): Promise<string> => {
  // Заглушка для загрузки файла
  console.log(`Загрузка файла: ${file.name}`);
  return Promise.resolve(`/uploads/${file.name}`);
};

export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Скопировано в буфер обмена:', text);
  });
};

export const openZoomLink = (url: string): void => {
  window.open(url, '_blank');
};

