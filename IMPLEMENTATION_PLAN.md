# План реализации проекта "Кружок Станкевича"

> Подробный план разработки Telegram Mini App для подготовки к олимпиадам по истории

## 📋 Оглавление

1. [Этап 1: Подготовка и планирование](#этап-1-подготовка-и-планирование)
2. [Этап 2: Настройка Backend](#этап-2-настройка-backend)
3. [Этап 3: База данных](#этап-3-база-данных)
4. [Этап 4: API разработка](#этап-4-api-разработка)
5. [Этап 5: Интеграция Frontend с Backend](#этап-5-интеграция-frontend-с-backend)
6. [Этап 6: Telegram Bot и авторизация](#этап-6-telegram-bot-и-авторизация)
7. [Этап 7: Работа с файлами](#этап-7-работа-с-файлами)
8. [Этап 8: Уведомления](#этап-8-уведомления)
9. [Этап 9: Деплой и инфраструктура](#этап-9-деплой-и-инфраструктура)
10. [Этап 10: Тестирование](#этап-10-тестирование)
11. [Этап 11: Оптимизация и масштабирование](#этап-11-оптимизация-и-масштабирование)

---

## Этап 1: Подготовка и планирование

### 1.1. Определение требований

**Функциональные требования:**
- ✅ Авторизация через Telegram
- ✅ Два типа пользователей: студент и куратор
- ✅ Управление уроками (CRUD для куратора)
- ✅ Управление домашними заданиями
- ✅ Загрузка и скачивание файлов
- ✅ Система оценок и комментариев
- ✅ Статистика и отчёты
- ✅ Уведомления о дедлайнах и новых заданиях

**Технические требования:**
- ✅ Поддержка мобильных устройств
- ✅ Светлая и тёмная тема
- ✅ Быстрая загрузка (< 3 сек)
- ✅ Работа с Telegram Mini App API
- ✅ Безопасное хранение данных

### 1.2. Выбор технологий

**Frontend:** (уже реализовано)
- React 19 + TypeScript
- Vite для сборки
- Tailwind CSS
- React Router для навигации
- @twa-dev/sdk для интеграции с Telegram

**Backend:** (рекомендации)
- Node.js + Express (или Fastify для производительности)
- TypeScript для типобезопасности
- PostgreSQL для базы данных
- Prisma ORM для работы с БД
- Redis для кеширования
- AWS S3 (или аналог) для хранения файлов

**Инфраструктура:**
- Docker для контейнеризации
- GitHub Actions для CI/CD
- Nginx для reverse proxy
- SSL сертификаты (Let's Encrypt)

### 1.3. Создание схемы базы данных

```
Таблицы:
- users (пользователи)
- lessons (уроки)
- homework_tasks (задания)
- submissions (сдачи работ)
- files (файлы)
- notifications (уведомления)
- statistics (статистика)
```

---

## Этап 2: Настройка Backend

### 2.1. Инициализация проекта

```bash
# Создаём папку для backend
mkdir backend
cd backend

# Инициализируем Node.js проект
npm init -y

# Устанавливаем зависимости
npm install express typescript @types/express @types/node
npm install prisma @prisma/client
npm install dotenv cors helmet compression
npm install jsonwebtoken bcrypt
npm install multer # для загрузки файлов
npm install node-telegram-bot-api
npm install date-fns
npm install zod # для валидации

# Dev зависимости
npm install -D nodemon ts-node tsx @types/multer
npm install -D @types/jsonwebtoken @types/bcrypt
npm install -D @types/node-telegram-bot-api
```

### 2.2. Структура проекта backend

```
backend/
├── src/
│   ├── config/           # Конфигурации
│   │   ├── database.ts
│   │   ├── telegram.ts
│   │   └── aws.ts
│   ├── controllers/      # Контроллеры
│   │   ├── auth.controller.ts
│   │   ├── lessons.controller.ts
│   │   ├── homework.controller.ts
│   │   ├── submissions.controller.ts
│   │   └── users.controller.ts
│   ├── services/         # Бизнес-логика
│   │   ├── auth.service.ts
│   │   ├── lessons.service.ts
│   │   ├── homework.service.ts
│   │   ├── submissions.service.ts
│   │   ├── files.service.ts
│   │   ├── notifications.service.ts
│   │   └── statistics.service.ts
│   ├── middleware/       # Middleware
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   ├── routes/          # Маршруты API
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── lessons.routes.ts
│   │   ├── homework.routes.ts
│   │   ├── submissions.routes.ts
│   │   └── files.routes.ts
│   ├── types/           # TypeScript типы
│   │   └── index.ts
│   ├── utils/           # Утилиты
│   │   ├── logger.ts
│   │   ├── validators.ts
│   │   └── helpers.ts
│   ├── prisma/          # Prisma schema
│   │   └── schema.prisma
│   └── app.ts           # Главный файл приложения
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

### 2.3. Настройка TypeScript

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 2.4. Переменные окружения

**.env.example:**
```env
# Server
NODE_ENV=development
PORT=3000
API_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/kruzhok_db

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Telegram
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_BOT_USERNAME=your_bot_username

# AWS S3 (или другое хранилище)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=kruzhok-files

# Redis (опционально для кеширования)
REDIS_URL=redis://localhost:6379

# Frontend URL (для CORS)
FRONTEND_URL=http://localhost:5173
```

---

## Этап 3: База данных

### 3.1. Установка PostgreSQL

**Локально (macOS):**
```bash
brew install postgresql@15
brew services start postgresql@15
createdb kruzhok_db
```

**Или через Docker:**
```bash
docker run --name kruzhok-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=kruzhok_db \
  -p 5432:5432 -d postgres:15
```

### 3.2. Prisma Schema

**prisma/schema.prisma:**
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Пользователи
model User {
  id            String   @id @default(uuid())
  telegramId    BigInt   @unique
  username      String?
  firstName     String?
  lastName      String?
  email         String?  @unique
  role          Role     @default(STUDENT)
  photoUrl      String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  submissions   Submission[]
  notifications Notification[]
  progress      Progress?
  
  @@index([telegramId])
  @@index([role])
}

enum Role {
  STUDENT
  CURATOR
  ADMIN
}

// Уроки
model Lesson {
  id          String   @id @default(uuid())
  title       String
  description String
  date        DateTime
  time        String
  zoomLink    String?
  materials   String?  // JSON строка с ссылками на материалы
  status      LessonStatus @default(UPCOMING)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  homework    HomeworkTask[]
  
  @@index([date])
  @@index([status])
}

enum LessonStatus {
  UPCOMING
  TODAY
  COMPLETED
  CANCELLED
}

// Домашние задания
model HomeworkTask {
  id          String   @id @default(uuid())
  title       String
  description String
  deadline    DateTime
  maxScore    Int      @default(100)
  fileUrl     String?  // Ссылка на файл с заданием
  
  lessonId    String
  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  submissions Submission[]
  
  @@index([lessonId])
  @@index([deadline])
}

// Сдачи работ
model Submission {
  id            String   @id @default(uuid())
  
  studentId     String
  student       User     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  
  homeworkId    String
  homework      HomeworkTask @relation(fields: [homeworkId], references: [id], onDelete: Cascade)
  
  fileUrl       String
  status        SubmissionStatus @default(PENDING)
  grade         Int?
  comment       String?
  
  submittedAt   DateTime @default(now())
  reviewedAt    DateTime?
  
  @@unique([studentId, homeworkId])
  @@index([studentId])
  @@index([homeworkId])
  @@index([status])
}

enum SubmissionStatus {
  NOT_SUBMITTED
  PENDING
  REVIEWED
}

// Прогресс студента
model Progress {
  id                    String   @id @default(uuid())
  
  userId                String   @unique
  user                  User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  attendance            Float    @default(0)
  homeworkCompletion    Float    @default(0)
  averageGrade          Float    @default(0)
  
  lessonsAttended       Int      @default(0)
  lessonsTotal          Int      @default(0)
  homeworksCompleted    Int      @default(0)
  homeworksTotal        Int      @default(0)
  
  updatedAt             DateTime @updatedAt
}

// Уведомления
model Notification {
  id        String   @id @default(uuid())
  
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type      NotificationType
  title     String
  message   String
  link      String?
  read      Boolean  @default(false)
  
  createdAt DateTime @default(now())
  
  @@index([userId])
  @@index([read])
  @@index([createdAt])
}

enum NotificationType {
  NEW_LESSON
  NEW_HOMEWORK
  DEADLINE_SOON
  HOMEWORK_REVIEWED
  ANNOUNCEMENT
}

// Файлы
model File {
  id        String   @id @default(uuid())
  filename  String
  originalName String
  mimetype  String
  size      Int
  url       String
  uploadedBy String
  createdAt DateTime @default(now())
  
  @@index([uploadedBy])
}
```

### 3.3. Миграции

```bash
# Инициализация Prisma
npx prisma init

# Создание миграции
npx prisma migrate dev --name init

# Генерация Prisma Client
npx prisma generate

# Prisma Studio для просмотра данных
npx prisma studio
```

---

## Этап 4: API разработка

### 4.1. Создание основного сервера

**src/app.ts:**
```typescript
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app;
```

### 4.2. Маршруты API

**Структура API:**

```
POST   /api/auth/telegram        - Авторизация через Telegram
GET    /api/auth/me              - Получить текущего пользователя

GET    /api/lessons              - Список уроков
POST   /api/lessons              - Создать урок (куратор)
GET    /api/lessons/:id          - Получить урок
PUT    /api/lessons/:id          - Обновить урок (куратор)
DELETE /api/lessons/:id          - Удалить урок (куратор)

GET    /api/homework             - Список домашек
POST   /api/homework             - Создать домашку (куратор)
GET    /api/homework/:id         - Получить домашку
PUT    /api/homework/:id         - Обновить домашку (куратор)
DELETE /api/homework/:id         - Удалить домашку (куратор)

GET    /api/submissions          - Список сдач
POST   /api/submissions          - Сдать работу (студент)
GET    /api/submissions/:id      - Получить сдачу
PUT    /api/submissions/:id      - Обновить оценку (куратор)

POST   /api/files/upload         - Загрузить файл
GET    /api/files/:id            - Скачать файл

GET    /api/progress/:userId     - Прогресс студента
GET    /api/statistics           - Статистика группы (куратор)

GET    /api/notifications        - Уведомления
PUT    /api/notifications/:id/read - Отметить как прочитанное
```

### 4.3. Пример контроллера

**src/controllers/lessons.controller.ts:**
```typescript
import { Request, Response, NextFunction } from 'express';
import { lessonsService } from '../services/lessons.service';
import { AuthRequest } from '../types';

export const lessonsController = {
  // Получить все уроки
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const lessons = await lessonsService.getAll();
      res.json({ success: true, data: lessons });
    } catch (error) {
      next(error);
    }
  },

  // Создать урок (только куратор)
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lesson = await lessonsService.create(req.body, req.user!.id);
      res.status(201).json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  },

  // Получить один урок
  async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const lesson = await lessonsService.getById(req.params.id);
      res.json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  },

  // Обновить урок (только куратор)
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lesson = await lessonsService.update(req.params.id, req.body);
      res.json({ success: true, data: lesson });
    } catch (error) {
      next(error);
    }
  },

  // Удалить урок (только куратор)
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await lessonsService.delete(req.params.id);
      res.json({ success: true, message: 'Урок удалён' });
    } catch (error) {
      next(error);
    }
  }
};
```

### 4.4. Пример сервиса

**src/services/lessons.service.ts:**
```typescript
import { PrismaClient } from '@prisma/client';
import { CreateLessonDto, UpdateLessonDto } from '../types';

const prisma = new PrismaClient();

export const lessonsService = {
  async getAll() {
    return await prisma.lesson.findMany({
      include: {
        homework: true
      },
      orderBy: {
        date: 'asc'
      }
    });
  },

  async getById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        homework: true
      }
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    return lesson;
  },

  async create(data: CreateLessonDto, creatorId: string) {
    return await prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        time: data.time,
        zoomLink: data.zoomLink,
        status: 'UPCOMING'
      }
    });
  },

  async update(id: string, data: UpdateLessonDto) {
    return await prisma.lesson.update({
      where: { id },
      data: {
        ...data,
        date: data.date ? new Date(data.date) : undefined
      }
    });
  },

  async delete(id: string) {
    return await prisma.lesson.delete({
      where: { id }
    });
  }
};
```

### 4.5. Middleware для авторизации

**src/middleware/auth.middleware.ts:**
```typescript
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Требуется авторизация' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Неверный токен' 
    });
  }
};

export const curatorOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'CURATOR' && req.user?.role !== 'ADMIN') {
    return res.status(403).json({ 
      success: false, 
      message: 'Доступ запрещён' 
    });
  }
  next();
};
```

---

## Этап 5: Интеграция Frontend с Backend

### 5.1. Создание API клиента

**src/api/client.ts:**
```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем токен к каждому запросу
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);
```

### 5.2. API функции

**src/api/lessons.ts:**
```typescript
import { apiClient } from './client';
import { Lesson, CreateLessonDto } from '../types';

export const lessonsAPI = {
  getAll: async (): Promise<Lesson[]> => {
    const { data } = await apiClient.get('/lessons');
    return data.data;
  },

  getOne: async (id: string): Promise<Lesson> => {
    const { data } = await apiClient.get(`/lessons/${id}`);
    return data.data;
  },

  create: async (lessonData: CreateLessonDto): Promise<Lesson> => {
    const { data } = await apiClient.post('/lessons', lessonData);
    return data.data;
  },

  update: async (id: string, lessonData: Partial<CreateLessonDto>): Promise<Lesson> => {
    const { data } = await apiClient.put(`/lessons/${id}`, lessonData);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/lessons/${id}`);
  }
};
```

### 5.3. React Query для кеширования

```bash
npm install @tanstack/react-query
```

**src/hooks/useLessons.ts:**
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsAPI } from '../api/lessons';
import { CreateLessonDto } from '../types';

export const useLessons = () => {
  return useQuery({
    queryKey: ['lessons'],
    queryFn: lessonsAPI.getAll
  });
};

export const useCreateLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLessonDto) => lessonsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }
  });
};

export const useDeleteLesson = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => lessonsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    }
  });
};
```

### 5.4. Обновление компонентов

**src/pages/student/Schedule.tsx (обновлённый):**
```typescript
import React from 'react';
import { useLessons } from '../../hooks/useLessons';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import Card from '../../components/Card';
// ... остальные импорты

const Schedule: React.FC = () => {
  const { data: lessons, isLoading, error } = useLessons();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Ошибка загрузки уроков</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Расписание</h2>
      
      <div className="space-y-4">
        {lessons?.map((lesson) => (
          <Card key={lesson.id}>
            <h3 className="text-lg font-semibold text-primary">
              {lesson.title}
            </h3>
            <p className="text-sm text-secondary">{lesson.description}</p>
            {/* ... остальной контент */}
          </Card>
        ))}
      </div>
    </div>
  );
};
```

---

## Этап 6: Telegram Bot и авторизация

### 6.1. Создание Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram
2. Отправьте `/newbot`
3. Укажите имя бота: `Кружок Станкевича`
4. Укажите username: `kruzhok_stankevich_bot`
5. Сохраните токен

### 6.2. Настройка Mini App

1. Отправьте `/newapp` в BotFather
2. Выберите вашего бота
3. Укажите название приложения
4. Загрузите иконку (512x512 px)
5. Укажите URL приложения: `https://your-domain.com`

### 6.3. Telegram Web App авторизация

**Frontend (src/services/telegram.ts):**
```typescript
import WebApp from '@twa-dev/sdk';
import { apiClient } from '../api/client';

export const telegramAuth = {
  async authenticate() {
    // Получаем данные из Telegram Web App
    const initData = WebApp.initData;
    const user = WebApp.initDataUnsafe.user;

    if (!initData || !user) {
      throw new Error('Telegram data not available');
    }

    // Отправляем на сервер для верификации
    const { data } = await apiClient.post('/auth/telegram', {
      initData,
      user
    });

    // Сохраняем токен
    localStorage.setItem('token', data.token);
    
    return data.user;
  },

  expandApp() {
    WebApp.expand();
  },

  enableClosingConfirmation() {
    WebApp.enableClosingConfirmation();
  },

  showAlert(message: string) {
    WebApp.showAlert(message);
  }
};
```

**Backend (src/services/auth.service.ts):**
```typescript
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authService = {
  // Проверка подписи Telegram
  verifyTelegramAuth(initData: string): boolean {
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
    
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    urlParams.delete('hash');
    
    const dataCheckString = Array.from(urlParams.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');
    
    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(BOT_TOKEN)
      .digest();
    
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    
    return calculatedHash === hash;
  },

  async authenticateUser(telegramUser: any) {
    // Находим или создаём пользователя
    let user = await prisma.user.findUnique({
      where: { telegramId: BigInt(telegramUser.id) }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId: BigInt(telegramUser.id),
          username: telegramUser.username,
          firstName: telegramUser.first_name,
          lastName: telegramUser.last_name,
          role: 'STUDENT' // По умолчанию студент
        }
      });
    }

    // Создаём JWT токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return { user, token };
  }
};
```

### 6.4. Интеграция в App.tsx

```typescript
import { useEffect, useState } from 'react';
import { telegramAuth } from './services/telegram';
import WebApp from '@twa-dev/sdk';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Инициализация Telegram Web App
        WebApp.ready();
        telegramAuth.expandApp();

        // Аутентификация
        await telegramAuth.authenticate();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth error:', error);
        WebApp.showAlert('Ошибка авторизации');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <div>Требуется авторизация</div>;

  return (
    // ... остальное приложение
  );
}
```

---

## Этап 7: Работа с файлами

### 7.1. Backend - загрузка файлов

**src/services/files.service.ts:**
```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export const filesService = {
  async upload(file: Express.Multer.File, userId: string) {
    const fileId = uuidv4();
    const key = `uploads/${userId}/${fileId}-${file.originalname}`;

    // Загружаем в S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype
      })
    );

    // Сохраняем в БД
    const fileRecord = await prisma.file.create({
      data: {
        id: fileId,
        filename: key,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
        uploadedBy: userId
      }
    });

    return fileRecord;
  },

  async getDownloadUrl(fileId: string): Promise<string> {
    const file = await prisma.file.findUnique({
      where: { id: fileId }
    });

    if (!file) {
      throw new Error('Файл не найден');
    }

    // Создаём подписанный URL (действителен 1 час)
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: file.filename
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  }
};
```

**src/routes/files.routes.ts:**
```typescript
import { Router } from 'router';
import multer from 'multer';
import { filesController } from '../controllers/files.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  filesController.upload
);

router.get(
  '/:id',
  authMiddleware,
  filesController.getDownloadUrl
);

export default router;
```

### 7.2. Frontend - загрузка файлов

**src/components/FileUpload.tsx:**
```typescript
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { apiClient } from '../api/client';

interface FileUploadProps {
  onUploadSuccess: (fileId: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data } = await apiClient.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUploadSuccess(data.data.id);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка загрузки файла');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
      <label
        htmlFor="file-upload"
        className="btn-primary flex items-center gap-2 cursor-pointer"
      >
        <Upload className="w-4 h-4" />
        {uploading ? 'Загрузка...' : 'Выбрать файл'}
      </label>
    </div>
  );
};
```

---

## Этап 8: Уведомления

### 8.1. Backend - отправка уведомлений

**src/services/notifications.service.ts:**
```typescript
import { PrismaClient, NotificationType } from '@prisma/client';
import TelegramBot from 'node-telegram-bot-api';

const prisma = new PrismaClient();
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: false });

export const notificationsService = {
  async create(userId: string, type: NotificationType, title: string, message: string, link?: string) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link
      }
    });

    // Отправляем в Telegram
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.telegramId) {
      await this.sendTelegramNotification(
        Number(user.telegramId),
        title,
        message,
        link
      );
    }

    return notification;
  },

  async sendTelegramNotification(
    telegramId: number,
    title: string,
    message: string,
    link?: string
  ) {
    let text = `*${title}*\n\n${message}`;
    
    const options: any = {
      parse_mode: 'Markdown'
    };

    if (link) {
      options.reply_markup = {
        inline_keyboard: [[
          { text: 'Открыть', web_app: { url: link } }
        ]]
      };
    }

    try {
      await bot.sendMessage(telegramId, text, options);
    } catch (error) {
      console.error('Telegram notification error:', error);
    }
  },

  async notifyDeadlineSoon(homeworkId: string) {
    const homework = await prisma.homeworkTask.findUnique({
      where: { id: homeworkId },
      include: {
        submissions: {
          where: {
            status: { not: 'REVIEWED' }
          },
          include: { student: true }
        }
      }
    });

    if (!homework) return;

    // Уведомляем всех студентов, не сдавших работу
    for (const submission of homework.submissions) {
      if (submission.status === 'NOT_SUBMITTED') {
        await this.create(
          submission.studentId,
          'DEADLINE_SOON',
          'Скоро дедлайн!',
          `Осталось 2 дня до сдачи "${homework.title}"`,
          `/homework/${homeworkId}`
        );
      }
    }
  },

  async notifyHomeworkReviewed(submissionId: string) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        homework: true,
        student: true
      }
    });

    if (!submission) return;

    await this.create(
      submission.studentId,
      'HOMEWORK_REVIEWED',
      'Домашка проверена',
      `Ваша работа "${submission.homework.title}" проверена. Оценка: ${submission.grade}%`,
      `/homework/${submission.homeworkId}`
    );
  }
};
```

### 8.2. Планировщик задач

```bash
npm install node-cron
```

**src/services/scheduler.service.ts:**
```typescript
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { notificationsService } from './notifications.service';

const prisma = new PrismaClient();

export const schedulerService = {
  start() {
    // Проверка дедлайнов каждый день в 10:00
    cron.schedule('0 10 * * *', async () => {
      console.log('Checking deadlines...');
      
      const twoDaysFromNow = new Date();
      twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

      const upcomingHomework = await prisma.homeworkTask.findMany({
        where: {
          deadline: {
            gte: new Date(),
            lte: twoDaysFromNow
          }
        }
      });

      for (const homework of upcomingHomework) {
        await notificationsService.notifyDeadlineSoon(homework.id);
      }
    });

    console.log('Scheduler started');
  }
};
```

---

## Этап 9: Деплой и инфраструктура

### 9.1. Docker

**Dockerfile (backend):**
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: kruzhok_db
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/kruzhok_db
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 9.2. GitHub Actions

**.github/workflows/deploy.yml:**
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.API_URL }}
      
      - name: Deploy to server
        uses: easingthemes/ssh-deploy@v2
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
          REMOTE_USER: ${{ secrets.REMOTE_USER }}
          TARGET: /var/www/kruzhok
```

### 9.3. Nginx конфигурация

**/etc/nginx/sites-available/kruzhok:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /var/www/kruzhok/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 9.4. SSL сертификат

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com

# Автообновление
sudo certbot renew --dry-run
```

---

## Этап 10: Тестирование

### 10.1. Unit тесты (Backend)

```bash
npm install -D jest @types/jest ts-jest supertest @types/supertest
```

**backend/src/services/lessons.service.test.ts:**
```typescript
import { lessonsService } from './lessons.service';
import { prismaMock } from '../test/prisma-mock';

describe('LessonsService', () => {
  test('should create a lesson', async () => {
    const lessonData = {
      title: 'Test Lesson',
      description: 'Test Description',
      date: '2025-10-15',
      time: '18:00'
    };

    prismaMock.lesson.create.mockResolvedValue({
      id: '1',
      ...lessonData,
      date: new Date(lessonData.date),
      status: 'UPCOMING',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const lesson = await lessonsService.create(lessonData, 'user-id');

    expect(lesson.title).toBe(lessonData.title);
  });
});
```

### 10.2. E2E тесты (Frontend)

```bash
npm install -D @playwright/test
```

**tests/e2e/lessons.spec.ts:**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Lessons', () => {
  test('should display lessons list', async ({ page }) => {
    await page.goto('/schedule');
    
    await expect(page.getByText('Расписание')).toBeVisible();
    await expect(page.getByText('Древняя Русь')).toBeVisible();
  });

  test('curator should be able to create lesson', async ({ page }) => {
    await page.goto('/curator/lessons');
    
    await page.click('text=Добавить урок');
    await page.fill('input[name="title"]', 'Новый урок');
    await page.fill('textarea[name="description"]', 'Описание урока');
    await page.click('button[type="submit"]');
    
    await expect(page.getByText('Новый урок')).toBeVisible();
  });
});
```

---

## Этап 11: Оптимизация и масштабирование

### 11.1. Кеширование с Redis

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttl = 3600) {
    await redis.setex(key, ttl, JSON.stringify(value));
  },

  async invalidate(pattern: string) {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
};

// Использование
export const lessonsService = {
  async getAll() {
    const cached = await cacheService.get<Lesson[]>('lessons:all');
    if (cached) return cached;

    const lessons = await prisma.lesson.findMany();
    await cacheService.set('lessons:all', lessons, 600); // 10 минут
    
    return lessons;
  }
};
```

### 11.2. Оптимизация изображений

```bash
npm install sharp
```

```typescript
import sharp from 'sharp';

export const imageService = {
  async optimize(buffer: Buffer): Promise<Buffer> {
    return await sharp(buffer)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
  }
};
```

### 11.3. Мониторинг

```bash
npm install @sentry/node @sentry/tracing
```

```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
// ... routes
app.use(Sentry.Handlers.errorHandler());
```

---

## 📊 Итоговый чеклист

### Backend
- [ ] Настроить Node.js + Express
- [ ] Подключить PostgreSQL
- [ ] Создать Prisma схему
- [ ] Реализовать API endpoints
- [ ] Добавить JWT авторизацию
- [ ] Настроить загрузку файлов (S3)
- [ ] Реализовать уведомления
- [ ] Добавить планировщик задач
- [ ] Написать тесты

### Frontend
- [ ] Подключить API клиент
- [ ] Интегрировать React Query
- [ ] Реализовать Telegram авторизацию
- [ ] Добавить загрузку файлов
- [ ] Обработать все состояния (loading, error)
- [ ] Добавить оптимистичные обновления
- [ ] Написать E2E тесты

### DevOps
- [ ] Настроить Docker
- [ ] Создать CI/CD pipeline
- [ ] Настроить Nginx
- [ ] Получить SSL сертификат
- [ ] Настроить мониторинг
- [ ] Настроить бэкапы БД

### Telegram
- [ ] Создать бота в BotFather
- [ ] Настроить Mini App
- [ ] Протестировать авторизацию
- [ ] Настроить уведомления

---

## 🚀 Запуск проекта

### Development

```bash
# Backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Frontend
npm install
npm run dev
```

### Production

```bash
# Запуск через Docker
docker-compose up -d

# Или manual
cd backend
npm run build
npm start

# Frontend
npm run build
# Файлы в dist/ раздавать через Nginx
```

---

## 📚 Дополнительные ресурсы

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/)

---

**Автор:** План реализации проекта "Кружок Станкевича"  
**Дата:** Октябрь 2025  
**Версия:** 1.0

