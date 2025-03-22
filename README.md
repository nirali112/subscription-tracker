# 🧾 BillBuddy – Subscription Tracker

**BillBuddy** is a simple, responsive, and user-friendly web application that helps users track their recurring subscription services. Built with Angular and Firebase, it allows users to manage, visualize, and stay aware of their monthly and yearly subscription expenses.

---

## 📌 Features

- 🔐 **Authentication**
  - Sign up, log in, and secure user session management via Firebase Authentication.
  
- 📊 **Visual Dashboard**
  - Track total spending with interactive charts.
  - Spending categorized by service and subscription type (monthly/yearly).
  
- ➕ **Add & Edit Subscriptions**
  - Input service name, amount, and purchase date.
  - Automatically calculates next payment and renewal date.
  
- 🗑 **Delete Subscriptions**
  - Easily manage unwanted or expired subscriptions.

- 📈 **Spending Trends**
  - Pie, bar, and line charts show insights on where money is going.

- 👤 **Profile Management**
  - Update your name and other details.
  - Secure password change support.

---

## 📁 Project Structure

```
subscription-tracker/
│
├── src/
│   ├── app/
│   │   ├── dashboard/               # Dashboard component and UI
│   │   ├── login/                   # Login component
│   │   ├── signup/                  # Signup component
│   │   ├── profile/                 # User profile component
│   │   ├── header/                  # Shared header with navigation
│   │   ├── spending-trends/         # Charts and data visualization
│   │   ├── auth.service.ts          # Auth logic (Firebase)
│   │   ├── app.routes.ts            # App routing configuration
│   │   ├── app.config.ts            # App-level configurations
│   │   └── models/                  # Interfaces and type definitions
│   ├── environments/                # Environment config files
│   ├── main.ts                      # App bootstrap file
│   └── styles.scss                  # Global styles
│
├── README.md
├── angular.json
├── package.json
└── tsconfig*.json
```

---

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js & npm
- Angular CLI (`npm install -g @angular/cli`)
- Firebase Project (for auth + Firestore)

### 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/subscription-tracker.git

# Install dependencies
cd subscription-tracker
npm install
```

### 🔑 Set Up Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
2. Enable:
   - **Authentication > Email/Password**
   - **Firestore Database**
3. Replace your Firebase config in `src/environments/environment.ts`:

```ts
export const environment = {
  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
  }
};
```

### ▶️ Run Locally

```bash
ng serve
```

Then visit: `http://localhost:4200/`

---

## 🧠 Future Enhancements (Recommendations)

> These features are planned or could be added for a more powerful experience:

- 💡 **Smart Subscription Reminders**  
  Notify users of upcoming payments or trials ending soon.

- 🤖 **AI-Based Categorization & Price Optimization**  
  Use AI to auto-categorize subscriptions and recommend cheaper alternatives.

- 📬 **Email Notifications**  
  Periodic reports or alerts via email about spending.

- 📱 **PWA or Mobile App Support**

---

## 📃 License

You can choose to add a license like MIT if you plan to open-source this.
