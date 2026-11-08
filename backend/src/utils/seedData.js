const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const { connectDB } = require('../config/db');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const CompanyProfile = require('../models/CompanyProfile');
const Event = require('../models/Event');
const EventRegistration = require('../models/EventRegistration');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const Announcement = require('../models/Announcement');
const Notification = require('../models/Notification');
const ChatbotFAQ = require('../models/ChatbotFAQ');
const { generateQRCodeDataUrl } = require('../services/qrService');

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      console.log('[Seed] Connecting to database...');
      await connectDB();
    }

    console.log('[Seed] Clearing existing collections...');
    await User.deleteMany();
    await StudentProfile.deleteMany();
    await CompanyProfile.deleteMany();
    await Event.deleteMany();
    await EventRegistration.deleteMany();
    await Job.deleteMany();
    await JobApplication.deleteMany();
    await Announcement.deleteMany();
    await Notification.deleteMany();
    await ChatbotFAQ.deleteMany();

    console.log('[Seed] Creating demo users...');

    // 1. Admin User
    const adminUser = await User.create({
      name: 'Dr. Anand Ramanathan',
      email: 'admin@smartcampus.edu',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 98765 00001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    // 2. Internal Student
    const internalStudent = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@smartcampus.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+91 98765 11111',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80'
    });

    const internalProfile = await StudentProfile.create({
      user: internalStudent._id,
      studentType: 'internal',
      collegeName: 'Smart Campus Engineering Institute',
      department: 'Computer Science and Engineering',
      course: 'B.Tech',
      academicYear: '3rd Year',
      rollNumber: 'CS23-1042',
      phone: '+91 98765 11111',
      cgpa: 8.85,
      bio: 'Enthusiastic full-stack developer with interest in distributed systems, AI integrations, and open-source contributions.',
      skills: ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Python', 'Docker'],
      linkedin: 'https://linkedin.com/in/rahulsharma-demo',
      github: 'https://github.com/rahulsharma-demo',
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      resumeOriginalName: 'Rahul_Sharma_Resume.pdf'
    });

    // 3. External Student
    const externalStudent = await User.create({
      name: 'Priya Verma',
      email: 'priya.verma@external.edu',
      password: 'Student@123',
      role: 'student',
      phone: '+91 98765 22222',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    });

    const externalProfile = await StudentProfile.create({
      user: externalStudent._id,
      studentType: 'external',
      collegeName: "St. Xavier's Institute of Technology",
      department: 'Information Science & Engineering',
      course: 'B.Tech',
      academicYear: '4th Year',
      rollNumber: 'IS22-048',
      phone: '+91 98765 22222',
      cgpa: 9.1,
      bio: 'Competitive programmer and cloud enthusiast. Passionate about participating in inter-college hackathons and tech fests.',
      skills: ['Java', 'C++', 'Data Structures', 'AWS', 'React', 'Machine Learning'],
      linkedin: 'https://linkedin.com/in/priyaverma-demo',
      github: 'https://github.com/priyaverma-demo',
      resumeUrl: '/uploads/resumes/sample-resume.pdf',
      resumeOriginalName: 'Priya_Verma_Resume.pdf'
    });

    // 4. Company 1 - Google
    const companyUserGoogle = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@google.com',
      password: 'Company@123',
      role: 'company',
      phone: '+91 80 6721 8000',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    });

    const companyGoogle = await CompanyProfile.create({
      user: companyUserGoogle._id,
      companyName: 'Google India',
      industry: 'Cloud & Artificial Intelligence',
      website: 'https://google.com/careers',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
      contactPerson: 'Sarah Jenkins (Head of University Talent Acquisition)',
      contactEmail: 'recruiter@google.com',
      contactPhone: '+91 80 6721 8000',
      location: 'Bengaluru / Hyderabad (Hybrid)',
      about: "Google's mission is to organize the world's information and make it universally accessible and useful. We are expanding our engineering cohorts across cloud, core search, and AI teams.",
      isApproved: true
    });

    // 5. Company 2 - Microsoft
    const companyUserMS = await User.create({
      name: 'Aditya Mathur',
      email: 'careers@microsoft.com',
      password: 'Company@123',
      role: 'company',
      phone: '+91 80 4000 8000',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    });

    const companyMS = await CompanyProfile.create({
      user: companyUserMS._id,
      companyName: 'Microsoft Corporation',
      industry: 'Enterprise Software & Cloud Platforms',
      website: 'https://careers.microsoft.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg',
      contactPerson: 'Aditya Mathur (University Relations Lead)',
      contactEmail: 'careers@microsoft.com',
      contactPhone: '+91 80 4000 8000',
      location: 'Bengaluru / Noida',
      about: 'Microsoft enables digital transformation for the era of an intelligent cloud and an intelligent edge. Our campus hiring brings tomorrow’s innovators into global development centers.',
      isApproved: true
    });

    // 6. Company 3 - Infosys
    const companyUserInfosys = await User.create({
      name: 'Rohan Deshmukh',
      email: 'talent@infosys.com',
      password: 'Company@123',
      role: 'company',
      phone: '+91 80 2852 0261',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    });

    const companyInfosys = await CompanyProfile.create({
      user: companyUserInfosys._id,
      companyName: 'Infosys Limited',
      industry: 'Information Technology Services',
      website: 'https://infosys.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg',
      contactPerson: 'Rohan Deshmukh (Campus Recruitment Manager)',
      contactEmail: 'talent@infosys.com',
      contactPhone: '+91 80 2852 0261',
      location: 'Pune / Bengaluru / Chennai',
      about: 'Infosys is a global leader in next-generation digital services and consulting. We enable clients in more than 56 countries to navigate their digital transformation.',
      isApproved: true
    });

    console.log('[Seed] Creating events across categories...');

    const futureDate = (daysAhead) => {
      const d = new Date();
      d.setDate(d.getDate() + daysAhead);
      return d;
    };

    const pastDate = (daysBehind) => {
      const d = new Date();
      d.setDate(d.getDate() - daysBehind);
      return d;
    };

    // Events
    const event1 = await Event.create({
      title: 'National Smart Hackathon 2026: AI & Sustainability',
      description: 'A flagship 36-hour non-stop hackathon bringing together students to solve real-world sustainability, healthcare, and educational challenges using Generative AI and IoT. Features mentorship from industry leaders, ₹1,50,000 in cash prizes, and incubation opportunities.',
      category: 'technical',
      posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
      date: futureDate(12),
      time: '09:00 AM',
      venue: 'Dr. APJ Abdul Kalam Tech Complex & Innovation Center',
      regStartDate: pastDate(5),
      regEndDate: futureDate(8),
      registrationFee: 0,
      maxParticipants: 120,
      currentParticipants: 84,
      eligibility: 'all',
      department: 'Computer Science and Engineering',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'CSE Department & ACM Student Chapter',
      contactEmail: 'hackathon@smartcampus.edu',
      contactPhone: '+91 98765 43210',
      tags: ['Hackathon', 'AI', 'Coding', 'Innovation', 'Prizes'],
      viewCount: 642,
      isFeatured: true
    });

    const event2 = await Event.create({
      title: 'Full-Stack Modern Web Development Bootcamp',
      description: 'Hands-on intensive masterclass on building and deploying production-grade MERN applications with Tailwind CSS, Docker containers, and CI/CD pipelines. Laptop required. Certificate awarded upon capstone completion.',
      category: 'workshops',
      posterUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      date: futureDate(6),
      time: '10:00 AM',
      venue: 'Computer Lab 3, Ground Floor, Academic Block B',
      regStartDate: pastDate(8),
      regEndDate: futureDate(4),
      registrationFee: 150,
      maxParticipants: 60,
      currentParticipants: 42,
      eligibility: 'all',
      department: 'Information Technology',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'IT Department Developer Club',
      contactEmail: 'workshop@smartcampus.edu',
      tags: ['React', 'Node.js', 'WebDev', 'HandsOn', 'Certification'],
      viewCount: 388,
      isFeatured: true
    });

    const event3 = await Event.create({
      title: 'Symphony 2026: Annual Inter-College Cultural Fest',
      description: 'The biggest cultural extravaganza in the region! Featuring celebrity musical concerts, classical dance competitions, street play showdowns, fashion pageants, and art exhibitions. Open to all colleges across the state.',
      category: 'cultural',
      posterUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
      date: futureDate(25),
      time: '04:00 PM',
      venue: 'Main Open Air Amphitheatre',
      regStartDate: pastDate(2),
      regEndDate: futureDate(20),
      registrationFee: 200,
      maxParticipants: 500,
      currentParticipants: 310,
      eligibility: 'all',
      department: 'Cultural Affairs Committee',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'Student Cultural Council',
      tags: ['Music', 'Dance', 'Fest', 'Celebrity', 'Cultural'],
      viewCount: 1250,
      isFeatured: true
    });

    const event4 = await Event.create({
      title: 'Industry 4.0: Cloud Architecture & Generative AI Seminar',
      description: 'An executive seminar delivered by Chief Architects from Google Cloud and Microsoft discussing the transition of tech careers toward agentic AI, enterprise cloud engineering, and multi-modal models.',
      category: 'seminars',
      posterUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
      date: futureDate(18),
      time: '11:00 AM',
      venue: 'Sir CV Raman Seminar Hall',
      regStartDate: pastDate(3),
      regEndDate: futureDate(15),
      registrationFee: 0,
      maxParticipants: 200,
      currentParticipants: 165,
      eligibility: 'all',
      department: 'Electronics & Communication',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'ECE Department & IEEE Student Branch',
      tags: ['Seminar', 'Cloud', 'AI', 'Career', 'Keynote'],
      viewCount: 420
    });

    const event5 = await Event.create({
      title: 'Inter-College T20 Cricket Championship 2026',
      description: 'Annual inter-collegiate cricket tournament featuring 16 top college teams. Professional umpiring, live commentary, floodlit evening finals, and sports trophies.',
      category: 'sports',
      posterUrl: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80',
      date: futureDate(30),
      time: '08:30 AM',
      venue: 'Campus Main Sports Ground',
      regStartDate: pastDate(1),
      regEndDate: futureDate(22),
      registrationFee: 500,
      maxParticipants: 16,
      currentParticipants: 12,
      eligibility: 'all',
      department: 'Department of Physical Education',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'Sports Board',
      tags: ['Cricket', 'Sports', 'Tournament', 'Trophy'],
      viewCount: 290
    });

    const event6 = await Event.create({
      title: 'TechnoVision 2026: Robotics & Drone Racing Fest',
      description: 'Battle bots, autonomous drone racing obstacle courses, and line follower robotics showcase. Cash prizes of ₹75,000 and direct sponsor interaction with robotics startups.',
      category: 'fests',
      posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      date: futureDate(40),
      time: '09:30 AM',
      venue: 'Mechanical & Robotics Center',
      regStartDate: pastDate(1),
      regEndDate: futureDate(35),
      registrationFee: 250,
      maxParticipants: 80,
      currentParticipants: 35,
      eligibility: 'all',
      department: 'Mechanical & Mechatronics',
      status: 'upcoming',
      organizer: adminUser._id,
      organizerName: 'Robotics Club',
      tags: ['Robotics', 'Drone', 'Racing', 'Hardware'],
      viewCount: 512
    });

    console.log('[Seed] Creating demo registrations with QR codes...');

    const qr1 = await generateQRCodeDataUrl({
      regId: 'SC-REG-2026-A19F',
      eventId: event1._id,
      eventTitle: event1.title,
      studentName: internalStudent.name,
      studentEmail: internalStudent.email,
      college: internalProfile.collegeName,
      date: event1.date,
      venue: event1.venue
    });

    await EventRegistration.create({
      registrationId: 'SC-REG-2026-A19F',
      event: event1._id,
      user: internalStudent._id,
      studentType: 'internal',
      studentName: internalStudent.name,
      studentEmail: internalStudent.email,
      studentPhone: internalStudent.phone,
      collegeName: internalProfile.collegeName,
      department: internalProfile.department,
      academicYear: internalProfile.academicYear,
      rollNumber: internalProfile.rollNumber,
      status: 'confirmed',
      qrCodeDataUrl: qr1
    });

    const qr2 = await generateQRCodeDataUrl({
      regId: 'SC-REG-2026-B82C',
      eventId: event1._id,
      eventTitle: event1.title,
      studentName: externalStudent.name,
      studentEmail: externalStudent.email,
      college: externalProfile.collegeName,
      date: event1.date,
      venue: event1.venue
    });

    await EventRegistration.create({
      registrationId: 'SC-REG-2026-B82C',
      event: event1._id,
      user: externalStudent._id,
      studentType: 'external',
      studentName: externalStudent.name,
      studentEmail: externalStudent.email,
      studentPhone: externalStudent.phone,
      collegeName: externalProfile.collegeName,
      department: externalProfile.department,
      academicYear: externalProfile.academicYear,
      rollNumber: externalProfile.rollNumber,
      status: 'confirmed',
      qrCodeDataUrl: qr2
    });

    console.log('[Seed] Creating campus job vacancies...');

    const job1 = await Job.create({
      title: 'Associate Software Engineer - Cloud & Backend',
      company: companyGoogle._id,
      companyUser: companyUserGoogle._id,
      companyName: 'Google India',
      companyLogo: companyGoogle.logo,
      description: 'Join Google’s Core Cloud infrastructure group. You will build highly scalable distributed storage and computing services powering millions of global developers. Work with Go, C++, Python, and Kubernetes in a collaborative team.',
      requirements: 'Strong understanding of data structures, algorithms, operating systems, and computer networks. Familiarity with cloud technologies or microservices architectures is a plus.',
      qualifications: 'B.Tech/B.E. in Computer Science, Information Technology, or related discipline with minimum 65% or 7.0 CGPA aggregate.',
      skillsRequired: ['Go', 'C++', 'Python', 'Kubernetes', 'Cloud Systems', 'Algorithms'],
      jobType: 'full-time',
      salaryOrStipend: '₹18,00,000 - ₹24,00,000 / year',
      location: 'Bengaluru (Hybrid)',
      eligibility: 'Graduating Batch 2025 or 2026, min 7.0 CGPA, no active backlogs',
      deadline: futureDate(15),
      status: 'active',
      applicantCount: 28
    });

    const job2 = await Job.create({
      title: 'Full Stack Engineer - Modern Web & Azure',
      company: companyMS._id,
      companyUser: companyUserMS._id,
      companyName: 'Microsoft Corporation',
      companyLogo: companyMS.logo,
      description: 'We are hiring innovative software engineers to develop cutting-edge developer platforms and Microsoft 365 AI-powered productivity suites. You will design, develop, test, and deploy resilient web apps using React, TypeScript, C#/.NET, and Azure services.',
      requirements: 'Solid foundation in JavaScript/TypeScript, React or modern component libraries, REST/GraphQL APIs, and relational databases. Passion for building accessible and responsive user interfaces.',
      qualifications: 'B.Tech / B.E. in CS / IT / ECE with minimum 70% or 7.5 CGPA.',
      skillsRequired: ['TypeScript', 'React.js', 'Node.js', 'C#', '.NET Core', 'Azure'],
      jobType: 'full-time',
      salaryOrStipend: '₹16,00,000 - ₹22,00,000 / year',
      location: 'Bengaluru / Hyderabad',
      eligibility: 'Graduating 2025/2026 Batch with strong CS fundamentals',
      deadline: futureDate(20),
      status: 'active',
      applicantCount: 34
    });

    const job3 = await Job.create({
      title: 'Systems Engineer & Cloud Analyst',
      company: companyInfosys._id,
      companyUser: companyUserInfosys._id,
      companyName: 'Infosys Limited',
      companyLogo: companyInfosys.logo,
      description: 'Exciting entry-level opportunity for aspiring software developers to join Infosys Digital Transformation projects. Includes 3 months of comprehensive paid training at the world-class Infosys Mysore Global Education Center.',
      requirements: 'Good problem-solving abilities, logical reasoning, and basic coding proficiency in Java, Python, or C#. Strong written and verbal communication skills.',
      qualifications: 'B.E. / B.Tech / M.C.A. in any engineering discipline with min 60% aggregate.',
      skillsRequired: ['Java', 'Python', 'SQL', 'Web Technologies', 'Problem Solving'],
      jobType: 'full-time',
      salaryOrStipend: '₹6,50,000 - ₹9,50,000 / year',
      location: 'Pune / Bengaluru / Chennai / Hyderabad',
      eligibility: 'All Engineering Graduates (2025/2026 Batch) with 60%+ throughout academics',
      deadline: futureDate(25),
      status: 'active',
      applicantCount: 52
    });

    const job4 = await Job.create({
      title: 'Summer 2026 Software Engineering Intern',
      company: companyGoogle._id,
      companyUser: companyUserGoogle._id,
      companyName: 'Google India',
      companyLogo: companyGoogle.logo,
      description: 'A 2-month summer internship providing real-world engineering experience on high-impact projects. Interns work directly alongside senior Google engineers and gain exposure to industry-standard codebases, peer reviews, and mentorship.',
      requirements: 'Currently enrolled in 2nd or 3rd year of undergraduate studies. Strong grasp of coding fundamentals.',
      qualifications: '2nd or 3rd Year B.Tech / B.E. student in CS, IT, or related field.',
      skillsRequired: ['Data Structures', 'Python or Java', 'Git', 'Problem Solving'],
      jobType: 'internship',
      salaryOrStipend: '₹80,000 / month (Stipend)',
      location: 'Bengaluru / Hyderabad',
      eligibility: 'Pre-final year students (2027 graduation) with minimum 7.5 CGPA',
      deadline: futureDate(10),
      status: 'active',
      applicantCount: 45
    });

    console.log('[Seed] Creating demo job applications...');

    await JobApplication.create({
      applicationId: 'SC-APP-2026-F14E',
      job: job1._id,
      companyUser: companyUserGoogle._id,
      student: internalStudent._id,
      fullName: internalStudent.name,
      email: internalStudent.email,
      phone: internalStudent.phone,
      collegeName: internalProfile.collegeName,
      department: internalProfile.department,
      academicYear: internalProfile.academicYear,
      cgpa: internalProfile.cgpa,
      resumeUrl: internalProfile.resumeUrl,
      coverLetter: 'I have hands-on experience building distributed systems and full-stack applications with Node.js and React. I am excited to contribute to Google Cloud.',
      status: 'Shortlisted',
      statusHistory: [
        { status: 'Applied', note: 'Application submitted', changedBy: 'Student', updatedAt: pastDate(3) },
        { status: 'Under Review', note: 'Resume reviewed by technical hiring team', changedBy: 'Recruiter', updatedAt: pastDate(2) },
        { status: 'Shortlisted', note: 'Shortlisted for Round 1 Technical Interview', changedBy: 'Recruiter', updatedAt: pastDate(1) }
      ]
    });

    await JobApplication.create({
      applicationId: 'SC-APP-2026-K92D',
      job: job2._id,
      companyUser: companyUserMS._id,
      student: externalStudent._id,
      fullName: externalStudent.name,
      email: externalStudent.email,
      phone: externalStudent.phone,
      collegeName: externalProfile.collegeName,
      department: externalProfile.department,
      academicYear: externalProfile.academicYear,
      cgpa: externalProfile.cgpa,
      resumeUrl: externalProfile.resumeUrl,
      coverLetter: 'Passionate about frontend performance and scalable web engineering.',
      status: 'Under Review',
      statusHistory: [
        { status: 'Applied', note: 'Application submitted', changedBy: 'Student', updatedAt: pastDate(2) },
        { status: 'Under Review', note: 'Profile under assessment by campus team', changedBy: 'Recruiter', updatedAt: pastDate(1) }
      ]
    });

    console.log('[Seed] Creating college announcements...');

    await Announcement.create({
      title: 'TCS & Infosys Campus Placement Drive 2026 Commences Next Month',
      content: 'All final year eligible students across CSE, IT, ECE, and Mechanical are hereby notified that the initial round of aptitude tests for TCS Ninja and Infosys Specialist Programmer will take place from the 15th of next month in the Digital Assessment Center.',
      category: 'placement',
      priority: 'high',
      targetAudience: 'students',
      authorName: 'Training & Placement Officer (TPO)',
      publishedBy: adminUser._id,
      isActive: true,
      views: 740
    });

    await Announcement.create({
      title: 'Registrations Open for National Hackathon 2026',
      content: 'The Department of Computer Science invites registrations for the 36-hour National Smart Hackathon 2026. Teams of up to 4 students from both internal and external universities may participate. Certificates and ₹1.5L prize pool.',
      category: 'event',
      priority: 'urgent',
      targetAudience: 'all',
      authorName: 'Event Organizing Committee',
      publishedBy: adminUser._id,
      isActive: true,
      views: 1120
    });

    await Announcement.create({
      title: 'Mid-Semester Examination Schedule Published',
      content: 'The revised mid-semester theory and laboratory examination timetables for all semesters are now uploaded to the student portal. Students are advised to clear any library dues.',
      category: 'academic',
      priority: 'normal',
      targetAudience: 'students',
      authorName: 'Dean of Academics',
      publishedBy: adminUser._id,
      isActive: true,
      views: 950
    });

    console.log('[Seed] Populating AI Chatbot FAQ knowledge base...');

    const chatbotFAQs = [
      {
        question: 'What events are happening in our college?',
        answer: 'Smart Campus hosts a wide spectrum of events including the 36-hour National Hackathon, Modern Full-Stack Web Development Bootcamps, Symphony 2026 Annual Cultural Fest, Industry 4.0 Seminars, and Inter-College Sports Tournaments. Explore the Events tab for schedules and registration!',
        category: 'event',
        keywords: ['events', 'happening', 'upcoming', 'activities'],
        suggestedQuickReplies: ['What is the next upcoming event?', 'How can I register?', 'Available Jobs']
      },
      {
        question: 'How can I register for an event?',
        answer: 'To register for an event: 1. Sign in to your account. 2. Visit the Events tab. 3. Click the event card and choose "Register for Event". 4. Verify your details. Once registered, a personalized digital ticket with a unique Registration ID and verification QR Code is instantly generated.',
        category: 'registration',
        keywords: ['register', 'registration', 'how to register', 'pass'],
        suggestedQuickReplies: ['What events are happening?', 'What is the registration fee?', 'Check My Registrations']
      },
      {
        question: 'What is the registration deadline?',
        answer: 'Registration deadlines vary by event and are displayed with a live countdown on each event card. Once the deadline passes or capacity is reached, registration automatically closes to prevent overbooking.',
        category: 'registration',
        keywords: ['deadline', 'last date', 'closing date', 'when'],
        suggestedQuickReplies: ['Next upcoming event', 'Browse Events', 'How to Register']
      },
      {
        question: 'What is the event registration fee?',
        answer: 'Most academic seminars and department workshops are completely Free! Certain specialized hackathons, cultural festivals, or certified bootcamps may have nominal entry fees (e.g., ₹150 - ₹250). The fee is clearly shown on each event card.',
        category: 'event',
        keywords: ['fee', 'cost', 'price', 'free'],
        suggestedQuickReplies: ['Browse Events', 'National Hackathon Fee', 'Job Vacancies']
      },
      {
        question: 'Where is the event conducted?',
        answer: 'Campus events are conducted across dedicated venues including the Main Auditorium, Open Air Amphitheatre, Sir CV Raman Seminar Hall, Innovation Center, and Sports Complex. The venue is listed on the event page and encoded in your QR ticket pass.',
        category: 'event',
        keywords: ['where', 'venue', 'location', 'hall', 'auditorium'],
        suggestedQuickReplies: ['Next upcoming event', 'How to register', 'Campus Map']
      },
      {
        question: 'Which companies are providing job opportunities?',
        answer: 'Leading recruiters on Smart Campus currently include Google India, Microsoft Corporation, and Infosys Limited. They are hiring for software engineering, cloud systems, and analyst roles.',
        category: 'job',
        keywords: ['companies', 'recruiters', 'hiring', 'who is hiring'],
        suggestedQuickReplies: ['What are the available job vacancies?', 'How can I apply for a job?', 'Eligibility requirements']
      },
      {
        question: 'What are the available job vacancies?',
        answer: 'Active openings include Associate Software Engineer (Google), Full Stack Web Engineer (Microsoft), Systems Engineer (Infosys), and Summer 2026 Software Engineering Internships. Check the Job Portal for requirements and deadlines!',
        category: 'job',
        keywords: ['job', 'jobs', 'vacancies', 'openings', 'internship'],
        suggestedQuickReplies: ['How can I apply for a job?', 'Eligibility requirements', 'Which companies are hiring?']
      },
      {
        question: 'How can I apply for a job?',
        answer: 'To apply: 1. Navigate to the Job Portal. 2. Select any open vacancy. 3. Review qualifications and salary. 4. Click "Apply Now", attach your PDF resume (up to 5MB), and submit. You can track real-time status under "My Applications".',
        category: 'job',
        keywords: ['apply', 'job application', 'submit resume'],
        suggestedQuickReplies: ['Available job vacancies', 'My Applications', 'Resume Guidelines']
      },
      {
        question: 'What are the eligibility requirements?',
        answer: 'For events: Most events welcome both internal and external college students across all disciplines. For jobs: Specific graduation batches (2025/2026) and minimum CGPA criteria (generally 6.0 to 7.0+) are set by recruiters and clearly stated in each listing.',
        category: 'general',
        keywords: ['eligibility', 'criteria', 'who can apply', 'cgpa'],
        suggestedQuickReplies: ['Browse Jobs', 'Upcoming Events', 'External Students']
      },
      {
        question: 'Can external students from other colleges participate?',
        answer: 'Yes! Smart Campus actively supports external students. When registering your account, select "External Student", specify your college and department, and you can register for open inter-college events and hackathons.',
        category: 'registration',
        keywords: ['external', 'other college', 'outside', 'different college'],
        suggestedQuickReplies: ['What events are happening?', 'How to Register', 'Create Account']
      }
    ];

    await ChatbotFAQ.insertMany(chatbotFAQs);

    console.log('[Seed] Creating demo notifications...');

    await Notification.create({
      recipient: internalStudent._id,
      title: 'Welcome to Smart Campus! 🎓',
      message: 'Explore upcoming technical hackathons, cultural fests, and campus job recruitment openings.',
      type: 'system',
      link: '/events'
    });

    await Notification.create({
      recipient: internalStudent._id,
      title: '🌟 Shortlisted for Google Interview!',
      message: 'Congratulations! Your application for Associate Software Engineer at Google India has been shortlisted.',
      type: 'application',
      link: '/my-applications'
    });

    await Notification.create({
      targetRole: 'all',
      title: 'National Hackathon 2026 Registrations Closing Soon',
      message: 'Seats for the National Smart Hackathon 2026 are 70% booked! Reserve your spot now.',
      type: 'event',
      link: `/events/${event1._id}`
    });

    console.log('===========================================================');
    console.log('🎉 SMART CAMPUS DATABASE SEEDED SUCCESSFULLY!');
    console.log('===========================================================');
    console.log('DEMO CREDENTIALS:');
    console.log('1. Admin:    admin@smartcampus.edu         / Admin@123');
    console.log('2. Student:  rahul.sharma@smartcampus.edu  / Student@123 (Internal)');
    console.log('3. Student:  priya.verma@external.edu      / Student@123 (External)');
    console.log('4. Company:  recruiter@google.com          / Company@123');
    console.log('5. Company:  careers@microsoft.com         / Company@123');
    console.log('===========================================================');

    return true;
  } catch (error) {
    console.error('[Seed Error]:', error);
    throw error;
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[AutoSeed] Empty database detected. Populating initial data...');
      await seedData();
    } else {
      console.log(`[AutoSeed] Database already has data (${userCount} users). Skipping seed.`);
    }
  } catch (err) {
    console.warn('[AutoSeed Warning]:', err.message);
  }
};

if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { seedData, autoSeedIfEmpty };
