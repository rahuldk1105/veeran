# Veeran Youth League – Veeran Winter Cup Live System

This repository contains the full-stack application for managing and displaying live results for the Veeran Winter Cup, a 2-day youth football tournament.

The system is designed with a real-time public dashboard, a comprehensive admin panel for tournament management, and a dedicated interface for referees to control live matches.

## Features

- **Real-time Public Dashboard**: Spectators can view live match scores, timers, and event feeds without needing to log in.
- **Dynamic Standings**: Team standings are automatically calculated and updated as matches are completed.
- **Match History**: A complete history of all completed matches with final scores and event timelines.
- **Role-Based Access Control**:
    - **Admin**: Full control over all tournament data including teams, players, referees, and matches.
    - **Referee**: Can only access and manage their assigned matches.
- **Live Match Control Panel**: Referees can start/pause/resume match timers and record events (Goals, Cards, Fouls) in real-time.
- **Secure Authentication**: User accounts for Admins and Referees are managed via Supabase Auth.

## Technology Stack

- **Frontend**: Next.js (React) with TypeScript & Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: Supabase (Email + Password)
- **Real-time Engine**: WebSockets (`ws` library)
- **Deployment**: Configured for Render (`render.yaml`)

## Project Structure

```
/
├── client/         # Next.js frontend application
│   ├── src/
│   └── ...
├── server/         # Node.js + Express backend server
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── ...
└── render.yaml     # Deployment configuration for Render
```

## Local Setup & Installation

To run this project locally, you will need Node.js and a MongoDB instance (e.g., a free MongoDB Atlas cluster).

**1. Clone the repository:**
```bash
git clone <repository-url>
cd <repository-name>
```

**2. Set up Backend:**
```bash
cd server
npm install
```
   - Create a `.env` file in the `server` directory and populate it with your credentials:
     ```env
     # MongoDB
     MONGO_URI=your_mongodb_connection_string

     # Supabase
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_KEY=your_supabase_public_anon_key
     SUPABASE_SERVICE_KEY=your_supabase_service_role_key
     SUPABASE_JWT_SECRET=your_supabase_jwt_secret

     # Server
     PORT=5000
     ```

**3. Set up Frontend:**
```bash
cd client
npm install
```
   - Create a `.env.local` file in the `client` directory and populate it:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_public_anon_key
     NEXT_PUBLIC_API_URL=http://localhost:5000
     NEXT_PUBLIC_WS_URL=ws://localhost:5000
     ```

**4. Running the Application:**
   - **Start the backend server:** From the `server` directory, run:
     ```bash
     npm start
     ```
   - **Start the frontend application:** In a separate terminal, from the `client` directory, run:
     ```bash
     npm run dev
     ```
   - The application will be available at `http://localhost:3000`.

## User Roles & Access

1.  **Admin**: To create an admin, you need to manually create a user in your Supabase dashboard and set their `user_metadata` to have a `role` of `admin`.
    ```json
    { "role": "admin" }
    ```
2.  **Referee**: Referees cannot sign up. The Admin creates referee accounts from the "Manage Referees" page in the Admin Panel. This automatically creates a Supabase user with the `referee` role and provides a temporary password.

## Deployment

This project is pre-configured for deployment on [Render](https://render.com/). The `render.yaml` file in the root defines the two services required.

To deploy:
1.  Push the code to a GitHub repository.
2.  In the Render dashboard, create a new "Blueprint" and connect it to your repository.
3.  Render will automatically detect the `render.yaml` file.
4.  You will need to manually add the secret environment variables (like `MONGO_URI` and Supabase keys) to the backend service in the Render dashboard.

The services will build and deploy automatically.
