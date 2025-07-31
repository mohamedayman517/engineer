const mongoose = require("mongoose");
const Faq = require("./models/Faq");
require("dotenv").config(); // Load environment variables from .env file

const mongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot";

const faqsData = [
  {
    question: "ما هي الخدمات التي تقدمها؟",
    answer: "أقدم خدمات التصميم المعماري، التصميم الداخلي، الإشراف على التنفيذ، والتصميم ثلاثي الأبعاد."
  },
  {
    question: "كم تكلفة التصميم لمشروع صغير؟",
    answer: "تبدأ تكلفة التصميم من 100 جنيه/متر حسب نوع المشروع ومتطلباته."
  },
  {
    question: "ما هي مواعيد العمل؟",
    answer: "أعمل من 9 صباحًا حتى 5 مساءً، من السبت إلى الخميس."
  },
  {
    question: "كيف يمكنني التواصل معك؟",
    answer: "يمكنك التواصل معي عبر الهاتف أو البريد الإلكتروني أو من خلال هذا الموقع."
  },
  {
    question: "هل تقدم استشارات مجانية؟",
    answer: "نعم، أقدم استشارة أولية مجانية لمدة 30 دقيقة لمناقشة مشروعك."
  },
  {
    question: "ما هي أنواع المشاريع التي تعمل عليها؟",
    answer: "أعمل على المشاريع السكنية، التجارية، الإدارية، والفيلات الخاصة."
  },
  {
    question: "كم يستغرق تسليم التصميم؟",
    answer: "يستغرق التصميم من أسبوع إلى شهر حسب حجم وتعقيد المشروع."
  },
  {
    question: "هل تقدم خدمات الإشراف على التنفيذ؟",
    answer: "نعم، أقدم خدمات الإشراف على التنفيذ لضمان تطبيق التصميم بدقة."
  },
  {
    question: "ما هي خبرتك في المجال؟",
    answer: "لدي خبرة أكثر من 10 سنوات في مجال التصميم المعماري والتصميم الداخلي."
  },
  {
    question: "هل تعمل على المشاريع الصغيرة؟",
    answer: "نعم، أعمل على جميع أنواع المشاريع من الصغيرة إلى الكبيرة."
  },
  {
    question: "ما هي أسعار التصميم الداخلي؟",
    answer: "تبدأ أسعار التصميم الداخلي من 80 جنيه/متر حسب التعقيد والمواد المطلوبة."
  },
  {
    question: "هل تقدم رسومات ثلاثية الأبعاد؟",
    answer: "نعم، أقدم رسومات ثلاثية الأبعاد عالية الجودة لتوضيح التصميم قبل التنفيذ."
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to DB");

    await Faq.deleteMany({});
    console.log("🧹 Cleared existing FAQs.");

    await Faq.insertMany(faqsData);
    console.log("✅ Data seeded successfully!");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
};

seedDatabase();
