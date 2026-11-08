# Smart Campus – College Event Management & Job Application Portal

> **A full-stack modern web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js), Tailwind CSS, Chart.js, and an AI-Powered Database-Grounded College Chatbot.**
> Replaces traditional Google Forms-based event registration and provides a centralized platform for discovering campus events, downloading verified QR code tickets, exploring job/internship vacancies, tracking applications, and broadcasting notices.

---

## 🌟 Key Features & Modules

### Module 1: Student Authentication & Profile Management
- Secure JWT-based authentication with bcrypt password hashing.
- Password recovery and reset tokens.
- **Dual Student Affiliation Support:**
  - **Internal Students:** Studying at the host institution.
  - **External Students:** Studying at other colleges/universities.
- Student profile creation: photo upload, college name, department, academic year (1st to 4th year / PG), CGPA, roll number, technical skills, portfolio links (LinkedIn, GitHub).
- Resume upload in **PDF format (max 5MB)** with validation.

### Module 2: College Event Management
- Complete event catalog with categories: `Technical`, `Workshops`, `Cultural`, `Seminars`, `Sports`, `Fests`.
- Event poster banner, date, time, venue, registration closing countdown, fee structure (Free vs Paid).
- Dynamic seat capacity tracking (e.g. *84 / 120 Registered* with colored visual progress bar).
- Automatic registration closure when deadline passes or maximum seat limit is reached.
- Prevention of duplicate registrations per student.
- Search by keywords/title, filter by category and eligibility (`All Colleges`, `Internal Only`, `External Only`).

### Module 3: Event Registration & QR Code Entry Pass
- Replaces legacy Google Forms with instant digital registration.
- **Unique Registration ID generation** (e.g., `SC-REG-2026-A19F`).
- **High-Resolution QR Code Generation** containing encrypted verification payload.
- Printable/downloadable official ticket pass with venue gate check-in instructions.
- Cancellation mechanism that auto-releases capacity for waiting students.
- **Admin QR Gate Scanner tool**: Scans QR code or enters Registration ID to verify validity and mark real-time attendance.
- **Export to CSV**: Administrators can export full event participant lists in one click.

### Module 4: Campus Job Application Portal
- **Company/Recruiter Features:**
  - Recruiter registration & profile (Google, Microsoft, Infosys demo accounts included).
  - Post new job vacancies and summer internships (job title, package/stipend, location, requirements, qualifications, batch eligibility, deadline).
  - Manage listings and review candidates.
  - View applicant resumes in PDF format, assess CGPA, and update hiring pipeline:
    `Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Selected` / `Rejected`.
  - Adding feedback automatically notifies the student!
- **Student Features:**
  - Search jobs by company, role, or technical skills (React, Python, AWS, etc.).
  - 1-click apply with saved profile PDF resume or new upload.
  - Live pipeline status tracker under **"My Applications"**.

### Module 5: AI-Powered Database-Grounded College Chatbot
- Acts as a 24/7 intelligent virtual campus assistant.
- Grounded strictly in live database records to prevent hallucination:
  - *"What events are happening in our college?"*
  - *"What is the next upcoming event?"*
  - *"How can I register for an event?"*
  - *"What is the registration deadline and fee?"*
  - *"Where is the event conducted?"*
  - *"Which companies are providing job opportunities?"*
  - *"What are the available job vacancies?"*
  - *"Can external students participate?"*
- Natural language intent parsing, quick-reply chip suggestions, and direct links to events/jobs.
- Graceful fallbacks for unknown queries.
- Admin knowledge base editor for adding custom campus FAQs and monitoring query frequency.

### Module 6: Notification & Announcement System
- Role-targeted broadcasts and personal notifications:
  - Registration confirmations
  - Event date/venue update alerts
  - Recruiter status updates (e.g. *Shortlisted for Google Interview*)
  - Urgent campus circulars & placement notices
- In-app notification bell with real-time unread badges, mark-as-read, and dismiss controls.

### Module 7: Administrator Command Center
- **System Metrics & Analytics:**
  - Total students (Internal Host vs External Other Colleges breakdown)
  - Total events & upcoming active events
  - Total event registrations
  - Total active job openings & submitted applications
  - Total corporate recruiter partners
- **Interactive Chart.js Visualizations:**
  - Event category breakdown (Doughnut chart)
  - Job application hiring funnel (Bar chart)
  - Departmental representation (Bar chart)
- Full CRUD for events, circulars, corporate partners, student directory, and chatbot knowledge base.

### Module 8: Digital Marketing & Social Integration
- One-click social sharing: WhatsApp, Twitter / X, LinkedIn.
- Copyable direct registration URLs.
- SEO-friendly Open Graph meta tags.
- Live view count tracking per event.

---

## 🏗️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js 18, Vite 6, Tailwind CSS 3, Lucide React Icons, React Router 7, Chart.js 4, React-Chartjs-2, QRCode.react, Canvas-Confetti, Axios |
| **Backend** | Node.js, Express.js, REST API Architecture, JWT, Bcrypt.js, Multer, QRCode, Morgan, Helmet, Express-Rate-Limit |
| **Database** | MongoDB / Mongoose (Supports both native MongoDB Community Server & embedded persistent storage) |

---

## 📂 Project Directory Structure

```
smart-campus/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database connection (supports native Mongo & persistent local fallback)
│   │   ├── controllers/              # 10 Express controllers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── eventController.js
│   │   │   ├── registrationController.js
│   │   │   ├── jobController.js
│   │   │   ├── applicationController.js
│   │   │   ├── chatbotController.js
│   │   │   ├── notificationController.js
│   │   │   ├── announcementController.js
│   │   │   └── adminController.js
│   │   ├── middleware/               # Auth, Multer PDF/image filter, Error handler
│   │   │   ├── authMiddleware.js
│   │   │   ├── uploadMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   ├── models/                   # 10 Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── StudentProfile.js
│   │   │   ├── CompanyProfile.js
│   │   │   ├── Event.js
│   │   │   ├── EventRegistration.js
│   │   │   ├── Job.js
│   │   │   ├── JobApplication.js
│   │   │   ├── Notification.js
│   │   │   ├── Announcement.js
│   │   │   └── ChatbotFAQ.js
│   │   ├── routes/                   # REST API routes
│   │   ├── services/                 # Chatbot natural search, QR generation
│   │   ├── utils/
│   │   │   ├── seedData.js           # Comprehensive realistic demo dataset
│   │   │   └── testApi.js            # Automated integration test suite
│   │   └── server.js                 # Express server entry point
│   ├── uploads/                      # Profiles, posters, PDF resumes
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Navbar, Footer, Sidebar, EventCard, JobCard, Ticket, Chatbot
│   │   ├── context/                  # AuthContext, NotificationContext
│   │   ├── pages/
│   │   │   ├── auth/                 # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── student/              # StudentDashboard, Profile, MyRegistrations, MyApplications
│   │   │   ├── events/               # EventsList, EventDetails, EventRegister
│   │   │   ├── jobs/                 # JobsList, JobDetails, JobApply
│   │   │   ├── company/              # CompanyDashboard, PostJob, ManageJobs, JobApplicants, CompanyProfile
│   │   │   ├── admin/                # AdminDashboard, ManageEvents, ManageStudents, ManageCompanies, Reports
│   │   │   ├── AnnouncementsPage.jsx
│   │   │   ├── NotificationsPage.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/                 # Axios API client
│   │   ├── App.jsx                   # Route configuration
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── run_backend.bat                   # 1-Click Windows Backend Launcher
├── run_frontend.bat                  # 1-Click Windows Frontend Launcher
├── seed_database.bat                 # 1-Click Database Seeder
└── README.md
```

---

## 🔑 Demo Login Credentials

The application comes pre-loaded with realistic sample data across all roles. You can also use the **"One-Click Demo Credentials"** buttons on the login page:

| Role | Email Address | Password | Profile Description |
|---|---|---|---|
| **Administrator** | `admin@smartcampus.edu` | `Admin@123` | Dr. Anand Ramanathan (Dean of Events & Placement) |
| **Internal Student** | `rahul.sharma@smartcampus.edu` | `Student@123` | Rahul Sharma (3rd Year CSE, Host Campus, CGPA 8.85) |
| **External Student** | `priya.verma@external.edu` | `Student@123` | Priya Verma (4th Year ISE, St. Xavier's Institute of Tech) |
| **Recruiter (Google)** | `recruiter@google.com` | `Company@123` | Sarah Jenkins (Google Cloud & AI University Talent) |
| **Recruiter (Microsoft)** | `careers@microsoft.com` | `Company@123` | Aditya Mathur (Microsoft University Relations) |

---

## 🚀 Installation & Local Execution

### Prerequisites
- **Node.js** (v18 or higher recommended, LTS installed)
- **npm** (comes with Node.js)

### Step 1: Start the Backend Server
Open a terminal in the project directory:
```bash
cd backend
npm run dev
# OR double click `run_backend.bat`
```
*The server will start at `http://localhost:5000` and automatically connect to MongoDB (or local zero-config persistent storage) and auto-seed initial data if empty.*

### Step 2: Start the React Frontend
Open a separate terminal:
```bash
cd frontend
npm run dev
# OR double click `run_frontend.bat`
```
*Vite will launch the modern UI at `http://localhost:5173`.*

---

## 🧪 Testing the Application

### Automated API Integration Tests
Run the comprehensive test script to verify all REST endpoints:
```bash
cd backend
node src/utils/testApi.js
```
*This validates: Health check, Student login, Admin login, Event listing, Job listings, AI-Grounded chatbot query response, and Admin dashboard statistics.*

### Manual Verification Checklist
1. **Student Registration & Affiliation:**
   - Go to `http://localhost:5173/register`.
   - Test creating an **Internal Student** (Host College) and an **External Student** (specify another college name).
2. **Event Registration:**
   - Browse `/events`, select an event like *National Smart Hackathon 2026*, and click **Register**.
   - Verify the generated **Ticket Pass** with unique `SC-REG-...` ID and scanned QR code.
   - Click **Print Ticket Pass** to verify the printable format.
3. **QR Pass Check-In (Admin):**
   - Log in as `admin@smartcampus.edu`.
   - Go to **Manage Events** ➔ Click **QR Gate Scanner**.
   - Enter or scan the student's Registration ID (e.g., `SC-REG-2026-A19F`) to verify attendance.
4. **Job Application & Hiring Pipeline:**
   - Log in as a student, browse `/jobs`, click **Apply for Position**, and submit a PDF resume.
   - Log in as recruiter `recruiter@google.com`, open **Candidate Review**, review the student's resume, and update their status to **Shortlisted** or **Selected**.
   - Switch back to the student account to verify the instant notification and status update in **My Applications**.
5. **AI Campus Chatbot:**
   - Click the floating **Campus AI Assistant** widget on the bottom-right.
   - Ask: *"What events are happening in our college?"* or tap any quick-reply chip.
   - Notice that the chatbot returns live database events and direct navigation links!

---

## 🛡️ Security Implementation
- **JWT Authentication:** Tokens signed with expiration and validated on every private route.
- **Role-Based Access Control (RBAC):** Strict middleware guards for `student`, `admin`, and `company` routes.
- **Password Protection:** Bcrypt salt hashing with minimum complexity requirements.
- **Secure File Uploads:** Multer with mime-type checking restricting resumes strictly to `.pdf` format (max 5MB) and event posters to valid images.
- **Double-Registration Prevention:** Database composite unique indexes preventing students from booking duplicate seats or multiple applications for the same opening.

---

## 📄 Final Year Project Defense Notes
- **Problem Statement:** Colleges struggle with disorganized Google Forms for fests, manual attendance verification, uncoordinated company job listings, and lack of support for inter-college visiting students.
- **Solution Delivered:** Smart Campus unifies all workflows into an enterprise-grade digital portal featuring verifiable QR ticketing, corporate candidate tracking, and grounded conversational AI.
