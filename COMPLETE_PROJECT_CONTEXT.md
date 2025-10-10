# ПОЛНЫЙ КОНТЕКСТ ПРОЕКТА "Кружок Станкевича"

Telegram Mini App для образовательной платформы подготовки к олимпиадам.

**Текущий статус:** Frontend готов с mock данными, требуется backend интеграция.

---

## АРХИТЕКТУРА СИСТЕМЫ

### Общая архитектура

```
┌─────────────┐      HTTPS      ┌─────────────┐      SQL       ┌──────────────┐
│   Telegram  │ ←──────────────→ │   Backend   │ ←────────────→ │  PostgreSQL  │
│   Mini App  │                  │   (Node.js) │                │              │
│  (React)    │                  │             │                └──────────────┘
└─────────────┘                  │             │
       ↓                         │             │      Cache     ┌──────────────┐
   WebSocket ←──────────────────→│             │ ←────────────→ │    Redis     │
       ↓                         │             │                └──────────────┘
 Telegram Bot ←──────────────────→│             │
  Webhooks                       │             │      S3        ┌──────────────┐
                                 │             │ ←────────────→ │  File Store  │
                                 └─────────────┘                └──────────────┘
```

### Стек технологий

**Frontend:**
- React 19 + TypeScript 5.9
- React Router DOM 7.9 (SPA routing)
- Tailwind CSS 3.4 (styling)
- Vite 7.1 (bundler)
- Telegram Web App SDK

**Backend:**
- Node.js 20+ / NestJS (фреймворк)
- Express (HTTP server)
- TypeScript
- Prisma ORM (работа с БД)
- Socket.io (WebSocket)
- JWT (токены)
- Multer (загрузка файлов)

**Базы данных:**
- PostgreSQL 15+ (основная БД)
- Redis 7+ (кеш, сессии, WebSocket rooms)

**Хранилище файлов:**
- AWS S3 / MinIO
- Presigned URLs для загрузки/скачивания

**Инфраструктура:**
- Docker + Docker Compose
- Nginx (reverse proxy)
- PM2 (process manager)
- Railway/Render (хостинг)

---

## АРХИТЕКТУРА BACKEND

### Структура backend

```
src/
├── modules/
│   ├── auth/              # Аутентификация
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   └── telegram.strategy.ts
│   ├── users/             # Пользователи
│   ├── courses/           # Курсы
│   ├── groups/            # Группы
│   ├── lessons/           # Уроки
│   ├── homework/          # Домашки
│   ├── submissions/       # Сдачи работ
│   ├── files/             # Файлы
│   ├── notifications/     # Уведомления
│   └── telegram/          # Telegram Bot
├── common/
│   ├── guards/            # Auth guards
│   ├── decorators/        # Custom decorators
│   ├── filters/           # Exception filters
│   └── interceptors/      # Response interceptors
├── config/                # Конфигурация
├── prisma/                # Prisma schema + migrations
└── main.ts
```

### Слои обработки запросов

```
Request → Middleware → Guard → Interceptor → Controller → Service → Repository → Database
                ↓                                                          ↓
            Validation                                              Prisma ORM
                ↓                                                          ↓
           Exception Filter ←─────────────────── Error ←────────── PostgreSQL
                ↓
            Response
```

### Аутентификация и авторизация

**Flow авторизации через Telegram:**

1. User открывает Mini App → Telegram передает initData
2. Frontend отправляет initData на `/api/auth/telegram`
3. Backend проверяет подпись (HMAC SHA-256 с bot token)
4. Если валидно:
   - Проверяет существование user по telegram_id
   - Если нет → создает новый аккаунт
   - Генерирует JWT access token (15 мин) + refresh token (7 дней)
   - Refresh сохраняется в Redis с TTL
5. Frontend сохраняет access в memory, refresh в httpOnly cookie
6. Каждый запрос → Authorization: Bearer {access_token}
7. При 401 → автоматический refresh через `/api/auth/refresh`

**Guards:**
- `JwtAuthGuard` - проверка JWT токена
- `RolesGuard` - проверка роли пользователя
- `OwnershipGuard` - проверка владения ресурсом

**Декораторы:**
- `@Roles('admin', 'curator')` - требуемые роли
- `@CurrentUser()` - получение текущего пользователя
- `@Public()` - публичный endpoint (без auth)

---

## БАЗА ДАННЫХ

### Схема PostgreSQL

**Связи:**
```
users (1) ──< (M) group_students (M) >── (1) groups
              ↓                              ↓
         student_id                      curator_id
              ↓                              ↓
           (роль)                       users (curator)

courses (M) ──< course_curators >── (M) users (curator)
   ↓
   (M) ──< group_courses >── (M) groups
   ↓
   (1) ──< lessons (M)
              ↓
         (1) ──< homework (M)
                    ↓
               (1) ──< submissions (M) >── (1) users (student)
```

**Таблицы:**

```sql
-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'curator', 'admin')),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_role ON users(role);

-- Курсы
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7),
  zoom_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Группы
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  curator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_groups_curator ON groups(curator_id);

-- Связь: группа-курсы (M-to-M)
CREATE TABLE group_courses (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, course_id)
);

-- Связь: курс-кураторы (M-to-M)
CREATE TABLE course_curators (
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  curator_id UUID REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (course_id, curator_id)
);

-- Связь: группа-студенты (M-to-M)
CREATE TABLE group_students (
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (group_id, student_id)
);

-- Уроки
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  teacher VARCHAR(255),
  zoom_link VARCHAR(500),
  zenclass_link VARCHAR(500),
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'today', 'completed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_lessons_date ON lessons(date DESC);
CREATE INDEX idx_lessons_course ON lessons(course_id);
CREATE INDEX idx_lessons_status ON lessons(status);

-- Связь: урок-группы (M-to-M)
CREATE TABLE lesson_groups (
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  PRIMARY KEY (lesson_id, group_id)
);

-- Материалы к уроку
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  file_url VARCHAR(500) NOT NULL,
  file_size INTEGER,
  file_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_materials_lesson ON materials(lesson_id);

-- Домашние задания
CREATE TABLE homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  curator_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  deadline TIMESTAMP NOT NULL,
  task_file_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_homework_deadline ON homework(deadline);
CREATE INDEX idx_homework_group ON homework(group_id);
CREATE INDEX idx_homework_curator ON homework(curator_id);

-- Сдачи работ
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id UUID REFERENCES homework(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP DEFAULT NOW(),
  solution_file_url VARCHAR(500),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed')),
  grade INTEGER CHECK (grade >= 0 AND grade <= 100),
  comment TEXT,
  feedback_file_url VARCHAR(500),
  reviewed_at TIMESTAMP,
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (homework_id, student_id)
);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_homework ON submissions(homework_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- Посещаемость
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (lesson_id, student_id)
);
CREATE INDEX idx_attendance_lesson ON attendance(lesson_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);

-- Уведомления
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Refresh токены
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

### Кеширование в Redis

**Структура данных:**

```
# Сессии пользователей
session:{user_id} → JSON { role, name, email } | TTL: 15 min

# Refresh токены
refresh:{token_hash} → user_id | TTL: 7 days

# Список уроков для студента (кеш)
lessons:student:{user_id} → JSON array | TTL: 5 min

# Список домашек для студента
homework:student:{user_id} → JSON array | TTL: 1 min

# Статистика группы (тяжелый запрос)
stats:group:{group_id} → JSON { avg_grade, attendance, ... } | TTL: 10 min

# WebSocket rooms
socket:room:{lesson_id} → Set<socket_id>
socket:user:{user_id} → socket_id
```

**Инвалидация кеша:**
- При создании/обновлении урока → удалить `lessons:*`
- При создании домашки → удалить `homework:*` для группы
- При проверке работы → удалить `stats:group:{group_id}`

---

## БИЗНЕС-ЛОГИКА И ПРОЦЕССЫ

### 1. Создание урока (Admin)

**Backend процесс:**
```
POST /api/lessons
├─ Валидация: title, date, time, course_id, group_ids
├─ Проверка: user.role === 'admin'
├─ Получение zoom_link из course (если не указан)
├─ Transaction:
│  ├─ INSERT INTO lessons (...)
│  ├─ INSERT INTO lesson_groups для каждой group_id
│  └─ Если есть материалы → INSERT INTO materials
├─ Инвалидация кеша: DELETE lessons:*
├─ WebSocket broadcast: emit('lesson:created') всем студентам групп
├─ Background job: создать уведомления для всех студентов
└─ Response: созданный урок
```

**Уведомления:**
- Получить всех студентов из lesson_groups → group_students
- Для каждого: INSERT INTO notifications
- Отправить через Telegram Bot: "Новый урок: {title} - {date} {time}"

### 2. Домашка: полный цикл

**A. Создание (Curator):**
```
POST /api/homework
├─ Валидация: title, description, deadline, group_id, task_file
├─ Проверка: user.role === 'curator'
├─ Проверка: curator назначен на эту группу
├─ Загрузка файла задания:
│  ├─ Генерация presigned URL для S3
│  ├─ Frontend загружает в S3
│  └─ Backend получает file_url
├─ INSERT INTO homework (curator_id = current_user.id)
├─ Создание пустых submissions для всех студентов группы:
│  └─ INSERT INTO submissions (student_id, homework_id, status='not_submitted')
├─ Инвалидация: DELETE homework:*
├─ Уведомления: всем студентам группы
└─ Response: созданная домашка
```

**B. Сдача работы (Student):**
```
POST /api/submissions/{homework_id}
├─ Проверка: deadline не прошел
├─ Проверка: student в группе этой домашки
├─ Загрузка файла решения в S3
├─ UPDATE submissions SET
│  ├─ solution_file_url = file_url
│  ├─ submitted_at = NOW()
│  └─ status = 'pending'
├─ Инвалидация кеша
├─ Уведомление куратору: "Новая работа от {student_name}"
└─ Response: updated submission
```

**C. Проверка (Curator):**
```
POST /api/submissions/{id}/grade
├─ Проверка: curator владеет этой домашкой
├─ Валидация: grade (0-100), comment
├─ Загрузка feedback_file (опционально)
├─ UPDATE submissions SET
│  ├─ grade = grade
│  ├─ comment = comment
│  ├─ feedback_file_url = file_url
│  ├─ status = 'reviewed'
│  ├─ reviewed_at = NOW()
│  └─ reviewed_by = current_user.id
├─ Пересчет статистики студента (async):
│  ├─ SELECT AVG(grade) FROM submissions WHERE student_id = ...
│  └─ UPDATE кеш stats:student:{id}
├─ Уведомление студенту: "Работа проверена: {grade}/100"
└─ Response: updated submission
```

### 3. Расчет прогресса студента

**Триггер:** каждый вечер в 23:00 (cron job)

```typescript
// Псевдокод
for each student:
  // Посещаемость
  attended = COUNT(attendance WHERE student_id = X AND attended = true)
  total_lessons = COUNT(DISTINCT lesson_id FROM lesson_groups 
                  WHERE group_id IN (student's groups))
  attendance_rate = (attended / total_lessons) * 100

  // Домашки
  completed = COUNT(submissions WHERE student_id = X AND status = 'reviewed')
  total_homework = COUNT(homework WHERE group_id IN (student's groups))
  homework_rate = (completed / total_homework) * 100

  // Средний балл
  avg_grade = AVG(grade FROM submissions WHERE student_id = X AND status = 'reviewed')

  // Сохранить в Redis
  SET stats:student:{id} JSON({ attendance, homework_rate, avg_grade })
```

### 4. Система уведомлений

**Типы уведомлений:**
- `lesson:created` - новый урок
- `lesson:reminder` - за 1 час до урока (cron)
- `homework:created` - новая домашка
- `homework:deadline` - за 24 часа до дедлайна (cron)
- `submission:reviewed` - работа проверена
- `submission:created` - новая сдача (для куратора)

**Процесс отправки:**
```
1. Событие → INSERT INTO notifications (database)
2. WebSocket emit → если пользователь онлайн
3. Telegram Bot API → sendMessage (async job через Bull queue)
```

**Telegram Bot реализация:**
```typescript
// Webhook от Telegram
POST /telegram/webhook
├─ Верификация signature
├─ Парсинг message/callback_query
├─ Команды:
│  ├─ /start → регистрация / приветствие
│  ├─ /schedule → расписание на неделю
│  ├─ /homework → список домашек
│  └─ /grades → последние оценки
└─ Inline keyboard: "Открыть приложение" → web_app_url
```

---

## ФАЙЛОВОЕ ХРАНИЛИЩЕ

### Архитектура работы с файлами

**Загрузка файла:**
```
1. Frontend: POST /api/files/upload
   Body: { filename, fileSize, contentType, category }

2. Backend:
   ├─ Валидация: размер < 50MB, тип разрешен
   ├─ Генерация уникального имени: {uuid}-{sanitized_filename}
   ├─ Путь: {role}/{userId}/{category}/{filename}
   ├─ Генерация presigned URL (PUT, expires 15 min)
   └─ Response: { uploadUrl, fileKey }

3. Frontend:
   ├─ PUT uploadUrl (прямо в S3)
   └─ После успеха → POST /api/files/confirm
       Body: { fileKey }

4. Backend:
   ├─ Проверка существования файла в S3
   ├─ Сохранение метаданных в БД
   └─ Response: { fileUrl }
```

**Скачивание файла:**
```
1. Frontend: GET /api/files/{fileId}/download

2. Backend:
   ├─ Проверка прав доступа:
   │  ├─ Student: только свои файлы + задания своих домашек
   │  ├─ Curator: файлы своих групп
   │  └─ Admin: все файлы
   ├─ Генерация presigned URL (GET, expires 1 hour)
   └─ Response: { downloadUrl }

3. Frontend: redirect/download по downloadUrl
```

**S3 Bucket структура:**
```
kruzhok-files/
├── homework/
│   └── tasks/             # Файлы заданий от кураторов
│       └── {homework_id}/
│           └── {uuid}-task.pdf
├── submissions/           # Решения студентов
│   └── {student_id}/
│       └── {submission_id}/
│           └── {uuid}-solution.pdf
├── feedback/              # Файлы с замечаниями от кураторов
│   └── {submission_id}/
│       └── {uuid}-feedback.pdf
└── materials/             # Конспекты и материалы к урокам
    └── {lesson_id}/
        └── {uuid}-material.pdf
```

**Lifecycle policy:**
- Удаленные файлы → переместить в glacier через 30 дней
- Задания прошлых домашек → сохранять 1 год
- Решения студентов → сохранять 2 года

---

## REAL-TIME ОБНОВЛЕНИЯ

### WebSocket архитектура

**Подключение:**
```typescript
// Frontend
const socket = io('wss://api.domain.com', {
  auth: { token: accessToken }
});

// Backend
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // Верификация JWT
  // socket.userId = decoded.userId
  next();
});

io.on('connection', (socket) => {
  // Присоединение к личной комнате
  socket.join(`user:${socket.userId}`);
  
  // Получение групп пользователя и присоединение к комнатам
  const groups = await getUserGroups(socket.userId);
  groups.forEach(g => socket.join(`group:${g.id}`));
});
```

**События:**
```typescript
// Новый урок для группы
io.to(`group:${groupId}`).emit('lesson:created', lesson);

// Проверена работа студента
io.to(`user:${studentId}`).emit('submission:reviewed', {
  homeworkId, grade, comment
});

// Новая сдача для куратора
io.to(`user:${curatorId}`).emit('submission:created', {
  studentName, homeworkTitle
});

// Обновление статистики
io.to(`group:${groupId}`).emit('stats:updated', stats);
```

---

## РОЛИ И ФУНКЦИОНАЛ

### 👨‍🎓 СТУДЕНТ (5 страниц)

**1. Главная**
- Приветствие с именем
- 2 ближайших занятия (название, дата, время, кнопка "Перейти в Zoom")
- Ближайший дедлайн домашки
- Быстрая статистика (посещено, сдано ДЗ, средний балл)
- Прогресс-бары по показателям

**2. Расписание**
- Все уроки с фильтром по курсам
- Для каждого урока: название, описание, дата, время, преподаватель
- Статусы: сегодня / предстоящий / завершенный
- Предстоящие: кнопка "Перейти в Zoom" (статичная ссылка курса)
- Завершенные: кнопка "Посмотреть запись" (ZenClass ссылка)
- Кнопка "Скачать конспект" (если админ загрузил)

**3. Домашки**
- Статистика: не сдано / на проверке / проверено
- Список всех домашек со статусами
- Не сдано: дедлайн, кнопка "Скачать задание", "Отправить решение"
- На проверке: дата сдачи, кнопка "Моё решение", "Изменить решение"
- Проверено: оценка (цветная), комментарий куратора, файл с замечаниями

**4. Прогресс**
- 3 карточки: сдано ДЗ (4/5), средний балл (88/100), посещаемость (92%)
- Прогресс-бары с описанием
- История всех оценок с датами

**5. Связь**
- Карточка куратора: имя, email, Telegram, кнопка "Написать в Telegram"
- Форма вопроса (будущий ИИ-помощник, пока заглушка)
- История обращений

---

### 👩‍🏫 КУРАТОР (3 страницы)

**1. Домашки (главная)**
- Кнопка "Создать домашку для группы"
- Список всех домашек куратора
- Для каждой: название, урок, дедлайн, прогресс сдачи (X/Y студентов)
- Прогресс-бар (зеленый >90%, синий >70%, оранжевый <70%)
- Кнопки: Редактировать, Удалить
- Разворачивающийся список студентов: кто сдал ✅ / кто не сдал ❌

**Создание домашки:**
- Выбор группы
- Название задания
- Описание
- Дедлайн (дата + время)
- Загрузка файла с заданием

**2. Сдачи**
- Статистика вверху: на проверке / проверено
- Фильтр: все / на проверке / проверено
- Карточки сдач: имя студента, домашка, дата сдачи, статус
- Кнопка "Скачать работу"
- Кнопка "Проверить" → форма:
  - Оценка (0-100) с живой цветовой индикацией
  - Комментарий
  - Загрузка файла с замечаниями (опционально)
- Проверенные: оценка, комментарий, кнопка "Изменить оценку"

**3. Отчёты**
- Выбор группы
- Общая статистика: всего студентов, средний балл, посещаемость, сдача ДЗ
- Показатели группы с прогресс-барами
- Топ-3 студента с показателями
- Список всех студентов: имя, средний балл, прогресс-бары

---

### 🛡️ АДМИНИСТРАТОР (1 страница, 4 вкладки)

**1. Кураторы**
- Список всех кураторов
- Кнопка "Создать куратора"
- Форма: ФИО, email, Telegram ID, пароль (только при создании)
- Действия: Редактировать, Сбросить пароль, Удалить
- При удалении: автоматически убирается из всех курсов и групп

**2. Расписание**
- Календарное представление / список уроков
- Фильтр по курсам и группам
- Кнопка "Создать урок"
- Форма урока:
  - Название
  - Описание
  - Курс (выбор из списка)
  - Дата и время
  - Преподаватель
  - Группы (множественный выбор)
  - Ссылка Zoom (статичная для курса, можно использовать одну)
  - Загрузка конспектов/материалов
  - Ссылка ZenClass на запись (добавляется после урока)
- Действия: Редактировать, Удалить урок

**3. Курсы**
- Список курсов: История России, МХК, Литература, Обществознание
- Для каждого: название, описание, статистика (уроков, групп)
- Назначение кураторов: чекбоксы (многие-ко-многим)
- Один курс → много кураторов ✅
- Список назначенных кураторов

**4. Группы**
- Список всех групп
- Для каждой: название, описание, количество студентов
- Назначение куратора: dropdown (один-к-одному)
- Одна группа → один куратор ✅
- Кнопка убрать куратора с группы

---

## РОЛИ ПОЛЬЗОВАТЕЛЕЙ

---

## ИНТЕГРАЦИИ

### Telegram Web App

**Инициализация:**
```javascript
import WebApp from '@twa-dev/sdk';

WebApp.ready();
WebApp.expand();
WebApp.enableClosingConfirmation();

// Получение данных пользователя
const initData = WebApp.initData;
const initDataUnsafe = WebApp.initDataUnsafe;
```

**Авторизация на backend:**
```typescript
// Backend валидация
function validateTelegramWebAppData(initData: string): boolean {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  params.delete('hash');
  
  const dataCheckString = Array.from(params.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
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
}
```

**Адаптация UI:**
```javascript
// Тема из Telegram
const themeParams = WebApp.themeParams;
document.documentElement.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);

// События
WebApp.onEvent('themeChanged', () => {
  // Обновить тему приложения
});

WebApp.onEvent('viewportChanged', ({ isStateStable }) => {
  // Клавиатура открылась/закрылась
});
```

### Telegram Bot

**Архитектура:**
```
Telegram Servers
      ↓ (webhook)
  /telegram/webhook (endpoint)
      ↓
  Telegram Service
      ↓
  ├─ Command Handler (/start, /schedule, etc.)
  ├─ Callback Query Handler (inline buttons)
  └─ Notification Sender (background jobs)
```

**Webhook setup:**
```typescript
// Установка webhook
await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://api.domain.com/telegram/webhook',
    allowed_updates: ['message', 'callback_query'],
    drop_pending_updates: true
  })
});
```

**Обработка команд:**
```typescript
app.post('/telegram/webhook', async (req, res) => {
  const update = req.body;
  
  if (update.message?.text) {
    const { chat, text } = update.message;
    
    switch (text) {
      case '/start':
        // Регистрация пользователя
        await registerUser(chat.id, chat);
        await sendMessage(chat.id, 'Добро пожаловать!', {
          reply_markup: {
            inline_keyboard: [[
              { text: 'Открыть приложение', web_app: { url: WEB_APP_URL } }
            ]]
          }
        });
        break;
        
      case '/schedule':
        const lessons = await getLessonsForUser(chat.id);
        await sendSchedule(chat.id, lessons);
        break;
    }
  }
  
  res.sendStatus(200);
});
```

**Отправка уведомлений (фоновая задача):**
```typescript
// Bull Queue
import Bull from 'bull';
const notificationQueue = new Bull('notifications', REDIS_URL);

// Producer (при создании события)
await notificationQueue.add({
  userId: '123',
  type: 'homework:created',
  data: { title, deadline }
});

// Consumer
notificationQueue.process(async (job) => {
  const { userId, type, data } = job.data;
  const user = await getUser(userId);
  
  if (user.telegram_id) {
    await sendTelegramMessage(user.telegram_id, {
      text: formatNotification(type, data),
      parse_mode: 'HTML'
    });
  }
});
```

### Zoom - статичные ссылки

**Логика:**
1. Админ создает постоянную meeting room в Zoom (вручную)
2. Получает постоянную ссылку (например: `https://zoom.us/j/1234567890`)
3. Сохраняет ссылку в настройках курса: `UPDATE courses SET zoom_link = '...'`
4. При создании урока:
   - Используется `course.zoom_link` по умолчанию
   - Можно переопределить индивидуальной ссылкой
5. На фронте:
   - Предстоящие уроки → кнопка "Перейти в Zoom"
   - Завершенные → кнопка скрыта

**Нет необходимости в:**
- Zoom API
- Автоматическое создание встреч
- OAuth авторизация
- Получение списка участников

### ZenClass - ссылки на записи

**Процесс:**
1. Урок прошел
2. Админ вручную получает ссылку на запись в ZenClass/YouTube/Vimeo
3. Редактирует урок: `PUT /api/lessons/{id}`
   ```json
   {
     "zenclass_link": "https://zenclass.ru/lesson/12345",
     "status": "completed"
   }
   ```
4. Backend обновляет БД
5. У студентов появляется кнопка "Посмотреть запись"

**UI логика:**
```typescript
// Frontend
{lesson.status === 'completed' && lesson.zenclass_link && (
  <Button onClick={() => window.open(lesson.zenclass_link)}>
    Посмотреть запись
  </Button>
)}

{lesson.status !== 'completed' && lesson.zoom_link && (
  <Button onClick={() => window.open(lesson.zoom_link)}>
    Перейти в Zoom
  </Button>
)}
```

---

## БЕЗОПАСНОСТЬ

### Защита от атак

**SQL Injection:**
- Использование Prisma ORM (параметризованные запросы)
- Никогда не конкатенируем SQL строки

**XSS:**
- Sanitization всех пользовательских данных
- Content-Security-Policy headers
- React автоматически экранирует HTML

**CSRF:**
- SameSite cookies для refresh токенов
- CSRF tokens для критичных операций

**Rate Limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Строгий лимит для авторизации
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 попыток
  skipSuccessfulRequests: true,
});

app.use('/api/auth/login', authLimiter);
```

**File Upload Security:**
```typescript
// Проверка MIME type
const allowedMimes = ['application/pdf', 'application/msword', ...];
if (!allowedMimes.includes(file.mimetype)) {
  throw new BadRequestException('Invalid file type');
}

// Проверка расширения
const ext = path.extname(file.originalname).toLowerCase();
const allowedExts = ['.pdf', '.doc', '.docx', '.zip'];
if (!allowedExts.includes(ext)) {
  throw new BadRequestException('Invalid file extension');
}

// Проверка размера
if (file.size > 50 * 1024 * 1024) { // 50MB
  throw new BadRequestException('File too large');
}

// Sanitize filename
const safeName = file.originalname
  .replace(/[^a-zA-Z0-9._-]/g, '')
  .substring(0, 255);
```

### Права доступа

**Middleware проверки:**
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.some(role => user.role === role);
  }
}

// Использование
@Get('admin-only')
@Roles('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
async adminEndpoint() {
  // ...
}
```

**Ownership check:**
```typescript
// Студент может видеть только свои данные
@Get('submissions/:id')
async getSubmission(@Param('id') id: string, @CurrentUser() user: User) {
  const submission = await this.submissionsService.findOne(id);
  
  if (user.role === 'student' && submission.student_id !== user.id) {
    throw new ForbiddenException();
  }
  
  if (user.role === 'curator') {
    const homework = await this.homeworkService.findOne(submission.homework_id);
    if (homework.curator_id !== user.id) {
      throw new ForbiddenException();
    }
  }
  
  return submission;
}
```

---

## API ENDPOINTS

### Auth
- POST /api/auth/telegram - авторизация через Telegram
- POST /api/auth/login - логин email/password
- POST /api/auth/refresh - обновление токена
- POST /api/auth/logout - выход

### Users
- GET /api/users/me - текущий пользователь
- GET /api/users - список пользователей (admin)
- POST /api/users - создать куратора (admin)
- PUT /api/users/:id - обновить пользователя
- DELETE /api/users/:id - удалить (admin)

### Courses
- GET /api/courses - все курсы
- GET /api/courses/:id - один курс
- PUT /api/courses/:id/curators - назначить кураторов (admin)

### Groups
- GET /api/groups - все группы
- GET /api/groups/:id - одна группа
- PUT /api/groups/:id/curator - назначить куратора (admin)

### Lessons
- GET /api/lessons - все уроки (по роли)
- POST /api/lessons - создать урок (admin)
- PUT /api/lessons/:id - обновить урок (admin)
- DELETE /api/lessons/:id - удалить урок (admin)

### Homework
- GET /api/homework - все домашки (по роли)
- POST /api/homework - создать (curator)
- PUT /api/homework/:id - обновить (curator)
- DELETE /api/homework/:id - удалить (curator)

### Submissions
- GET /api/submissions - все сдачи (по роли)
- POST /api/submissions - сдать работу (student)
- PUT /api/submissions/:id - изменить работу (student, до проверки)
- POST /api/submissions/:id/grade - оценить (curator)

### Progress
- GET /api/progress/me - мой прогресс (student)
- GET /api/progress/student/:id - прогресс студента (curator)
- GET /api/progress/group/:id - прогресс группы (curator)

### Files
- POST /api/files/upload - получить presigned URL
- GET /api/files/:id - скачать файл (временная ссылка)

### Notifications
- GET /api/notifications - мои уведомления
- PUT /api/notifications/:id/read - отметить прочитанным

---

## 🗄 БАЗА ДАННЫХ

### Структура таблиц

**users**
- id, name, email, password_hash, role, telegram_id, avatar, created_at

**courses**
- id, name, description, color, zoom_link, created_at

**groups**
- id, name, description, curator_id, created_at

**group_courses** (многие-ко-многим)
- group_id, course_id

**course_curators** (многие-ко-многим)
- course_id, curator_id

**group_students** (многие-ко-многим)
- group_id, student_id

**lessons**
- id, title, description, course_id, date, time, teacher, zoom_link, zenclass_link, status, created_at

**lesson_groups** (многие-ко-многим)
- lesson_id, group_id

**homework**
- id, title, description, lesson_id, group_id, curator_id, deadline, task_file_url, created_at

**submissions**
- id, homework_id, student_id, submitted_at, solution_file_url, status, grade, comment, feedback_file_url, reviewed_at

**attendance**
- id, lesson_id, student_id, attended, created_at

**materials**
- id, lesson_id, name, file_url, type, created_at

**notifications**
- id, user_id, type, title, body, read, created_at

### Индексы
- users: telegram_id, email
- lessons: date, course_id, status
- homework: deadline, group_id, curator_id
- submissions: status, student_id, homework_id
- attendance: lesson_id, student_id

---

## РАЗВЕРТЫВАНИЕ

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: kruzhok
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://admin:${DB_PASSWORD}@postgres:5432/kruzhok
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      S3_BUCKET: ${S3_BUCKET}
      S3_ACCESS_KEY: ${S3_ACCESS_KEY}
      S3_SECRET_KEY: ${S3_SECRET_KEY}
    depends_on:
      - postgres
      - redis
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    environment:
      VITE_API_URL: https://api.domain.com
    ports:
      - "80:80"

volumes:
  postgres_data:
  redis_data:
```

### Environment Variables

**Backend (.env):**
```
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://user:pass@host:6379

# JWT
JWT_SECRET=your-secret-key-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF
WEB_APP_URL=https://t.me/your_bot/app

# S3
S3_ENDPOINT=https://s3.amazonaws.com
S3_BUCKET=kruzhok-files
S3_REGION=us-east-1
S3_ACCESS_KEY=AKIAIOSFODNN7EXAMPLE
S3_SECRET_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# CORS
CORS_ORIGIN=https://app.domain.com
```

**Frontend (.env.production):**
```
VITE_API_URL=https://api.domain.com
VITE_WS_URL=wss://api.domain.com
VITE_BOT_USERNAME=your_bot
```

### Миграции БД

```bash
# Создание миграции
npx prisma migrate dev --name init

# Применение миграций в production
npx prisma migrate deploy

# Генерация Prisma Client
npx prisma generate
```

### Мониторинг и логи

**Prometheus metrics:**
```typescript
import promClient from 'prom-client';

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.route?.path, res.statusCode).observe(duration);
  });
  next();
});
```

---

## ТЕКУЩИЙ СТАТУС И NEXT STEPS

### Готово ✅
- Frontend полностью реализован
- Все UI компоненты
- Роутинг для 3 ролей
- Mock данные
- Дизайн-система
- Адаптивность

### Требуется реализовать
1. **Backend API** - все endpoints по спецификации
2. **База данных** - PostgreSQL схема и миграции
3. **Аутентификация** - Telegram + JWT
4. **Файловое хранилище** - S3 интеграция
5. **Telegram Bot** - webhook и команды
6. **WebSocket** - real-time обновления
7. **Notifications** - система уведомлений
8. **Tests** - unit + integration тесты
9. **Deployment** - Docker + CI/CD
10. **Monitoring** - логи и метрики

---

**Версия:** 2.1  
**Обновлено:** 9 октября 2025

