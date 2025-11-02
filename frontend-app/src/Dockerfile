# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

# ตั้ง working directory
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Stage 2: Serve ----------
FROM nginx:alpine

# คัดลอกไฟล์ build ที่ได้จาก Vite ไปยัง Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (optional) ปรับแต่ง nginx config ถ้าต้องการ SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
