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
    
    // Validate request
    if (!req.body) {
      console.log("Missing request body");
      return res.status(400).json({ error: "يرجى تقديم سؤال" });
    }
    
    if (!req.body.question) {
      console.log("Missing question in request body");
      return res.status(400).json({ error: "يرجى تقديم سؤال" });
    }

    console.log("Question before processing:", req.body.question);
    console.log("Question type:", typeof req.body.question);
    
    // Ensure question is a string
    let question = "";
    try {
      if (typeof req.body.question === 'string') {
        question = req.body.question.trim();
      } else {
        question = String(req.body.question).trim();
      }
    } catch (stringError) {
      console.error("Error converting question to string:", stringError);
      return res.status(400).json({ error: "صيغة السؤال غير صحيحة" });
    }
    
    console.log("Processing question:", question);
    
    // تجربة مع سؤال ثابت للاختبار
    if (question === "test") {
      console.log("Test question detected, returning default answer");
      return res.json({ answer: "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة." });
    }

    // البحث في قاعدة البيانات
    try {
      // Search for the best matching FAQ
      console.log("Searching for best matching FAQ...");
      
      // Find similar questions in the database
      const faqs = await Faq.find({});
      console.log(`Found ${faqs.length} FAQs in database`);
      
      // Try to find an exact match first
      const exactMatch = faqs.find(faq => 
        faq.question.toLowerCase() === question.toLowerCase()
      );
      
      if (exactMatch) {
        console.log("Exact match found:", exactMatch.question);
        return res.json({ answer: exactMatch.answer });
      }
      
      // If no exact match, try partial match
      const partialMatch = faqs.find(faq => 
        faq.question.toLowerCase().includes(question.toLowerCase()) ||
        question.toLowerCase().includes(faq.question.toLowerCase())
      );
      
      if (partialMatch) {
        console.log("Partial match found:", partialMatch.question);
        return res.json({ answer: partialMatch.answer });
      }

      // لم يتم العثور على إجابة
      console.log("No match found, returning default answer");
      return res.json({ answer: "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة." });
    } catch (dbError) {
      console.error("Database error:", dbError);
      console.error("Database error stack:", dbError.stack);
      return res.status(500).json({ error: "خطأ في قاعدة البيانات" });
    }
  } catch (error) {
    console.error("General error in /faq/ask:", error);
    console.error("General error stack:", error.stack);
    return res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// إضافة طريقة للتحقق من حالة الخادم
router.get("/status", (req, res) => {
  try {
    return res.json({ status: "ok", message: "الخادم يعمل بشكل صحيح" });
  } catch (error) {
    console.error("Error in status check:", error);
    return res.status(500).json({ error: "خطأ في الخادم" });
  }
});

// للتوافق مع chat.jsx
router.post("/", async (req, res) => {
  try {
    console.log("POST / route hit");
    console.log("Request body:", req.body);
    
    if (!req.body || !req.body.question) {
      console.log("Missing question in request body");
      return res.status(400).json({ error: "يرجى تقديم سؤال" });
    }
    
    const { question } = req.body;
    console.log("Processing question:", question);

    // البحث في الأسئلة والأجوبة بدون استخدام التعبيرات النمطية
    console.log("Searching for FAQs without regex");
    const allFaqs = await Faq.find({});
    console.log(`Found ${allFaqs.length} total FAQs`);
    
    // البحث اليدوي عن تطابق جزئي
    let faq = null;
    
    // تجنب استخدام toLowerCase() مع النصوص العربية
    for (const item of allFaqs) {
      // استخدام includes مباشرة بدون تحويل الحالة
      if (item.question.includes(question) || 
          item.answer.includes(question)) {
        faq = item;
        console.log("Found matching FAQ:", faq.question);
        break;
      }
    }

    console.log("Search result:", faq);
    
    if (faq) {
      res.json({ answer: faq.answer });
    } else {
      res.json({ answer: "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة." });
    }
  } catch (error) {
    console.error("Error in POST /:", error);
    res.status(500).json({ error: "خطأ في الخادم. حاول مرة أخرى." });
  }
});

// استرجاع جميع الأسئلة الشائعة
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (error) {
    console.error("Error fetching all FAQs:", error);
    res.status(500).json({ error: "خطأ في استرجاع الأسئلة الشائعة" });
  }
});

// إضافة سؤال جديد - Handle both with and without trailing slash
const addFaqHandler = async (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 9);
  console.log(`\n=== [${requestId}] ADD FAQ HANDLER STARTED ===`);
  console.log(`[${requestId}] Request Method: ${req.method} ${req.originalUrl}`);
  console.log(`[${requestId}] Request Headers:`, JSON.stringify(req.headers));
  console.log(`[${requestId}] Request Body:`, JSON.stringify(req.body));
  
  try {
    console.log(`[${requestId}] Mongoose connection state:`, mongoose.connection.readyState);
    console.log(`[${requestId}] Mongoose models:`, mongoose.modelNames());
    
    // Check if Faq model is registered
    if (!mongoose.modelNames().includes('Faq')) {
      console.error(`[${requestId}] FATAL: Faq model is not registered!`);
      return res.status(500).json({ 
        error: "خطأ في تهيئة النظام",
        requestId,
        details: "Faq model not registered"
      });
    }
    
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      console.error(`[${requestId}] Validation Error: Missing question or answer`);
      return res.status(400).json({ 
        error: "يجب توفير السؤال والإجابة",
        requestId,
        receivedData: { question, answer }
      });
    }
    
    console.log(`[${requestId}] Creating new FAQ with:`, { 
      question: typeof question, 
      answer: typeof answer,
      questionLength: question?.length,
      answerLength: answer?.length
    });
    
    const newFaq = new Faq({
      question: question.toString().trim(),
      answer: answer.toString().trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log(`[${requestId}] Attempting to save FAQ to database...`);
    console.log(`[${requestId}] MongoDB URL:`, process.env.MONGODB_URI ? 'Using provided URI' : 'Using default localhost');
    
    try {
      console.log(`[${requestId}] Before save - Checking connection...`);
      
      // Get current collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`[${requestId}] Available collections:`, collections.map(c => c.name));
      
      // Check if 'faqs' collection exists
      const faqCollectionExists = collections.some(c => c.name === 'faqs' || c.name === 'Faq' || c.name === 'faq');
      console.log(`[${requestId}] FAQ collection exists:`, faqCollectionExists);
      
      if (mongoose.connection.readyState !== 1) {
        console.error(`[${requestId}] MongoDB not connected! Attempting to reconnect...`);
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot", {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }
      
      // Log the document to be saved
      console.log(`[${requestId}] Document to save:`, JSON.stringify(newFaq, null, 2));
      
      console.log(`[${requestId}] Calling save()...`);
      const savedFaq = await newFaq.save();
      console.log(`[${requestId}] FAQ saved successfully:`, savedFaq);
      
      // Verify the FAQ was saved by querying the database
      console.log(`[${requestId}] Verifying save by querying database...`);
      const foundFaq = await Faq.findById(savedFaq._id);
      
      if (!foundFaq) {
        console.error(`[${requestId}] Error: FAQ not found after save!`);
        return res.status(500).json({ 
          error: "فشل في حفظ السؤال",
          requestId,
          details: "تم الحفظ ولكن لا يمكن العثور على السؤال بعد الحفظ"
        });
      }
      
      console.log(`[${requestId}] Verified FAQ in database:`, foundFaq);
      
      // Get updated count
      const count = await Faq.countDocuments();
      console.log(`[${requestId}] Total FAQs in database:`, count);
      
      return res.status(201).json({
        ...savedFaq.toObject(),
        requestId,
        totalFAQs: count
      });
      
    } catch (saveError) {
      console.error(`[${requestId}] Database Save Error:`, saveError);
      console.error(`[${requestId}] Error details:`, {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        stack: saveError.stack
      });
      
      if (saveError.name === 'ValidationError') {
        return res.status(400).json({ 
          error: "بيانات غير صالحة",
          requestId,
          details: saveError.message,
          errors: saveError.errors
        });
      }
      
      // Handle MongoDB connection errors
      if (saveError.name === 'MongoServerError') {
        return res.status(503).json({
          error: "خطأ في الاتصال بقاعدة البيانات",
          requestId,
          details: saveError.message,
          code: saveError.code
        });
      }
      
      // Handle duplicate key errors
      if (saveError.code === 11000) {
        return res.status(409).json({
          error: "هذا السؤال موجود بالفعل",
          requestId,
          details: "يوجد سؤال مشابه موجود مسبقاً"
        });
      }
      
      // General error handler
      return res.status(500).json({
        error: "حدث خطأ غير متوقع",
        requestId,
        details: process.env.NODE_ENV === 'development' ? saveError.message : undefined
      });
    }
    
  } catch (error) {
    console.error("Unexpected Error in addFaqHandler:", error);
    
    // Check if this is a MongoDB connection error
    if (error.name === 'MongoServerError') {
      console.error("MongoDB Server Error:", error);
      return res.status(503).json({ 
        error: "خطأ في الاتصال بقاعدة البيانات",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    
    res.status(500).json({ 
      error: "حدث خطأ غير متوقع",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    console.log("=== ADD FAQ HANDLER COMPLETED ===\n");
  }
};

// Register FAQ creation route (protected)
router.post("/", addFaqHandler);
    });
    
    try {
      console.log(`[${requestId}] Attempting to save FAQ to database...`);
      
      // Get current collections
      const collections = await mongoose.connection.db.listCollections().toArray();
      console.log(`[${requestId}] Available collections:`, collections.map(c => c.name));
      
      // Check if 'faqs' collection exists
      const faqCollectionExists = collections.some(c => c.name === 'faqs' || c.name === 'Faq' || c.name === 'faq');
      console.log(`[${requestId}] FAQ collection exists:`, faqCollectionExists);
      
      // Ensure we're connected to the database
      if (mongoose.connection.readyState !== 1) {
        console.error(`[${requestId}] MongoDB not connected! Attempting to reconnect...`);
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/architectbot", {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }
      
      // Save the FAQ
      console.log(`[${requestId}] Saving FAQ...`);
      const savedFaq = await newFaq.save();
      console.log(`[${requestId}] FAQ saved successfully:`, savedFaq);
      
      // Verify the FAQ was saved by querying the database
      console.log(`[${requestId}] Verifying save by querying database...`);
      const foundFaq = await Faq.findById(savedFaq._id);
      
      if (!foundFaq) {
        console.error(`[${requestId}] Error: FAQ not found after save!`);
        return res.status(500).json({ 
          error: "فشل في حفظ السؤال",
          requestId,
          details: "تم الحفظ ولكن لا يمكن العثور على السؤال بعد الحفظ"
        });
      }
      
      console.log(`[${requestId}] Verified FAQ in database:`, foundFaq);
      
      // Get updated count
      const count = await Faq.countDocuments();
      console.log(`[${requestId}] Total FAQs in database:`, count);
      
      return res.status(201).json({
        ...foundFaq.toObject(),
        requestId,
        totalFAQs: count
      });
      
    } catch (saveError) {
      console.error(`[${requestId}] Database Save Error:`, saveError);
      console.error(`[${requestId}] Error details:`, {
        name: saveError.name,
        message: saveError.message,
        code: saveError.code,
        stack: saveError.stack
      });
      
      if (saveError.name === 'ValidationError') {
        return res.status(400).json({ 
          error: "بيانات غير صالحة",
          requestId,
          details: saveError.message,
          errors: saveError.errors
        });
      }
      
      // Handle MongoDB connection errors
      if (saveError.name === 'MongoServerError') {
        return res.status(503).json({
          error: "خطأ في الاتصال بقاعدة البيانات",
          requestId,
          details: saveError.message,
          code: saveError.code
        });
      }
      
      // Handle duplicate key errors
      if (saveError.code === 11000) {
        return res.status(409).json({
          error: "هذا السؤال موجود بالفعل",
          requestId,
          details: "يوجد سؤال مشابه موجود مسبقاً"
        });
      }
      
      // General error handler
      return res.status(500).json({
        error: "حدث خطأ غير متوقع",
        requestId,
        details: process.env.NODE_ENV === 'development' ? saveError.message : undefined
      });
    }
    
  } catch (error) {
    console.error(`[${requestId || 'UNKNOWN'}] Error in FAQ creation route:`, error);
    return res.status(500).json({
      error: "حدث خطأ غير متوقع",
      requestId: requestId || 'UNKNOWN',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// تحديث سؤال موجود
const updateFaqHandler = async (req, res) => {
  try {
    console.log(`Update FAQ ${req.params.id} request body:`, req.body);
    
    const { question, answer } = req.body;
    
    if (!question || !answer) {
      console.log("Missing question or answer in update request");
      return res.status(400).json({ error: "يجب توفير السؤال والإجابة" });
    }
    
    console.log(`Updating FAQ ${req.params.id} with:`, { question, answer });
    const updatedFaq = await Faq.findByIdAndUpdate(
      req.params.id,
      { 
        question: question.trim(), 
        answer: answer.trim() 
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedFaq) {
      console.log(`FAQ with ID ${req.params.id} not found`);
      return res.status(404).json({ error: "السؤال غير موجود" });
    }
    
    console.log("FAQ updated successfully:", updatedFaq);
    res.json(updatedFaq);
  } catch (error) {
    console.error("Error updating FAQ:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: "بيانات غير صالحة",
        details: error.message 
      });
    } else if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "معرّف السؤال غير صالح"
      });
    }
    res.status(500).json({ 
      error: "خطأ في تحديث السؤال الشائع",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register the route with both with and without trailing slash
router.put("/:id", updateFaqHandler);
router.put("/:id/", updateFaqHandler);

// حذف سؤال
const deleteFaqHandler = async (req, res) => {
  try {
    console.log(`Delete FAQ request for ID: ${req.params.id}`);
    
    const deletedFaq = await Faq.findByIdAndDelete(req.params.id);
    
    if (!deletedFaq) {
      console.log(`FAQ with ID ${req.params.id} not found for deletion`);
      return res.status(404).json({ error: "السؤال غير موجود" });
    }
    
    console.log("FAQ deleted successfully:", deletedFaq);
    res.json({ 
      message: "تم حذف السؤال بنجاح",
      deletedFaqId: deletedFaq._id
    });
  } catch (error) {
    console.error("Error deleting FAQ:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        error: "معرّف السؤال غير صالح"
      });
    }
    res.status(500).json({ 
      error: "خطأ في حذف السؤال الشائع",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Register the route with both with and without trailing slash
router.delete("/:id", deleteFaqHandler);
router.delete("/:id/", deleteFaqHandler);

module.exports = router;
