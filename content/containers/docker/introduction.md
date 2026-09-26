---
title: مقدمة إلى دوكر
description: فهم الحاويات والصور (Images) ودورة العمل الأساسية مع Docker.
category: containers
order: 1
level: beginner
tags: [docker, containers]
language: ar
---

## الحاويات ببساطة

دوكر (Docker) يجعل تشغيل التطبيقات في بيئة معزولة (Isolated) أمراً سهلاً. الفرق
الجوهري بين **Image** و **Container**:

- **Image**: قالب للقراءة فقط يحتوي على التطبيق والاعتماديات.
- **Container**: نسخة تعمل فعلياً من ذلك القالب.

## الأوامر الأساسية

```bash
docker build -t my-app:1.0 .
docker run -d -p 8080:80 --name my-app my-app:1.0
docker logs -f my-app
```

## ملف Dockerfile

```dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

> ملاحظة: صور base الصغيرة (alpine) تقلل حجم النشر، لكن قد تحتاج إلى حزم إضافية.
