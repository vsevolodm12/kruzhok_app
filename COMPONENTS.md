# Компоненты приложения

## 📦 UI Компоненты

### Card
Универсальная карточка с поддержкой hover-эффектов.

**Props:**
- `children: ReactNode` - содержимое карточки
- `className?: string` - дополнительные CSS классы
- `onClick?: () => void` - обработчик клика
- `hover?: boolean` - включить hover-эффект

**Использование:**
```tsx
<Card hover onClick={() => console.log('clicked')}>
  <h3>Заголовок</h3>
  <p>Содержимое</p>
</Card>
```

### Button
Универсальная кнопка с различными вариантами.

**Props:**
- `variant?: 'primary' | 'secondary' | 'danger' | 'ghost'`
- `size?: 'small' | 'medium' | 'large'`
- `icon?: LucideIcon` - иконка
- `fullWidth?: boolean` - кнопка на всю ширину
- `loading?: boolean` - состояние загрузки

**Использование:**
```tsx
<Button variant="primary" icon={Plus} onClick={handleClick}>
  Добавить
</Button>
```

### ProgressCircle
Круговой индикатор прогресса в стиле Apple.

**Props:**
- `progress: number` - прогресс от 0 до 100
- `size?: number` - размер в пикселях (по умолчанию 120)
- `strokeWidth?: number` - толщина линии (по умолчанию 8)

**Использование:**
```tsx
<ProgressCircle progress={85} size={140} strokeWidth={10} />
```

### ProgressBar
Линейный индикатор прогресса.

**Props:**
- `progress: number` - прогресс от 0 до 100
- `label?: string` - подпись
- `showPercentage?: boolean` - показывать проценты
- `className?: string` - дополнительные CSS классы

**Использование:**
```tsx
<ProgressBar progress={75} label="Посещаемость" />
```

### StatusBadge
Цветной бейдж для отображения статуса.

**Props:**
- `status: 'not-submitted' | 'pending' | 'reviewed' | 'success' | 'warning' | 'error'`
- `label: string` - текст бейджа

**Использование:**
```tsx
<StatusBadge status="pending" label="На проверке" />
```

### LoadingSpinner
Индикатор загрузки.

**Props:**
- `size?: 'small' | 'medium' | 'large'`
- `fullscreen?: boolean` - на весь экран

**Использование:**
```tsx
<LoadingSpinner size="large" fullscreen />
```

### EmptyState
Компонент для отображения пустого состояния.

**Props:**
- `icon: LucideIcon` - иконка
- `title: string` - заголовок
- `description: string` - описание
- `action?: { label: string; onClick: () => void }` - действие

**Использование:**
```tsx
<EmptyState
  icon={BookOpen}
  title="Нет домашек"
  description="Куратор ещё не создал ни одной домашки"
  action={{ label: "Обновить", onClick: refresh }}
/>
```

## 📱 Layout компоненты

### Layout
Основной layout с header и navigation.

### Header
Шапка приложения с переключателем темы и роли.

### Navigation
Нижнее меню навигации с иконками.

## 🎨 Контексты

### ThemeContext
Управление темой приложения (светлая/тёмная).

**Использование:**
```tsx
const { theme, toggleTheme } = useTheme();
```

### RoleContext
Управление ролью пользователя (студент/куратор).

**Использование:**
```tsx
const { role, setRole } = useRole();
```

## 🛠 Утилиты

### helpers.ts
Вспомогательные функции:
- `formatDate(date)` - форматирование даты
- `formatTime(time)` - форматирование времени
- `getDaysUntil(date)` - количество дней до даты
- `getTimeUntil(date)` - время до даты в читаемом формате
- `getGradeColor(grade)` - цвет для оценки
- `downloadFile(url, filename)` - скачивание файла
- `uploadFile(file)` - загрузка файла
- `copyToClipboard(text)` - копирование в буфер

## 📊 Типы

Все TypeScript типы находятся в `src/types/index.ts`:
- `User` - пользователь
- `Lesson` - урок
- `Homework` - домашка
- `Submission` - сдача работы
- `Progress` - прогресс студента
- `Message` - сообщение
- `GroupStats` - статистика группы

## 🎭 Mock данные

Mock данные для демонстрации находятся в `src/data/mockData.ts`.

