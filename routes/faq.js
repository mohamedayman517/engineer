const express = require("express");
const Faq = require("../models/Faq");
const router = express.Router();

console.log("FAQ routes loaded");

// للتوافق مع ChatBot.jsx
router.post("/faq/ask", async (req, res) => {
  console.log("=== FAQ ASK ROUTE HIT ===");
  try {
    const { question } = req.body;
    console.log("Received question:", question);

    // البحث في الأسئلة والأجوبة
    const faq = await Faq.findOne({
      $or: [
        { question: { $regex: new RegExp(question, "i") } },
        { answer: { $regex: new RegExp(question, "i") } },
      ],
    });

    console.log("Found FAQ:", faq);

    if (faq) {
      res.json({ answer: faq.answer });
    } else {
      res.json({
        answer: "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// للتوافق مع chat.jsx
router.post("/faq", async (req, res) => {
  try {
    const { question } = req.body;

    // البحث في الأسئلة والأجوبة
    const faq = await Faq.findOne({
      $or: [
        { question: { $regex: new RegExp(question, "i") } },
        { answer: { $regex: new RegExp(question, "i") } },
      ],
    });

    if (faq) {
      res.json({ answer: faq.answer });
    } else {
      res.json({ answer: "Sorry, I don't know that." });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

module.exports = router;
