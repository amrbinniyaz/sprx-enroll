# Build frontend
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Final stage: nginx + Python backend
FROM nginx:alpine

# Install Python and supervisor
RUN apk add --no-cache python3 py3-pip supervisor

# Set up backend
WORKDIR /app/backend
COPY backend/requirements.txt .
RUN pip3 install --no-cache-dir --break-system-packages -r requirements.txt
COPY backend/ .

# Copy built frontend
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy supervisord config
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
