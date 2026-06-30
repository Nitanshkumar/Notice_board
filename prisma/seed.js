require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const demoNotices = [
  {
    title: "Hall Ticket Released for Semester Exams",
    body: "Hall tickets for the upcoming semester examinations are now available for download from the student portal. Carry a printed copy along with a valid college ID to the exam hall.",
    category: "EXAM",
    priority: "URGENT",
    publishDate: new Date("2026-06-10"),
  },
  {
    title: "Fee Payment Deadline Extended",
    body: "The last date to pay semester fees without a late charge has been extended to 30 June 2026. Students who have already paid need not take any action.",
    category: "GENERAL",
    priority: "URGENT",
    publishDate: new Date("2026-06-12"),
  },
  {
    title: "Annual Cultural Fest Registrations Open",
    body: "Registrations for this year's annual cultural fest are now open. Students can register individually or as teams of up to five members through the events portal.",
    category: "EVENT",
    priority: "NORMAL",
    publishDate: new Date("2026-06-08"),
  },
  {
    title: "Library Timing Update for Exam Season",
    body: "The central library will remain open from 7 AM to midnight during the exam season starting next week. Please carry your ID card for entry after 9 PM.",
    category: "GENERAL",
    priority: "NORMAL",
    publishDate: new Date("2026-06-05"),
  },
  {
    title: "Guest Lecture on Career Opportunities in AI",
    body: "The Computer Science department is organising a guest lecture on career opportunities in AI and Machine Learning. All final-year students are encouraged to attend.",
    category: "EVENT",
    priority: "NORMAL",
    publishDate: new Date("2026-06-02"),
  },
];

async function main() {
  console.log("Seeding database...");
  await prisma.notice.deleteMany();
  for (const notice of demoNotices) {
    await prisma.notice.create({ data: notice });
  }
  console.log(`Seeded ${demoNotices.length} notices.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
