# Interview Guru - AI-Powered Mock Interviews

Interview Guru is an AI-powered mock interview simulator. It generates custom interview questions based on job description, position, years of experience, and difficulty level, and scores your answers with constructive feedback using the Google Gemini model.

---

## Project Structure

The project has been separated into two independent folders to isolate the client-side user interface from database connections and LLM orchestrations:

- **`/frontend`**: Next.js React client application.
- **`/backend`**: Python FastAPI backend server.

---

## Getting Started

### 1. Backend Server Setup (FastAPI)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file inside `/backend` with the following variables:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   PORT=8000
   ```
5. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Client Setup (Next.js)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Create a `.env.local` file inside `/frontend` with your Clerk credentials:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```
4. Run the frontend server:
   ```bash
   npm run dev -- -p 3001
   ```

---

## License

Licensed under the MIT License. See [LICENSE](LICENSE) for more details.
