const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const Faq = require("../models/Faq");

console.log("FAQ routes loaded");

// Health check endpoint
router.get("/status", (req, res) => {
  console.log("Status endpoint hit");
  return res.json({ status: "ok", message: "الخادم يعمل بشكل صحيح" });
});

// Get all FAQs
router.get("/", async (req, res) => {
  try {
    console.log("Fetching all FAQs");
    const faqs = await Faq.find({});
    console.log(`Found ${faqs.length} FAQs`);
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "حدث خطأ أثناء جلب الأسئلة الشائعة" });
  }
});

// Handle FAQ search (for chatbot)
router.post("/search", async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`\n[${requestId}] === FAQ SEARCH ROUTE HIT ===`);
  
  try {
    // Log request details
    console.log(`[${requestId}] Headers:`, JSON.stringify(req.headers));
    console.log(`[${requestId}] Content-Type:`, req.headers['content-type']);
    
    // Log request body
    console.log(`[${requestId}] Body:`, JSON.stringify(req.body, null, 2));
    
    // Validate request
    if (!req.body || !req.body.question) {
      console.log(`[${requestId}] Invalid request: No question provided`);
      return res.status(400).json({ error: "يجب توفير سؤال للبحث" });
    }
    
    const { question } = req.body;
    console.log(`[${requestId}] Searching for:`, question);
    
    // Search for exact match first
    const exactMatch = await Faq.findOne({ 
      question: { $regex: new RegExp(`^${question}$`, 'i') } 
    });
    
    if (exactMatch) {
      console.log(`[${requestId}] Exact match found:`, exactMatch.question);
      return res.json({ answer: exactMatch.answer });
    }
    
    // If no exact match, search for partial matches
    const faqs = await Faq.find({});
    console.log(`[${requestId}] Total FAQs in database:`, faqs.length);
    
    // Try to find a partial match
    const partialMatch = faqs.find(faq => 
      faq.question.toLowerCase().includes(question.toLowerCase()) ||
      question.toLowerCase().includes(faq.question.toLowerCase())
    );
    
    if (partialMatch) {
      console.log(`[${requestId}] Partial match found:`, partialMatch.question);
      return res.json({ answer: partialMatch.answer });
    }
    
    // If no match found
    console.log(`[${requestId}] No match found`);
    res.json({ 
      answer: "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة." 
    });
    
  } catch (error) {
    console.error(`[${requestId}] Search error:`, error);
    res.status(500).json({ 
      error: "حدث خطأ أثناء البحث عن الإجابة",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Add a new FAQ
router.post("/", async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`\n[${requestId}] === ADD FAQ ROUTE HIT ===`);
  
  try {
    // Log request details
    console.log(`[${requestId}] Headers:`, JSON.stringify(req.headers));
    console.log(`[${requestId}] Body:`, JSON.stringify(req.body, null, 2));
    
    // Validate request
    if (!req.body || !req.body.question || !req.body.answer) {
      console.log(`[${requestId}] Invalid request: Missing question or answer`);
      return res.status(400).json({ 
        error: "يجب توفير السؤال والإجابة",
        requestId
      });
    }
    
    const { question, answer } = req.body;
    
    // Check if FAQ already exists (case insensitive)
    const existingFaq = await Faq.findOne({ 
      question: { $regex: new RegExp(`^${question}$`, 'i') } 
    });
    
    if (existingFaq) {
      console.log(`[${requestId}] FAQ already exists:`, existingFaq.question);
      return res.status(400).json({ 
        error: "هذا السؤال موجود بالفعل",
        requestId
      });
    }
    
    // Create new FAQ
    const newFaq = new Faq({
      question: question.trim(),
      answer: answer.trim()
    });
    
    console.log(`[${requestId}] Saving new FAQ:`, newFaq);
    
    // Save to database
    const savedFaq = await newFaq.save();
    console.log(`[${requestId}] FAQ saved successfully:`, savedFaq);
    
    // Get updated count
    const count = await Faq.countDocuments();
    console.log(`[${requestId}] Total FAQs in database:`, count);
    
    // Return success response
    res.status(201).json({
      message: "تمت إضافة السؤال بنجاح",
      faq: savedFaq,
      totalFAQs: count,
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error adding FAQ:`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "بيانات غير صالحة",
        details: error.message,
        requestId
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        error: "هذا السؤال موجود بالفعل",
        requestId
      });
    }
    
    // Handle other errors
    res.status(500).json({
      error: "حدث خطأ أثناء إضافة السؤال",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
});

// Update an existing FAQ
router.put("/:id", async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`\n[${requestId}] === UPDATE FAQ ROUTE HIT ===`);
  
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    
    console.log(`[${requestId}] Updating FAQ ${id}`);
    console.log(`[${requestId}] New data:`, { question, answer });
    
    // Validate input
    if (!question && !answer) {
      return res.status(400).json({
        error: "يجب توفير السؤال أو الإجابة للتحديث",
        requestId
      });
    }
    
    // Prepare update data
    const updateData = {};
    if (question) updateData.question = question.trim();
    if (answer) updateData.answer = answer.trim();
    
    // Update FAQ
    const updatedFaq = await Faq.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedFaq) {
      console.log(`[${requestId}] FAQ not found:`, id);
      return res.status(404).json({
        error: "لم يتم العثور على السؤال",
        requestId
      });
    }
    
    console.log(`[${requestId}] FAQ updated successfully:`, updatedFaq);
    
    res.json({
      message: "تم تحديث السؤال بنجاح",
      faq: updatedFaq,
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error updating FAQ:`, error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: "بيانات غير صالحة",
        details: error.message,
        requestId
      });
    }
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: "معرف السؤال غير صالح",
        requestId
      });
    }
    
    // Handle other errors
    res.status(500).json({
      error: "حدث خطأ أثناء تحديث السؤال",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
});

// Delete an FAQ
router.delete("/:id", async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 8);
  console.log(`\n[${requestId}] === DELETE FAQ ROUTE HIT ===`);
  
  try {
    const { id } = req.params;
    console.log(`[${requestId}] Deleting FAQ:`, id);
    
    const deletedFaq = await Faq.findByIdAndDelete(id);
    
    if (!deletedFaq) {
      console.log(`[${requestId}] FAQ not found:`, id);
      return res.status(404).json({
        error: "لم يتم العثور على السؤال",
        requestId
      });
    }
    
    console.log(`[${requestId}] FAQ deleted successfully:`, deletedFaq);
    
    // Get updated count
    const count = await Faq.countDocuments();
    
    res.json({
      message: "تم حذف السؤال بنجاح",
      faq: deletedFaq,
      totalFAQs: count,
      requestId
    });
    
  } catch (error) {
    console.error(`[${requestId}] Error deleting FAQ:`, error);
    
    // Handle cast errors (invalid ID format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        error: "معرف السؤال غير صالح",
        requestId
      });
    }
    
    // Handle other errors
    res.status(500).json({
      error: "حدث خطأ أثناء حذف السؤال",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId
    });
  }
});

module.exports = router;
