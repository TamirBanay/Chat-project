FROM node:18

WORKDIR /usr/src/app

COPY codes/backend/package*.json ./backend/
RUN cd backend && npm install

COPY codes/frontend/chat-app/package*.json ./frontend/
RUN cd frontend && npm install

COPY codes/backend ./backend
COPY codes/frontend/chat-app ./frontend

RUN cd frontend && npm run build

WORKDIR /usr/src/app/backend

RUN node --version  # בדיקת גרסת Node.js בפועל

EXPOSE 4000

CMD ["node", "index.js"]
