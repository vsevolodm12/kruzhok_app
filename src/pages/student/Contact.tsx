import React, { useState } from 'react';
import { MessageCircle, Send, User, Mail, Paperclip } from 'lucide-react';
import Card from '../../components/Card';

interface Message {
  id: number;
  date: string;
  question: string;
  answer?: string;
  status: 'pending' | 'answered';
}

const Contact: React.FC = () => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachedFiles(Array.from(e.target.files));
    }
  };

  const messages: Message[] = [
    { 
      id: 1,
      date: '8 окт', 
      question: 'Вопрос по домашке #4: не могу понять требования к эссе', 
      answer: 'Привет! Эссе должно быть на 3-4 страницы, с анализом минимум 3 источников. Структура: введение, основная часть, заключение.',
      status: 'answered' 
    },
    { 
      id: 2,
      date: '5 окт', 
      question: 'Можно ли продлить дедлайн по ДЗ #3?', 
      answer: 'Да, можем продлить до среды. Но постарайся сдавать вовремя в следующий раз.',
      status: 'answered' 
    },
    { 
      id: 3,
      date: '3 окт', 
      question: 'Где можно найти дополнительные материалы по теме Древней Руси?',
      status: 'pending' 
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Отправка сообщения:', message);
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary">Связь с куратором</h2>
        <MessageCircle className="w-6 h-6 text-primary" />
      </div>

      {/* Информация о кураторе */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-light to-blue-600 dark:from-primary-dark dark:to-blue-500 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-primary">Юля Арбузова</h3>
            <p className="text-sm text-secondary">Куратор по истории</p>
          </div>
        </div>

        <div className="p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-sm text-primary break-all">arbuzova@example.com</span>
          </div>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-sm text-primary">@julia_history_curator</span>
          </div>
        </div>
      </Card>

      {/* Форма сообщения ИИ */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-primary">Спросить у ИИ-помощника</h3>
            <p className="text-xs text-secondary">Нейробот ответит на ваши вопросы</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Напишите ваш вопрос для ИИ-помощника..."
              rows={6}
              className="textarea"
            />
          </div>

          {/* Attached files display */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-lg">
                  <Paperclip className="w-4 h-4 text-secondary" />
                  <span className="text-sm text-primary flex-1 truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setAttachedFiles(files => files.filter((_, i) => i !== index))}
                    className="text-error-light dark:text-error-dark hover:opacity-80 text-xs"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <label className="cursor-pointer p-3 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark hover:opacity-80 transition-opacity rounded-xl flex items-center justify-center">
              <Paperclip className="w-5 h-5 text-primary" />
              <input
                type="file"
                multiple
                onChange={handleFileAttach}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </label>
            <button
              type="submit"
              disabled={!message.trim()}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Отправить вопрос
            </button>
          </div>
        </form>
      </Card>

      {/* История обращений */}
      <Card>
        <h3 className="text-lg font-semibold text-primary mb-4">Последние обращения</h3>
        <div className="space-y-4">
          {messages.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-surfaceSecondary-light dark:bg-surfaceSecondary-dark rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${item.status === 'answered' ? 'badge-success' : 'badge-warning'}`}>
                      {item.status === 'answered' ? 'Отвечено' : 'Ожидает ответа'}
                    </span>
                    <span className="text-xs text-secondary">{item.date}</span>
                  </div>
                  <p className="font-medium text-primary text-sm mb-2">
                    Вопрос: {item.question}
                  </p>
                  {item.answer && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium text-secondary mb-1">Ответ куратора:</p>
                      <p className="text-sm text-primary">{item.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-secondary opacity-50" />
            <p className="text-secondary">Обращений пока нет</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Contact;
