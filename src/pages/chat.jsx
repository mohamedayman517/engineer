import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/animations.css";

function Chat() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "مرحباً! أنا ArchiBot. اسألني أي سؤال أو اختر من الأسئلة الشائعة أدناه:",
    },
  ]);
  const [input, setInput] = useState("");
  const [showQuestions, setShowQuestions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const questionsPerPage = 6;

  // Fetch FAQs from the database
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/faq');
        if (response.data && Array.isArray(response.data)) {
          setFaqs(response.data);
        } else {
          console.error('Unexpected response format:', response.data);
          setFaqs([]);
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('فشل تحميل الأسئلة الشائعة. يرجى المحاولة مرة أخرى لاحقاً.');
        setFaqs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  // Get current questions
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = faqs.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(faqs.length / questionsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Handle question click
  const handleQuestionClick = (question) => {
    setInput(question);
    sendMessage(question);
  };

  const sendMessage = async (questionText = null) => {
    const question = questionText || input;
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setMessages((prev) => [...prev, userMessage]);
    setShowQuestions(false); // إخفاء الأسئلة بعد إرسال أول سؤال

    try {
      const res = await axios.post("/api/faq/search", {
        question: question,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.data.answer || "عذراً، لا أعرف إجابة هذا السؤال. يمكنك التواصل معي مباشرة.",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "حدث خطأ في الخادم. حاول مرة أخرى." },
      ]);
    }

    setInput("");
  };

  return (
    <div className="chat-page position-relative overflow-hidden" style={{ marginTop: '80px' }}>
      {/* Animated Background */}
      <div
        className="position-fixed w-100 h-100"
        style={{ top: 0, left: 0, zIndex: -1 }}
      >
        {/* Gradient Background */}
        <div className="animate-gradient position-absolute w-100 h-100"></div>

        {/* Floating Buildings */}
        <div
          className="position-absolute animate-float stagger-1"
          style={{ top: "10%", left: "5%" }}
        >
          <i
            className="fas fa-building text-white-50"
            style={{ fontSize: "4rem", opacity: 0.1 }}
          ></i>
        </div>
        <div
          className="position-absolute animate-float stagger-2"
          style={{ top: "20%", right: "10%" }}
        >
          <i
            className="fas fa-city text-white-50"
            style={{ fontSize: "3.5rem", opacity: 0.1 }}
          ></i>
        </div>
        <div
          className="position-absolute animate-float stagger-3"
          style={{ top: "40%", left: "15%" }}
        >
          <i
            className="fas fa-home text-white-50"
            style={{ fontSize: "3rem", opacity: 0.1 }}
          ></i>
        </div>
        <div
          className="position-absolute animate-float stagger-4"
          style={{ top: "60%", right: "5%" }}
        >
          <i
            className="fas fa-mosque text-white-50"
            style={{ fontSize: "3.5rem", opacity: 0.1 }}
          ></i>
        </div>
        <div
          className="position-absolute animate-float stagger-5"
          style={{ top: "70%", left: "8%" }}
        >
          <i
            className="fas fa-university text-white-50"
            style={{ fontSize: "3rem", opacity: 0.1 }}
          ></i>
        </div>
        <div
          className="position-absolute animate-float stagger-6"
          style={{ top: "30%", right: "20%" }}
        >
          <i
            className="fas fa-warehouse text-white-50"
            style={{ fontSize: "2.5rem", opacity: 0.1 }}
          ></i>
        </div>

        {/* Geometric Shapes */}
        <div
          className="position-absolute animate-building-rise stagger-2"
          style={{ top: "15%", left: "25%" }}
        >
          <div
            style={{
              width: "60px",
              height: "80px",
              background: "rgba(255,255,255,0.05)",
              transform: "rotate(15deg)",
              borderRadius: "8px",
            }}
          ></div>
        </div>
        <div
          className="position-absolute animate-building-rise stagger-4"
          style={{ top: "50%", right: "25%" }}
        >
          <div
            style={{
              width: "40px",
              height: "60px",
              background: "rgba(255,255,255,0.05)",
              transform: "rotate(-10deg)",
              borderRadius: "6px",
            }}
          ></div>
        </div>

        {/* Blueprint Lines */}
        <svg
          className="position-absolute w-100 h-100"
          style={{ opacity: 0.03 }}
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Header */}
      <section className="py-4 bg-transparent text-white position-relative">
        <div className="container text-center">
          <h2 className="display-5 fw-bold animate-fade-in-up text-shadow">
            💬 محادثة مع ArchiBot
          </h2>
          <p className="lead animate-fade-in-up stagger-2 text-shadow">
            اسأل أي سؤال عن الخدمات المعمارية والتصميم
          </p>
        </div>
      </section>

      <div
        className="container py-4 position-relative"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="rounded p-4 mb-3 shadow-lg animate-fade-in-up"
          style={{
            height: "400px",
            overflowY: "auto",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(15px)",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "20px",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`text-${
                msg.sender === "user" ? "end" : "start"
              } mb-2 chat-message-enter`}
            >
              <span
                className={`d-inline-block p-3 rounded shadow-sm hover-lift ${
                  msg.sender === "user" ? "text-white" : "bg-white text-dark"
                }`}
                style={{
                  background:
                    msg.sender === "user"
                      ? "linear-gradient(45deg, #007bff, #0056b3)"
                      : "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(5px)",
                  border:
                    msg.sender === "user"
                      ? "1px solid rgba(255, 255, 255, 0.2)"
                      : "1px solid rgba(0, 0, 0, 0.1)",
                  maxWidth: "80%",
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}

          {/* الأسئلة الشائعة */}
          {showQuestions && (
            <div
              className="mt-3 p-4 rounded shadow-lg animate-fade-in-up"
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(15px)",
                border: "2px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="text-white text-shadow fw-bold mb-0">
                  <i className="fas fa-question-circle me-2 text-warning"></i>
                  الأسئلة الشائعة:
                </h6>
                <button
                  className="btn btn-sm hover-lift"
                  onClick={() => setShowQuestions(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.2)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "white",
                    borderRadius: "8px",
                    padding: "5px 10px",
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="row">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p className="mt-2 text-white-50">جاري تحميل الأسئلة...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                ) : faqs.length === 0 ? (
                  <div className="alert alert-info text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    لا توجد أسئلة متاحة حالياً
                  </div>
                ) : (
                  currentQuestions.map((faq, idx) => (
                    <div key={faq._id || idx} className="col-md-6 mb-3">
                      <button
                        className="btn btn-sm w-100 text-start hover-lift pulse-on-hover fw-medium"
                        onClick={() => handleQuestionClick(faq.question)}
                        style={{
                          fontSize: "0.9rem",
                          whiteSpace: "normal",
                          textAlign: "right",
                          background: "linear-gradient(45deg, #007bff, #0056b3)",
                          backdropFilter: "blur(10px)",
                          border: "2px solid rgba(255, 255, 255, 0.4)",
                          color: "white",
                          padding: "12px 16px",
                          borderRadius: "12px",
                          boxShadow: "0 4px 15px rgba(0, 123, 255, 0.3)",
                        }}
                      >
                        <i className="fas fa-arrow-left me-2 text-warning"></i>
                        {faq.question}
                      </button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination */}
              {faqs.length > questionsPerPage && (
                <div className="d-flex justify-content-center mt-3">
                  <nav aria-label="Page navigation">
                    <ul className="pagination pagination-sm">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={prevPage}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            margin: '0 2px',
                            borderRadius: '8px'
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </li>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <li key={number} className="page-item">
                          <button 
                            className={`page-link ${currentPage === number ? 'active' : ''}`}
                            onClick={() => paginate(number)}
                            style={{
                              background: currentPage === number 
                                ? 'linear-gradient(45deg, #007bff, #0056b3)' 
                                : 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: currentPage === number ? 'white' : 'rgba(255, 255, 255, 0.8)',
                              margin: '0 2px',
                              borderRadius: '8px',
                              minWidth: '32px',
                              textAlign: 'center'
                            }}
                          >
                            {number}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={nextPage}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            margin: '0 2px',
                            borderRadius: '8px'
                          }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="d-flex gap-3 mb-3">
          <input
            className="form-control shadow-lg custom-input"
            placeholder="اكتب سؤالك هنا..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={{
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "25px",
              padding: "15px 25px",
              color: "white",
              fontSize: "16px",
              fontWeight: "500",
            }}
          />
          <button
            className="btn shadow-lg hover-lift fw-bold"
            onClick={() => sendMessage()}
            style={{
              background: "linear-gradient(45deg, #28a745, #20c997)",
              backdropFilter: "blur(10px)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              color: "white",
              borderRadius: "20px",
              padding: "15px 25px",
              boxShadow: "0 4px 15px rgba(40, 167, 69, 0.3)",
            }}
          >
            <i className="fas fa-paper-plane me-2"></i>
            إرسال
          </button>
          {!showQuestions && (
            <button
              className="btn shadow-sm hover-lift pulse-on-hover fw-bold"
              onClick={() => setShowQuestions(true)}
              title="إظهار الأسئلة الشائعة"
              style={{
                background: "linear-gradient(45deg, #ffc107, #ff8c00)",
                backdropFilter: "blur(10px)",
                border: "2px solid rgba(255, 255, 255, 0.4)",
                color: "white",
                borderRadius: "12px",
                padding: "10px 15px",
              }}
            >
              <i className="fas fa-question-circle me-1"></i>
              أسئلة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
