import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Paperclip,
  Trash2,
  FileText,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import BackendNotice from '../../components/common/BackendNotice';

export const AIAssistantPage = () => {
  const messageCounterRef = useRef(10);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: "Hello! I'm StudentAI, your academic portal assistant. I can assist you with your curriculum, algorithm explanations, attendance guidelines, and exam schedules. How can I help you today?",
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedPrompts = [
    'Explain the Facenet512 Euclidean distance threshold',
    'Summarize Dynamic Programming vs Divide & Conquer',
    'What is the university minimum attendance requirement?',
    'How do I calculate CGPA from credit points?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    messageCounterRef.current += 1;
    const userMsg = {
      id: messageCounterRef.current,
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulated academic AI response
    setTimeout(() => {
      let reply = '';
      const lower = text.toLowerCase();

      if (lower.includes('facenet') || lower.includes('threshold') || lower.includes('face')) {
        reply =
          'In StudentAI biometrics, Facenet512 outputs 512-dimensional L2-normalized embeddings. The default DeepFace Euclidean distance threshold for Facenet512 is 0.30. When distance <= 0.30, the faces are verified as the same identity. In your testing, a distance of 0.389 was observed, requiring image lighting alignment or threshold calibration before production deployment.';
      } else if (lower.includes('attendance') || lower.includes('75%')) {
        reply =
          'University academic regulation stipulates a strict 75% minimum attendance requirement per registered course to be eligible for end-semester examinations. Medical concessions may permit up to 65% subject to Dean of Academic Affairs approval.';
      } else if (lower.includes('dynamic programming') || lower.includes('divide')) {
        reply =
          'Dynamic Programming (DP) solves optimization problems with overlapping subproblems and optimal substructure by storing intermediate solutions (memoization/tabulation). In contrast, Divide & Conquer solves independent subproblems (such as Merge Sort) without caching.';
      } else if (lower.includes('cgpa') || lower.includes('grade')) {
        reply =
          'CGPA = (Sum of [Course Credits × Grade Points]) / (Total Enrolled Credits). A letter grade of A+ corresponds to 10 points, A to 9 points, B+ to 8 points, and B to 7 points.';
      } else {
        reply = `I have received your inquiry: "${text}". Backend Gemini API and RAG syllabus document retrieval endpoints are scheduled for the next backend phase.`;
      }

      messageCounterRef.current += 1;
      setMessages((prev) => [
        ...prev,
        {
          id: messageCounterRef.current,
          sender: 'assistant',
          text: reply,
          time: 'Just now',
        },
      ]);
      setIsTyping(false);
    }, 750);
  };

  const handleClearChat = () => {
    messageCounterRef.current += 1;
    setMessages([
      {
        id: messageCounterRef.current,
        sender: 'assistant',
        text: 'Chat history cleared. How can I help with your studies today?',
        time: 'Just now',
      },
    ]);
  };

  return (
    <div className="ai-assistant-page">
      <div className="page-header-row">
        <div>
          <h2>AI Academic Assistant</h2>
          <p>Contextual academic questions, syllabus lookup, and course assistance</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Trash2}
          onClick={handleClearChat}
        >
          Clear Chat
        </Button>
      </div>

      <BackendNotice
        status="BACKEND REQUIRED"
        endpoint="POST /api/ai/chat & /api/ai/rag-search"
        description="AI Assistant interface scaffold. Backend Gemini LLM integration, prompt filtering, and RAG document embeddings pipeline are pending backend development."
      />

      <div className="ai-chat-layout mt-4">
        {/* Main Chat Panel */}
        <div className="ai-chat-main">
          {/* Messages list */}
          <div className="chat-messages-container">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble-row ${m.sender === 'user' ? 'bubble-user' : 'bubble-bot'}`}
              >
                <div className="bubble-avatar">
                  {m.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className="bubble-content">
                  <div className="bubble-text">{m.text}</div>
                  <span className="bubble-timestamp">{m.time}</span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-bubble-row bubble-bot">
                <div className="bubble-avatar">
                  <Bot size={16} />
                </div>
                <div className="bubble-content">
                  <div className="typing-indicator">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="chat-prompt-chips">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                <Sparkles size={12} />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          {/* Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chat-composer-row"
          >
            <input
              type="text"
              placeholder="Ask an academic question or request syllabus help..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="chat-input"
            />
            <Button
              type="submit"
              variant="primary"
              disabled={!inputText.trim()}
              icon={Send}
            >
              Send
            </Button>
          </form>
        </div>

        {/* Sidebar: Document RAG Context */}
        <div className="ai-chat-sidebar">
          <Card title="Academic Knowledge Base" subtitle="RAG Document Context">
            <div className="knowledge-file-list">
              <div className="knowledge-file-item">
                <FileText size={16} className="text-blue-500" />
                <div>
                  <strong>CS301_Syllabus.pdf</strong>
                  <span>Unit 1-5 • Algorithms & Complexity</span>
                </div>
              </div>
              <div className="knowledge-file-item">
                <FileText size={16} className="text-blue-500" />
                <div>
                  <strong>University_Ordinance_2026.pdf</strong>
                  <span>Attendance, grading & exams</span>
                </div>
              </div>
              <div className="knowledge-file-item">
                <FileText size={16} className="text-blue-500" />
                <div>
                  <strong>DeepFace_FaceNet512_Docs.pdf</strong>
                  <span>Biometric parameters & distance</span>
                </div>
              </div>
            </div>

            <div className="rag-upload-preview mt-4">
              <span className="text-xs text-gray-500 block mb-2 font-medium">
                Upload New Course PDF:
              </span>
              <Button variant="outline" size="sm" icon={Paperclip} className="w-full">
                Upload Syllabus Document
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;
