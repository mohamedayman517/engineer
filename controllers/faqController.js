const Faq = require("../models/Faq");

class FaqController {
  // جلب جميع الأسئلة الشائعة
  static async getAllFaqs(req, res) {
    try {
      console.log("📋 Fetching all FAQs");
      
      const faqs = await Faq.find({}).sort({ createdAt: -1 });
      
      console.log(`✅ Found ${faqs.length} FAQs`);
      
      res.json({
        success: true,
        count: faqs.length,
        data: faqs
      });

    } catch (error) {
      console.error("❌ Error fetching FAQs:", error);
      res.status(500).json({ 
        success: false,
        error: "حدث خطأ أثناء جلب الأسئلة الشائعة",
        message_ar: "حدث خطأ أثناء جلب الأسئلة الشائعة"
      });
    }
  }

  // البحث في الأسئلة الشائعة (للشات بوت)
  static async searchFaqs(req, res) {
    const requestId = Math.random().toString(36).substring(2, 8);
    console.log(`\n[${requestId}] 🔍 FAQ SEARCH REQUEST`);
    
    try {
      const { question } = req.body;
      
      console.log(`[${requestId}] Search query:`, question);
      
      if (!question || question.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "السؤال مطلوب",
          message_ar: "السؤال مطلوب"
        });
      }

      // البحث في الأسئلة والأجوبة
      const searchQuery = question.trim();
      const faqs = await Faq.find({
        $or: [
          { question: { $regex: searchQuery, $options: 'i' } },
          { answer: { $regex: searchQuery, $options: 'i' } },
          { keywords: { $in: [new RegExp(searchQuery, 'i')] } }
        ]
      }).limit(5);

      console.log(`[${requestId}] ✅ Found ${faqs.length} matching FAQs`);

      if (faqs.length === 0) {
        return res.json({
          success: true,
          found: false,
          message: "عذراً، لم أجد إجابة لسؤالك. يمكنك التواصل معنا مباشرة للحصول على المساعدة.",
          message_ar: "عذراً، لم أجد إجابة لسؤالك. يمكنك التواصل معنا مباشرة للحصول على المساعدة.",
          data: []
        });
      }

      // إرجاع أفضل إجابة
      const bestMatch = faqs[0];
      
      res.json({
        success: true,
        found: true,
        answer: bestMatch.answer,
        question: bestMatch.question,
        data: faqs.map(faq => ({
          id: faq._id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category
        }))
      });

    } catch (error) {
      console.error(`[${requestId}] ❌ Error in FAQ search:`, error);
      res.status(500).json({
        success: false,
        error: "حدث خطأ أثناء البحث",
        message_ar: "حدث خطأ أثناء البحث"
      });
    }
  }

  // إضافة سؤال جديد
  static async createFaq(req, res) {
    try {
      console.log("📝 Creating new FAQ:", req.body);
      
      const { question, answer, category, keywords } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          error: "السؤال والجواب مطلوبان",
          message_ar: "السؤال والجواب مطلوبان"
        });
      }

      const newFaq = new Faq({
        question: question.trim(),
        answer: answer.trim(),
        category: category || "عام",
        keywords: keywords || []
      });

      const savedFaq = await newFaq.save();
      
      console.log(`✅ FAQ created successfully: ${savedFaq.question}`);

      res.status(201).json({
        success: true,
        message: "تم إضافة السؤال بنجاح",
        message_ar: "تم إضافة السؤال بنجاح",
        data: savedFaq
      });

    } catch (error) {
      console.error("❌ Error creating FAQ:", error);
      
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(", "),
          message_ar: errors.join(", ")
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في إضافة السؤال",
        message_ar: "خطأ في إضافة السؤال"
      });
    }
  }

  // تحديث سؤال
  static async updateFaq(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      console.log(`📝 Updating FAQ ${id}:`, updateData);

      const updatedFaq = await Faq.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!updatedFaq) {
        return res.status(404).json({
          success: false,
          error: "السؤال غير موجود",
          message_ar: "السؤال غير موجود"
        });
      }
      
      console.log(`✅ FAQ updated successfully: ${updatedFaq.question}`);

      res.json({
        success: true,
        message: "تم تحديث السؤال بنجاح",
        message_ar: "تم تحديث السؤال بنجاح",
        data: updatedFaq
      });

    } catch (error) {
      console.error("❌ Error updating FAQ:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف السؤال غير صالح",
          message_ar: "معرف السؤال غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في تحديث السؤال",
        message_ar: "خطأ في تحديث السؤال"
      });
    }
  }

  // حذف سؤال
  static async deleteFaq(req, res) {
    try {
      const { id } = req.params;
      
      console.log(`🗑️ Deleting FAQ: ${id}`);

      const deletedFaq = await Faq.findByIdAndDelete(id);

      if (!deletedFaq) {
        return res.status(404).json({
          success: false,
          error: "السؤال غير موجود",
          message_ar: "السؤال غير موجود"
        });
      }
      
      console.log(`✅ FAQ deleted successfully: ${deletedFaq.question}`);

      res.json({
        success: true,
        message: "تم حذف السؤال بنجاح",
        message_ar: "تم حذف السؤال بنجاح"
      });

    } catch (error) {
      console.error("❌ Error deleting FAQ:", error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: "معرف السؤال غير صالح",
          message_ar: "معرف السؤال غير صالح"
        });
      }

      res.status(500).json({
        success: false,
        error: "خطأ في حذف السؤال",
        message_ar: "خطأ في حذف السؤال"
      });
    }
  }

  // فحص حالة الخدمة
  static async getStatus(req, res) {
    try {
      console.log("🔍 FAQ Status check");
      
      const faqCount = await Faq.countDocuments();
      
      res.json({
        success: true,
        status: "ok",
        message: "خدمة الأسئلة الشائعة تعمل بشكل صحيح",
        message_ar: "خدمة الأسئلة الشائعة تعمل بشكل صحيح",
        data: {
          totalFaqs: faqCount,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error("❌ Error checking FAQ status:", error);
      res.status(500).json({
        success: false,
        error: "خطأ في فحص حالة الخدمة",
        message_ar: "خطأ في فحص حالة الخدمة"
      });
    }
  }
}

module.exports = FaqController;
