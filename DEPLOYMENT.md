# Руководство по развёртыванию

## 🚀 Развёртывание на различных платформах

### Vercel (рекомендуется)

1. Установите Vercel CLI:
```bash
npm i -g vercel
```

2. Войдите в аккаунт:
```bash
vercel login
```

3. Деплой:
```bash
vercel
```

4. Production деплой:
```bash
vercel --prod
```

**Плюсы:**
- Бесплатный tier
- Автоматический HTTPS
- Быстрый CDN
- Preview deployments
- Zero-config

### Netlify

1. Установите Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Войдите:
```bash
netlify login
```

3. Инициализация:
```bash
netlify init
```

4. Деплой:
```bash
netlify deploy --prod
```

**Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

### GitHub Pages

1. Установите gh-pages:
```bash
npm i -D gh-pages
```

2. Добавьте в `package.json`:
```json
{
  "homepage": "https://yourusername.github.io/kruzhok-app",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Обновите `vite.config.ts`:
```ts
export default defineConfig({
  base: '/kruzhok-app/',
  // ... остальная конфигурация
})
```

4. Деплой:
```bash
npm run deploy
```

### Railway

1. Установите Railway CLI:
```bash
npm i -g @railway/cli
```

2. Войдите:
```bash
railway login
```

3. Инициализация:
```bash
railway init
```

4. Деплой:
```bash
railway up
```

## 🔧 Конфигурация для production

### Environment Variables

Создайте `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
VITE_TELEGRAM_BOT_TOKEN=your_production_token
```

### Оптимизация сборки

В `vite.config.ts`:
```ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

## 🐳 Docker

Создайте `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Создайте `nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Соберите и запустите:
```bash
docker build -t kruzhok-app .
docker run -p 80:80 kruzhok-app
```

## 📱 Telegram Mini App

### Регистрация приложения

1. Создайте бота через [@BotFather](https://t.me/BotFather)

2. Получите Web App URL:
```
/newapp
```

3. Настройте:
   - Short name: `kruzhok`
   - Title: `Кружок`
   - Description: `Всё, что нужно студенту и куратору`
   - Photo: загрузите иконку
   - Web App URL: ваш production URL

### Конфигурация

В `src/main.tsx` добавьте:
```tsx
import WebApp from '@twa-dev/sdk';

// Инициализация Telegram Mini App
WebApp.ready();
WebApp.expand();

// Настройка цветов
WebApp.setHeaderColor('#007AFF');
WebApp.setBackgroundColor('#F2F2F7');
```

## 🔒 Безопасность

### Headers

Добавьте в `vercel.json` или `netlify.toml`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### HTTPS

Всегда используйте HTTPS для production. Все платформы предоставляют бесплатные SSL сертификаты.

## 📊 Мониторинг

### Sentry (рекомендуется)

1. Установите:
```bash
npm i @sentry/react
```

2. Инициализируйте в `main.tsx`:
```tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: import.meta.env.MODE,
});
```

### Google Analytics

1. Добавьте в `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

## ✅ Чеклист перед деплоем

- [ ] Все environment variables настроены
- [ ] Build проходит без ошибок
- [ ] Тесты пройдены
- [ ] Lighthouse score > 90
- [ ] Проверена работа на мобильных
- [ ] Оптимизированы изображения
- [ ] Настроен CSP
- [ ] Добавлен favicon
- [ ] Настроен robots.txt
- [ ] Добавлен sitemap.xml
- [ ] Проверена accessibility
- [ ] Настроен error tracking

## 🔄 CI/CD

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:
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
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v2
        with:
          artifact_name: dist
```

## 📝 Заметки

- Всегда тестируйте на production перед релизом
- Используйте semantic versioning
- Сохраняйте changelog
- Делайте backup базы данных
- Мониторьте производительность

---

**Рекомендуемая платформа:** Vercel для фронтенда + Railway/Render для backend

