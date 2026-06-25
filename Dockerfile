# 1. Aşama: Uygulamanın derlenmesi (Build Stage)
FROM node:18-alpine AS builder
WORKDIR /app

# Bağımlılıkların yüklenmesi
COPY package*.json ./
RUN npm ci

# Kaynak kodun kopyalanması ve build-time API URL parametresinin enjekte edilmesi
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

COPY . .
RUN npm run build

# 2. Aşama: Statik dosyaların Nginx ile sunulması (Production Stage)
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html

# SPA yönlendirmeleri için Nginx konfigürasyonunun kopyalanması
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
