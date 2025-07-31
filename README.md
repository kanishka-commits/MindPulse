# 🧠 Mindpulse – React Quiz App with Firebase Authentication

**Mindpulse** is a fully functional quiz application built using **React** and **Firebase**, supporting login via **Email OTP**, **Google**, **GitHub**, and **Guest Mode**. It fetches live trivia questions from the [OpenTDB API](https://opentdb.com/) and provides an engaging quiz experience with score reports and user history.

---

## 🚀 Features

- 🔐 **Login Options**:
  - Google Login
  - GitHub Login
  - Email OTP-based Login
  - Guest Mode (no login required)
- 📡 **Live Questions** from OpenTDB API
- 🎯 **Answer Tracking** with randomized choices
- 📊 **Score Report** with total score and response summary
- 🔒 **Protected Routes** for quiz and report
- 💾 **State Persistence** using `localStorage` and React Context API
- 🌐 **Responsive Design** across devices

---

## 📂 Folder Structure

src/
├── components/
│ ├── ConfirmLeaveModal.jsx
│ ├── Navbar.jsx
│ └── ProtectedRoute.jsx
├── pages/
│ ├── StartPage.jsx
│ ├── QuizPage.jsx
│ └── ReportPage.jsx
├── context/
│ └── QuizContext.jsx
├── firebaseConfig.js
├── App.jsx
└── index.js


---

## 🛠️ Setup & Installation

### 🔗 Prerequisites

- Node.js and npm installed
- Firebase project created
- Email link, Google, and GitHub sign-in methods enabled in Firebase

### 📦 Install Dependencies


### 🔧 Firebase Setup

Replace the content of `firebaseConfig.js` with:

const firebaseConfig = {
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
appId: "YOUR_APP_ID"
};

- Enable Email/Password, Google, and GitHub in Firebase Auth
- Add `http://localhost:3000` as an authorized redirect URI

### ▶️ How to Run

Visit: `http://localhost:3000`

---

## ✅ Assumptions

- Email OTP login uses Firebase Email Link authentication
- Each quiz includes 15 questions from the OpenTDB API
- State is persisted across page reloads via `localStorage`

---

## 🧩 Challenges & Solutions

### 🔐 Handling Email OTP Login

Used `isSignInWithEmailLink()` to validate the email link. Retrieved email from `localStorage` to complete login flow.

### 🔒 Route Protection

Created a reusable `ProtectedRoute` component using auth state from `QuizContext`.

### 💾 State Management

Combined React Context API with `localStorage` to persist quiz data and user state across page reloads.

---

## 🙌 Acknowledgements

- Firebase  
- OpenTDB API  
- React Router  
- React Context API

---

## 🔗 Author

Made with 💙 by **Kanishka Panwar**


