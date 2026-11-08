const Event = require('../models/Event');
const Job = require('../models/Job');
const Announcement = require('../models/Announcement');
const ChatbotFAQ = require('../models/ChatbotFAQ');

/**
 * Clean & tokenize text for natural query matching
 */
const normalize = (text) => (text || '').toLowerCase().trim();

/**
 * Process a user's natural language question grounded in the real database
 */
const processQuery = async (queryText) => {
  const query = normalize(queryText);

  // 1. Check FAQ Database first for exact or high-confidence keyword match
  const faqs = await ChatbotFAQ.find({ isActive: true });
  for (const faq of faqs) {
    if (normalize(faq.question) === query) {
      faq.clickCount += 1;
      await faq.save();
      return {
        reply: faq.answer,
        category: faq.category,
        quickReplies: faq.suggestedQuickReplies.length
          ? faq.suggestedQuickReplies
          : ['Upcoming Events', 'Available Jobs', 'How to Register']
      };
    }

    // Check keyword containment
    if (faq.keywords && faq.keywords.length > 0) {
      const matchAll = faq.keywords.every((kw) => query.includes(normalize(kw)));
      if (matchAll && faq.keywords.length >= 2) {
        faq.clickCount += 1;
        await faq.save();
        return {
          reply: faq.answer,
          category: faq.category,
          quickReplies: faq.suggestedQuickReplies
        };
      }
    }
  }

  // 2. Events Queries
  // "What is the next upcoming event?" / "next event" / "earliest event"
  if (
    query.includes('next event') ||
    query.includes('next upcoming') ||
    query.includes('closest event') ||
    query.includes('nearest event')
  ) {
    const nextEvent = await Event.findOne({
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    if (nextEvent) {
      const feeText = nextEvent.registrationFee > 0 ? `₹${nextEvent.registrationFee}` : 'Free';
      const eventDate = new Date(nextEvent.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      return {
        reply: `The next upcoming event is **"${nextEvent.title}"** organized by the ${nextEvent.department} department.\n\n📅 **Date & Time:** ${eventDate} at ${nextEvent.time}\n📍 **Venue:** ${nextEvent.venue}\n🏷️ **Category:** ${nextEvent.category}\n💰 **Fee:** ${feeText}\n⏳ **Registration Deadline:** ${new Date(nextEvent.regEndDate).toLocaleDateString()}\n\n*${nextEvent.description.substring(0, 150)}...*`,
        relatedId: nextEvent._id,
        link: `/events/${nextEvent._id}`,
        quickReplies: [
          `Register for ${nextEvent.title.substring(0, 15)}...`,
          'All Upcoming Events',
          'Event Deadlines',
          'Job Opportunities'
        ]
      };
    } else {
      return {
        reply: 'There are currently no upcoming events scheduled in the database. Please check back later or view past events.',
        quickReplies: ['Check Job Vacancies', 'View Announcements']
      };
    }
  }

  // "What events are happening in our college?" / "all events" / "list events"
  if (
    query.includes('event') &&
    (query.includes('happening') ||
      query.includes('list') ||
      query.includes('available') ||
      query.includes('what') ||
      query.includes('upcoming') ||
      query.includes('calendar') ||
      query === 'events')
  ) {
    const upcomingEvents = await Event.find({
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: new Date() }
    })
      .sort({ date: 1 })
      .limit(5);

    if (upcomingEvents.length > 0) {
      let reply = `Here are the upcoming events scheduled on Smart Campus:\n\n`;
      upcomingEvents.forEach((ev, idx) => {
        const dStr = new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const fee = ev.registrationFee > 0 ? `₹${ev.registrationFee}` : 'Free';
        reply += `${idx + 1}. **${ev.title}** (${ev.category.toUpperCase()})\n   🗓️ ${dStr} at ${ev.time} | 📍 ${ev.venue} | 💵 ${fee}\n`;
      });
      reply += `\nYou can click on any event to view complete details, download brochures, and reserve your ticket!`;

      return {
        reply,
        link: '/events',
        quickReplies: [
          'How to register for an event?',
          'Event registration fees',
          'Available Job Vacancies',
          'Next upcoming event'
        ]
      };
    } else {
      return {
        reply: 'Currently no new events are listed. The administration updates the schedule regularly.',
        link: '/events',
        quickReplies: ['Browse Job Listings', 'College Announcements']
      };
    }
  }

  // Specific event query by title search in database
  const events = await Event.find({ status: { $ne: 'cancelled' } });
  for (const ev of events) {
    const evTitleLower = ev.title.toLowerCase();
    if (query.includes(evTitleLower) || evTitleLower.split(' ').some((w) => w.length > 3 && query.includes(w))) {
      const isFeeQuery = query.includes('fee') || query.includes('cost') || query.includes('price');
      const isVenueQuery = query.includes('where') || query.includes('venue') || query.includes('location');
      const isDeadlineQuery = query.includes('deadline') || query.includes('when') || query.includes('last date');

      const fee = ev.registrationFee > 0 ? `₹${ev.registrationFee}` : 'Free of cost';
      const dateStr = new Date(ev.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      const deadlineStr = new Date(ev.regEndDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });

      if (isFeeQuery) {
        return {
          reply: `The registration fee for **"${ev.title}"** is **${fee}**.`,
          link: `/events/${ev._id}`,
          quickReplies: [`Register for ${ev.title.substring(0, 15)}...`, 'Check Venue', 'Registration Deadline']
        };
      }

      if (isVenueQuery) {
        return {
          reply: `**"${ev.title}"** will be held at **${ev.venue}** on **${dateStr} at ${ev.time}**.`,
          link: `/events/${ev._id}`,
          quickReplies: [`Register for ${ev.title.substring(0, 15)}...`, 'What is the fee?', 'Event Details']
        };
      }

      if (isDeadlineQuery) {
        return {
          reply: `The registration deadline for **"${ev.title}"** is **${deadlineStr}**. Please ensure you register before seats fill up (${ev.currentParticipants}/${ev.maxParticipants} registered).`,
          link: `/events/${ev._id}`,
          quickReplies: [`Register for ${ev.title.substring(0, 15)}...`, 'All Events']
        };
      }

      return {
        reply: `**${ev.title}**\n\n📌 **Description:** ${ev.description}\n📅 **Date:** ${dateStr} at ${ev.time}\n📍 **Venue:** ${ev.venue}\n💰 **Fee:** ${fee}\n⏳ **Deadline:** ${deadlineStr}\n👥 **Capacity:** ${ev.currentParticipants}/${ev.maxParticipants} students registered.`,
        link: `/events/${ev._id}`,
        quickReplies: [`Register for this event`, 'All Upcoming Events', 'Job Opportunities']
      };
    }
  }

  // Registration guidance
  if (
    query.includes('how to register') ||
    query.includes('how can i register') ||
    query.includes('registration process') ||
    query.includes('register for event')
  ) {
    return {
      reply: `**How to Register for an Event:**\n\n1. Log in to your Smart Campus student account (both internal and external students are supported).\n2. Navigate to the **Events** tab from the top navigation bar.\n3. Click on the event card to open its complete details.\n4. Click the **"Register for Event"** button.\n5. Verify your student and department details and confirm.\n6. An instant confirmation ticket with a unique **Registration ID** and **QR Code** will be generated and saved under your **"My Registrations"** dashboard.`,
      link: '/events',
      quickReplies: ['View Upcoming Events', 'Check My Registrations', 'Are external students allowed?']
    };
  }

  // External students inquiry
  if (query.includes('external student') || query.includes('other college') || query.includes('outside student')) {
    return {
      reply: `**Yes!** Students from other colleges are warmly welcomed to participate in open events organized by our institution.\n\nWhen registering for your account, simply select **"External Student"** and enter your college name and department. Events marked with eligibility **"All Students"** or **"External"** are available for your registration!`,
      link: '/events',
      quickReplies: ['Browse Open Events', 'Create Student Account']
    };
  }

  // Registration fee general query
  if (query.includes('registration fee') || (query.includes('fee') && query.includes('event'))) {
    return {
      reply: `Most academic seminars, placement workshops, and technical talks on Smart Campus are **Free**. Certain specialized hackathons, cultural fests, or certification workshops may carry a nominal registration fee.\n\nThe exact fee is clearly indicated on each event's card and details page.`,
      link: '/events',
      quickReplies: ['Browse Events', 'How to Register', 'Available Jobs']
    };
  }

  // 3. Job Vacancies & Company Queries
  // "Which companies are providing job opportunities?" / "companies hiring"
  if (
    query.includes('which companies') ||
    query.includes('company list') ||
    query.includes('companies providing') ||
    query.includes('recruiting') ||
    query.includes('recruiters')
  ) {
    const jobs = await Job.find({ status: 'active' }).populate('company');
    const companyNames = [...new Set(jobs.map((j) => j.companyName))];

    if (companyNames.length > 0) {
      return {
        reply: `Currently, the following top companies have published active vacancies on the Smart Campus Job Portal:\n\n${companyNames
          .map((c, i) => `🏢 **${i + 1}. ${c}**`)
          .join('\n')}\n\nYou can view all job openings, eligibility criteria, stipends/salaries, and apply directly.`,
        link: '/jobs',
        quickReplies: ['Available Job Vacancies', 'How to Apply for a Job', 'Upcoming Events']
      };
    } else {
      return {
        reply: 'There are currently no active company listings posted. Campus recruitment drives are updated frequently.',
        link: '/jobs',
        quickReplies: ['Upcoming Events', 'Campus Announcements']
      };
    }
  }

  // "What are the available job vacancies?" / "jobs" / "internships"
  if (
    query.includes('job') ||
    query.includes('vacanc') ||
    query.includes('hiring') ||
    query.includes('internship') ||
    query === 'jobs'
  ) {
    // If asking how to apply
    if (query.includes('how can i apply') || query.includes('how to apply') || query.includes('apply for')) {
      return {
        reply: `**How to Apply for a Job:**\n\n1. Sign in to your student account.\n2. Go to the **Job Portal** section.\n3. Filter or search vacancies by company, title, or job type (Full-Time / Internship).\n4. Review the eligibility requirements, qualifications, and deadline.\n5. Click **"Apply Now"**.\n6. Upload your PDF resume (max 5MB), enter your details, and submit.\n7. Track your real-time application status (**Applied ➔ Under Review ➔ Shortlisted ➔ Selected**) inside **"My Applications"**.`,
        link: '/jobs',
        quickReplies: ['Browse Available Jobs', 'My Applications', 'Resume Requirements']
      };
    }

    const activeJobs = await Job.find({ status: 'active' }).sort({ createdAt: -1 }).limit(5);

    if (activeJobs.length > 0) {
      let reply = `Here are active job openings and campus placement vacancies on Smart Campus:\n\n`;
      activeJobs.forEach((job, idx) => {
        const dStr = new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        reply += `${idx + 1}. **${job.title}** at **${job.companyName}**\n   💼 ${job.jobType.toUpperCase()} | 💰 ${job.salaryOrStipend} | 📍 ${job.location}\n   ⏳ Deadline: ${dStr}\n\n`;
      });
      reply += `Visit the Job Portal to read full job specifications and submit your resume.`;

      return {
        reply,
        link: '/jobs',
        quickReplies: [
          'How can I apply for a job?',
          'Which companies are hiring?',
          'Check Eligibility Requirements',
          'Upcoming Events'
        ]
      };
    } else {
      return {
        reply: 'No active job vacancies at the moment. Keep an eye on announcements for upcoming recruitment drives.',
        link: '/jobs',
        quickReplies: ['Upcoming Events', 'Announcements']
      };
    }
  }

  // Eligibility requirements query
  if (query.includes('eligibility') || query.includes('criteria') || query.includes('who can apply')) {
    return {
      reply: `**Eligibility Information:**\n\n- **Events:** Many events are open to both internal campus students and external college students across all engineering and management branches. Specific workshops may mention prerequisites.\n- **Jobs & Internships:** Each recruiter specifies their batch criteria (e.g. 2025/2026), minimum CGPA (typically 6.0+), and eligible branches. Check the "Eligibility" badge on each job post.`,
      quickReplies: ['Browse Jobs', 'Browse Events', 'External Students Policy']
    };
  }

  // 4. College Announcements
  if (query.includes('announcement') || query.includes('notice') || query.includes('news') || query.includes('circular')) {
    const recentAnnouncements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(3);

    if (recentAnnouncements.length > 0) {
      let reply = `📢 **Latest Campus Announcements:**\n\n`;
      recentAnnouncements.forEach((a, idx) => {
        const dStr = new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        reply += `${idx + 1}. **${a.title}** [${a.priority.toUpperCase()}]\n   ${a.content.substring(0, 120)}... (${dStr})\n\n`;
      });
      return {
        reply,
        link: '/announcements',
        quickReplies: ['Upcoming Events', 'Job Opportunities']
      };
    }
  }

  // 5. Friendly Greetings
  if (['hi', 'hello', 'hey', 'greetings', 'good morning', 'good evening', 'good afternoon'].includes(query)) {
    return {
      reply: `Hello! 👋 Welcome to **Smart Campus Assistant**.\n\nI can help you explore upcoming college events, check registration deadlines and fees, discover active job vacancies, track application statuses, and answer campus queries based on live campus records.\n\nHow can I help you today?`,
      quickReplies: [
        'What events are happening in our college?',
        'What is the next upcoming event?',
        'Which companies are hiring?',
        'How can I register for an event?'
      ]
    };
  }

  // 6. Graceful unknown question fallback
  return {
    reply: `I'm sorry, I couldn't find a direct record in our campus database matching **"${queryText}"**.\n\nYou can explore our direct sections below, or contact the College Administration / Training & Placement Cell at **admin@smartcampus.edu** for personalized assistance.`,
    quickReplies: [
      'What events are happening in our college?',
      'What is the next upcoming event?',
      'Which companies are providing job opportunities?',
      'How can I register for an event?',
      'How to apply for a job?'
    ]
  };
};

module.exports = {
  processQuery
};
