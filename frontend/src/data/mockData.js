/**
 * CampusHub — Mock Academic Data for Phase 1 Frontend Portal
 * Complies with Fictional Data Guidelines (No real student credentials or PII).
 */

export const mockStudent = {
  id: "STU-2026-001",
  name: "Aarav Mehta",
  rollNo: "CS2026001",
  email: "aarav.mehta@campushub.edu",
  department: "Computer Science and Engineering",
  program: "B.Tech Computer Science",
  semester: 5,
  division: "Division A",
  batch: "Batch B1",
  academicYear: "2025-2026",
  mentor: "Dr. Rajesh Sharma",
  avatarUrl: "",
  initials: "AM",
};

export const mockStats = [
  {
    id: "attendance",
    title: "Overall Attendance",
    value: "88.4%",
    caption: "Above mandatory 85% threshold",
    trend: "+1.2% this month",
    trendType: "positive",
    statusBadge: "Eligible",
    badgeVariant: "success",
  },
  {
    id: "courses",
    title: "Enrolled Courses",
    value: "5",
    caption: "19 Credits total this semester",
    trend: "All active",
    trendType: "neutral",
    statusBadge: "Regular",
    badgeVariant: "default",
  },
  {
    id: "assignments",
    title: "Pending Tasks",
    value: "3",
    caption: "Due within next 7 days",
    trend: "1 due this Friday",
    trendType: "warning",
    statusBadge: "Action Needed",
    badgeVariant: "warning",
  },
  {
    id: "cgpa",
    title: "Cumulative GPA",
    value: "8.62",
    caption: "Semester 4 SPI: 8.80",
    trend: "Top 10% in Division",
    trendType: "positive",
    statusBadge: "First Class Distinction",
    badgeVariant: "secondary",
  },
];

export const mockSchedule = [
  {
    id: "SCH-1",
    courseCode: "CS501",
    courseName: "Full Stack Web Development",
    time: "09:15 AM - 10:15 AM",
    room: "Lab 302, Academic Block A",
    type: "Practical / Lab",
    faculty: "Prof. Sanjay Patel",
    status: "Completed",
  },
  {
    id: "SCH-2",
    courseCode: "CS502",
    courseName: "Database Management Systems",
    time: "10:30 AM - 11:30 AM",
    room: "Room 204, Academic Block B",
    type: "Lecture",
    faculty: "Dr. Ananya Roy",
    status: "In Progress",
  },
  {
    id: "SCH-3",
    courseCode: "CS503",
    courseName: "Computer Networks",
    time: "11:45 AM - 12:45 PM",
    room: "Room 105, Academic Block B",
    type: "Lecture",
    faculty: "Prof. Vikram Joshi",
    status: "Upcoming",
  },
  {
    id: "SCH-4",
    courseCode: "CS504",
    courseName: "Operating Systems Lab",
    time: "02:00 PM - 04:00 PM",
    room: "Systems Lab 101, Ground Floor",
    type: "Practical / Lab",
    faculty: "Dr. Neha Verma",
    status: "Upcoming",
  },
];

export const mockAssignments = [
  {
    id: "ASN-101",
    courseCode: "CS501",
    title: "Practical 1: Server-Side JS & JSON Basics",
    dueDate: "2026-09-25",
    dueTime: "11:59 PM",
    status: "In Progress",
    totalMarks: 50,
    badgeVariant: "warning",
  },
  {
    id: "ASN-102",
    courseCode: "CS502",
    title: "Lab Task: ER Diagram & Normalization (3NF)",
    dueDate: "2026-09-27",
    dueTime: "05:00 PM",
    status: "Pending",
    totalMarks: 30,
    badgeVariant: "destructive",
  },
  {
    id: "ASN-103",
    courseCode: "CS503",
    title: "Subnetting and Routing Table Simulation",
    dueDate: "2026-09-30",
    dueTime: "11:59 PM",
    status: "Pending",
    totalMarks: 25,
    badgeVariant: "secondary",
  },
];

export const mockNotices = [
  {
    id: "NOT-001",
    title: "Mid-Semester Examination Schedule Announced",
    description: "The official timetable for B.Tech Semester 5 Mid-Semester Examinations has been published. Exams commence on 10th October 2026.",
    category: "Academic",
    date: "2026-09-21",
    issuedBy: "Controller of Examinations",
    badgeVariant: "default",
    isUrgent: true,
  },
  {
    id: "NOT-002",
    title: "Submission Deadline for FSD Practical Assignment 1",
    description: "All students are instructed to commit and demonstrate Practical 1 submissions before the end of the lab session.",
    category: "Department",
    date: "2026-09-20",
    issuedBy: "Department of CSE",
    badgeVariant: "secondary",
    isUrgent: false,
  },
  {
    id: "NOT-003",
    title: "Industry Expert Talk on Cloud-Native Systems",
    description: "Department of CSE is hosting a guest lecture on Modern Microservices & Distributed Architecture on Saturday at 11:00 AM.",
    category: "Event",
    date: "2026-09-18",
    issuedBy: "CSE Student Association",
    badgeVariant: "secondary",
    isUrgent: false,
  },
];

export const mockActivities = [
  {
    id: "ACT-01",
    title: "Assignment Submission Confirmed",
    detail: "CS501 Practical 1 draft saved to workspace",
    timestamp: "10 mins ago",
  },
  {
    id: "ACT-02",
    title: "Attendance Recorded",
    detail: "Marked Present for CS501 Lab (09:15 - 10:15 AM)",
    timestamp: "1 hour ago",
  },
  {
    id: "ACT-03",
    title: "Notice Acknowledged",
    detail: "Read 'Mid-Semester Examination Schedule Announced'",
    timestamp: "3 hours ago",
  },
  {
    id: "ACT-04",
    title: "Course Material Downloaded",
    detail: "Downloaded CS502 Unit 2 Schema Design Notes",
    timestamp: "Yesterday",
  },
];

export const mockCourses = [
  {
    code: "CS501",
    name: "Full Stack Web Development",
    credits: 4,
    faculty: "Prof. Sanjay Patel",
    attendance: "92.5%",
    schedule: "Mon 09:15 AM (Lab), Wed 10:30 AM",
    syllabusProgress: 35,
  },
  {
    code: "CS502",
    name: "Database Management Systems",
    credits: 4,
    faculty: "Dr. Ananya Roy",
    attendance: "85.0%",
    schedule: "Mon 10:30 AM, Thu 09:15 AM",
    syllabusProgress: 40,
  },
  {
    code: "CS503",
    name: "Computer Networks",
    credits: 4,
    faculty: "Prof. Vikram Joshi",
    attendance: "88.0%",
    schedule: "Mon 11:45 AM, Fri 10:30 AM",
    syllabusProgress: 30,
  },
  {
    code: "CS504",
    name: "Operating Systems",
    credits: 3,
    faculty: "Dr. Neha Verma",
    attendance: "86.5%",
    schedule: "Mon 02:00 PM (Lab), Tue 11:45 AM",
    syllabusProgress: 38,
  },
  {
    code: "CS505",
    name: "Design & Analysis of Algorithms",
    credits: 4,
    faculty: "Prof. Harish Nair",
    attendance: "90.0%",
    schedule: "Tue 09:15 AM, Thu 11:45 AM",
    syllabusProgress: 45,
  },
];

/**
 * Academic Calendar Mock Data — Practical 6 (Tailwind CSS Module)
 */

export const mockTimetable = [
  // Monday
  { day: "Monday", period: 1, time: "09:15–10:15", courseCode: "CS501", courseName: "Full Stack Web Development", room: "Lab 302", type: "Lab", faculty: "Prof. Sanjay Patel" },
  { day: "Monday", period: 2, time: "10:30–11:30", courseCode: "CS502", courseName: "Database Management Systems", room: "Room 204", type: "Lecture", faculty: "Dr. Ananya Roy" },
  { day: "Monday", period: 3, time: "11:45–12:45", courseCode: "CS503", courseName: "Computer Networks", room: "Room 105", type: "Lecture", faculty: "Prof. Vikram Joshi" },
  { day: "Monday", period: 5, time: "14:00–16:00", courseCode: "CS504", courseName: "Operating Systems Lab", room: "Lab 101", type: "Lab", faculty: "Dr. Neha Verma" },
  // Tuesday
  { day: "Tuesday", period: 1, time: "09:15–10:15", courseCode: "CS505", courseName: "Design & Analysis of Algorithms", room: "Room 301", type: "Lecture", faculty: "Prof. Harish Nair" },
  { day: "Tuesday", period: 2, time: "10:30–11:30", courseCode: "CS501", courseName: "Full Stack Web Development", room: "Room 204", type: "Lecture", faculty: "Prof. Sanjay Patel" },
  { day: "Tuesday", period: 3, time: "11:45–12:45", courseCode: "CS504", courseName: "Operating Systems", room: "Room 105", type: "Lecture", faculty: "Dr. Neha Verma" },
  // Wednesday
  { day: "Wednesday", period: 1, time: "09:15–10:15", courseCode: "CS502", courseName: "Database Management Systems", room: "Lab 302", type: "Lab", faculty: "Dr. Ananya Roy" },
  { day: "Wednesday", period: 2, time: "10:30–11:30", courseCode: "CS501", courseName: "Full Stack Web Development", room: "Room 204", type: "Lecture", faculty: "Prof. Sanjay Patel" },
  { day: "Wednesday", period: 3, time: "11:45–12:45", courseCode: "CS505", courseName: "Design & Analysis of Algorithms", room: "Room 301", type: "Lecture", faculty: "Prof. Harish Nair" },
  // Thursday
  { day: "Thursday", period: 1, time: "09:15–10:15", courseCode: "CS503", courseName: "Computer Networks", room: "Lab 302", type: "Lab", faculty: "Prof. Vikram Joshi" },
  { day: "Thursday", period: 2, time: "10:30–11:30", courseCode: "CS502", courseName: "Database Management Systems", room: "Room 204", type: "Lecture", faculty: "Dr. Ananya Roy" },
  { day: "Thursday", period: 3, time: "11:45–12:45", courseCode: "CS505", courseName: "Design & Analysis of Algorithms", room: "Room 105", type: "Lecture", faculty: "Prof. Harish Nair" },
  // Friday
  { day: "Friday", period: 1, time: "09:15–10:15", courseCode: "CS504", courseName: "Operating Systems", room: "Room 301", type: "Lecture", faculty: "Dr. Neha Verma" },
  { day: "Friday", period: 2, time: "10:30–11:30", courseCode: "CS503", courseName: "Computer Networks", room: "Room 204", type: "Lecture", faculty: "Prof. Vikram Joshi" },
  { day: "Friday", period: 3, time: "11:45–12:45", courseCode: "CS501", courseName: "Full Stack Web Development", room: "Lab 302", type: "Lab", faculty: "Prof. Sanjay Patel" },
  // Saturday
  { day: "Saturday", period: 1, time: "09:15–10:15", courseCode: "CS505", courseName: "Design & Analysis of Algorithms", room: "Room 301", type: "Tutorial", faculty: "Prof. Harish Nair" },
  { day: "Saturday", period: 2, time: "10:30–11:30", courseCode: "CS503", courseName: "Computer Networks", room: "Room 204", type: "Tutorial", faculty: "Prof. Vikram Joshi" },
];

export const mockExamSchedule = [
  { courseCode: "CS501", courseName: "Full Stack Web Development", date: "2026-10-10", time: "09:30 AM – 11:30 AM", room: "Hall A, Exam Block", type: "Mid-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS502", courseName: "Database Management Systems", date: "2026-10-12", time: "09:30 AM – 11:30 AM", room: "Hall B, Exam Block", type: "Mid-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS503", courseName: "Computer Networks", date: "2026-10-14", time: "02:00 PM – 04:00 PM", room: "Hall A, Exam Block", type: "Mid-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS504", courseName: "Operating Systems", date: "2026-10-16", time: "09:30 AM – 11:30 AM", room: "Hall C, Exam Block", type: "Mid-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS505", courseName: "Design & Analysis of Algorithms", date: "2026-10-18", time: "02:00 PM – 04:00 PM", room: "Hall B, Exam Block", type: "Mid-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS501", courseName: "Full Stack Web Development", date: "2026-12-05", time: "09:30 AM – 12:30 PM", room: "Hall A, Exam Block", type: "End-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS502", courseName: "Database Management Systems", date: "2026-12-08", time: "09:30 AM – 12:30 PM", room: "Hall B, Exam Block", type: "End-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "CS503", courseName: "Computer Networks", date: "2026-12-10", time: "02:00 PM – 05:00 PM", room: "Hall A, Exam Block", type: "End-Semester", department: "Computer Science & Engineering", semester: 5 },
  { courseCode: "IT501", courseName: "Software Engineering", date: "2026-10-11", time: "09:30 AM – 11:30 AM", room: "Hall D, Exam Block", type: "Mid-Semester", department: "Information Technology", semester: 5 },
  { courseCode: "EC501", courseName: "VLSI Design", date: "2026-10-13", time: "02:00 PM – 04:00 PM", room: "Hall C, Exam Block", type: "Mid-Semester", department: "Electronics & Communication", semester: 5 },
];

export const mockHolidays = [
  { date: "2026-08-15", name: "Independence Day", type: "holiday", description: "National holiday — all university operations suspended" },
  { date: "2026-09-05", name: "Teacher's Day", type: "event", description: "Faculty felicitation ceremony in Central Auditorium" },
  { date: "2026-09-17", name: "Vishwakarma Jayanti", type: "holiday", description: "Engineering community celebration — no classes" },
  { date: "2026-10-02", name: "Gandhi Jayanti", type: "holiday", description: "National holiday" },
  { date: "2026-10-09", name: "Mid-Semester Exam Prep Day", type: "exam-break", description: "No lectures — self-study and revision day" },
  { date: "2026-10-10", name: "Mid-Semester Examinations Begin", type: "exam-break", description: "Exam period begins — regular lectures suspended" },
  { date: "2026-10-19", name: "Mid-Semester Examinations End", type: "exam-break", description: "Last day of mid-semester examinations" },
  { date: "2026-10-20", name: "Dussehra", type: "holiday", description: "Festival holiday" },
  { date: "2026-10-21", name: "Dussehra Vacation", type: "holiday", description: "Extended holiday" },
  { date: "2026-11-01", name: "Campus Tech Symposium", type: "event", description: "Annual technology symposium and project exhibition" },
  { date: "2026-11-14", name: "Diwali Vacation Begins", type: "holiday", description: "Diwali break — campus closed" },
  { date: "2026-11-18", name: "Diwali Vacation Ends", type: "holiday", description: "Classes resume" },
  { date: "2026-11-28", name: "Placement Drive — Day 1", type: "event", description: "On-campus placement interviews — select classrooms unavailable" },
  { date: "2026-12-01", name: "End-Semester Exam Prep Day", type: "exam-break", description: "No lectures — revision period" },
  { date: "2026-12-05", name: "End-Semester Examinations Begin", type: "exam-break", description: "Final examination period — all lectures suspended" },
  { date: "2026-12-20", name: "End-Semester Examinations End", type: "exam-break", description: "Last day of final examinations" },
  { date: "2026-12-25", name: "Christmas", type: "holiday", description: "Holiday — university closed" },
];
