import { useState } from "react";
import axios from "axios";

function ChatBot() {
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([
    {
      from: "bot",
      text: "مرحباً! أنا ArchiBot. اختر سؤالاً من الأسئلة الشائعة أو اكتب سؤالك:",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);

  // الأسئلة الشائعة
  const commonQuestions = [
    "ما هي الخدمات التي تقدمها؟",
    "كم تكلفة التصميم لمشروع صغير؟",
    "ما هي مواعيد العمل؟",
    "هل تقدم استشارات مجانية؟",
    "كم يستغرق تسليم التصميم؟",
    "هل تقدم رسومات ثلاثية الأبعاد؟",
  ];

  const handleSend = async (questionText = null) => {
    const currentQuestion = questionText || question;
    if (!currentQuestion.trim()) return;

    const userMessage = { from: "user", text: currentQuestion };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);
    setShowQuestions(false); // إخفاء الأسئلة بعد إرسال أول سؤال

    try {
      const res = await axios.post("/api/faq/search", {
        question: currentQuestion,
      });
      const botMessage = { from: "bot", text: res.data.answer || "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة." };
      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        from: "bot",
        text: "حدث خطأ أثناء الاتصال بالخادم.",
      };
      setChat((prev) => [...prev, errorMessage]);
    }

    setQuestion("");
    setLoading(false);
  };

  const handleQuestionClick = (questionText) => {
    handleSend(questionText);
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h4 className="mb-4 text-center">🤖 مهندس معماري - شات بوت</h4>

      <div
        className="border rounded p-3 mb-3"
        style={{ minHeight: "300px", background: "#f9f9f9" }}
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-${msg.from === "user" ? "end" : "start"}`}
          >
            <span
              className={`d-inline-block p-2 rounded ${
                msg.from === "user"
                  ? "bg-primary text-white"
                  : "bg-light text-dark"
              }`}
              style={{ maxWidth: "80%" }}
            >
              {msg.text}
            </span>
          </div>
        ))}

        {loading && (
          <div className="text-start text-muted">
            <span className="spinner-border spinner-border-sm me-2"></span>جاري
            الرد...
          </div>
        )}

        {/* الأسئلة الشائعة */}
        {showQuestions && (
          <div className="mt-3 p-3 bg-light rounded">
            <h6 className="text-primary mb-3">
              <i className="bi bi-question-circle"></i> الأسئلة الشائعة:
            </h6>
            <div className="row">
              {commonQuestions.map((questionText, idx) => (
                <div key={idx} className="col-md-6 mb-2">
                  <button
                    className="btn btn-outline-primary btn-sm w-100 text-start"
                    onClick={() => handleQuestionClick(questionText)}
                    style={{
                      fontSize: "0.8rem",
                      whiteSpace: "normal",
                      textAlign: "right",
                    }}
                  >
                    {questionText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="d-flex mb-2">
        <input
          type="text"
          className="form-control me-2"
          placeholder="اكتب سؤالك..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className="btn btn-primary me-2" onClick={handleSend}>
          إرسال
        </button>
        {!showQuestions && (
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowQuestions(true)}
            title="إظهار الأسئلة الشائعة"
          >
            ❓
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatBot;
