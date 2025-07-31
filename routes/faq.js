const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Faq = require("../models/Faq");

// نقطة نهاية للتحقق من حالة الخادم
router.get("/status", (req, res) => {
  console.log("Status endpoint hit");
  return res.json({ status: "ok", message: "الخادم يعمل بشكل صحيح" });
});

// للتوافق مع ChatBot.jsx - تبسيط المنطق
const DEFAULT_ANSWER = "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة.";
const MATCH_THRESHOLD = 1; // على الأقل كلمة واحدة مشتركة أو تطابق جزئي

/**
 * Calculates a match score between a user's question and a FAQ item.
 * @param {string} userQuestion - The normalized question from the user.
 * @param {object} faq - The FAQ object from the database { question, answer }.
 * @returns {number} The calculated score.
 */
function calculateMatchScore(userQuestion, faq) {
  const faqQuestion = faq.question.toLowerCase();
  const userQuestionWords = userQuestion.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const faqWords = faqQuestion.split(/\s+/).filter(w => w.length > 1);
  let score = 0;

  // 1. Word-based scoring
  for (const userWord of userQuestionWords) {
    for (const faqWord of faqWords) {
      if (userWord === faqWord) {
        score += 2; // Higher score for exact word match
        break; 
      }
      if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
        score += 1; // Lower score for partial match
        break;
      }
    }
  }

  // 2. Phrase-based scoring bonus
  if (faqQuestion.includes(userQuestion.toLowerCase()) || userQuestion.toLowerCase().includes(faqQuestion)) {
    score += 3;
  }

  return score;
}

/**
 * Finds the best FAQ answer for a given question.
 * @param {string} question - The user's question.
 * @returns {Promise<string>} The answer string.
 */
async function findFaqAnswer(question) {
  const faqs = await Faq.find();
  if (faqs.length === 0) {
    console.warn('Database is empty. No FAQs found.');
    return "عذراً، لا توجد بيانات في قاعدة البيانات حالياً.";
  }

  // 1. Check for an exact match first
  const exactMatch = faqs.find(faq => faq.question.trim().toLowerCase() === question.toLowerCase());
  if (exactMatch) {
    return exactMatch.answer;
  }

  // 2. If no exact match, find the best partial match using a scoring system
  let bestMatch = null;
  let bestMatchScore = 0;

  for (const faq of faqs) {
    const currentScore = calculateMatchScore(question, faq);
    if (currentScore > bestMatchScore) {
      bestMatchScore = currentScore;
      bestMatch = faq;
    }
  }

  if (bestMatch && bestMatchScore >= MATCH_THRESHOLD) {
    return bestMatch.answer;
  }

  // 3. If no suitable match is found, return the default answer
  return DEFAULT_ANSWER;
}

router.post("/faq/ask", async (req, res) => {
  try {
    const { question: rawQuestion } = req.body;

    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim() === "") {
      return res.status(400).json({ error: "يرجى تقديم سؤال صالح" });
    }

    const question = rawQuestion.trim();
    const answer = await findFaqAnswer(question);
    return res.json({ answer });

  } catch (error) {
    console.error("Error in /faq/ask route:", error);
    return res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

// إضافة نقطة نهاية للتحقق من حالة قاعدة البيانات وعرض جميع الأسئلة والأجوبة
router.get('/db-status', async (req, res) => {
  try {
    console.log('Checking database status...');
    console.log('MongoDB connection status:', mongoose.connection.readyState);
    
    const faqs = await Faq.find();
    console.log(`Found ${faqs.length} FAQs in database`);
    
    // إعداد قائمة بالأسئلة والأجوبة للعرض
    const faqList = faqs.map(faq => ({
      id: faq._id,
      question: faq.question,
      answer: faq.answer
    }));
    
    res.json({
      status: 'ok',
      connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      count: faqs.length,
      faqs: faqList
    });
  } catch (error) {
    console.error('Error checking database status:', error);
    res.status(500).json({ error: "خطأ في الاتصال بقاعدة البيانات" });
  }
});

// للتوافق مع chat.jsx
router.post("/faq", async (req, res) => {
  try {
    const { question: rawQuestion } = req.body;
    if (!rawQuestion || typeof rawQuestion !== 'string' || rawQuestion.trim() === "") {
      return res.json({ answer: DEFAULT_ANSWER });
    }

    const question = rawQuestion.trim();
    const answer = await findFaqAnswer(question);
    return res.json({ answer });
  } catch (error) {
    console.error("Error in /faq route:", error);
    return res.status(500).json({ error: "حدث خطأ في الخادم" });
  }
});

module.exports = router;
