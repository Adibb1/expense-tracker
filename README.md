# Expense Tracker

This is a web application that helps users track their expenses and manage their personal finances. Users can categorize expenses, set budgets, and visualize their spending habits through interactive charts and reports. The app is built with Next.js, Firebase, and NextUI.

## Live Demo

You can view the live demo of the application here: [Expense Tracker](https://expense-tracker-tau-vert.vercel.app/)

## Features

- User authentication with Firebase
- Add, edit, and delete expenses
- Categorize expenses for better tracking
- Set and manage budgets
- Visualize spending habits using charts
- Responsive design using NextUI

## Tech Stack

- **Frontend:** Next.js, React
- **Backend:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Deployment:** Vercel

### Prerequisites

- Node.js (version 14.x or later)
- npm (version 6.x or later)

### Installation

1. **Clone the repository**

- git clone https://github.com/your-username/expense-tracker.git

2. **Install dependencies**

- cd expense-tracker
- npm i

3. **Set up Firebase**

- Create a Firebase project in the Firebase Console.
- Create a Firestore database.
- Enable Firebase Authentication with Google Sign-In.
- Copy your Firebase configuration settings and replace them in the src/app/firebase.js file.

4. **Run the development server**

- npm run dev
- The app should now be running on http://localhost:3000.
