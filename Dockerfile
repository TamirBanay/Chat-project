# שלב 1: השתמש בתמונה הרשמית של Node.js
FROM node:18

# שלב 2: הגדרת תיקיית העבודה בתוך הקונטיינר
WORKDIR /usr/src/app

# שלב 3: העתקת package.json ו-package-lock.json לתיקיית העבודה
COPY codes/backend/package*.json ./

# שלב 4: התקנת התלויות
RUN npm install

# שלב 5: העתקת כל שאר קבצי הפרויקט לתוך תיקיית העבודה
COPY codes/backend .

# שלב 6: חשיפת הפורט שבו האפליקציה תאזין
EXPOSE 4000

# שלב 7: הגדרת משתני סביבה
ENV MONGODB_URI="mongodb+srv://banay9329:RhNH2nLQnVsJLNyn@cluster0.xo32mds.mongodb.net/chat-me?retryWrites=true&w=majority"

# שלב 7: הגדרת הפקודה שתופעל בעת הרצת הקונטיינר
CMD ["node", "index.js"]
