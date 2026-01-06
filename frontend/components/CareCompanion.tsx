import React, { useState, useEffect, useRef } from 'react';

const GEMINI_API_KEY = "AIzaSyB8q1eEM25oXW-p3jSJCQYJIngD6zsYzwk";

const CARE_COMPANION_PROMPT = `You are "CareCompanion", a supportive, non-clinical chatbot inside a Mental Healthcare Appointment System.

ROLE & SCOPE
- Your job is to provide general wellbeing support, encouragement, and practical self-care suggestions.
- You are NOT a therapist, counselor, or doctor. You MUST NOT diagnose, label conditions, or claim clinical authority.
- You MUST NOT provide medical advice, treatment plans, or medication guidance.
- Keep responses warm, respectful, and simple. Aim for 2 to 4 short sentences, optionally a small bullet list.

EMOTION AWARENESS
- Always detect the user's emotional tone from their words.
- Reflect and validate feelings (e.g., "That sounds really heavy" / "I'm sorry you're going through that").
- Ask one gentle follow-up question if useful (e.g., "Do you want to talk about what triggered it?").

SAFETY RULES (VERY IMPORTANT)
- If the user mentions self-harm, suicide, wanting to die, or harming others:
  1) Respond with empathy and urgency.
  2) Encourage immediate real-world help and provide crisis options.
  3) Ask if they are in immediate danger right now.
  4) Do NOT continue normal chatting or questionnaires until safety is addressed.
  5) Do NOT provide methods or detailed self-harm instructions.

CRISIS OPTIONS (Malaysia)
- If immediate danger: call local emergency services (999).
- Encourage contacting Malaysia's mental health crisis line HEAL 15555 (8am–12am daily) and/or Befrienders KL 03-76272929 (24 hours).

QUESTIONNAIRE OFFER (SCREENING ONLY, NOT DIAGNOSIS)
- If you detect negative feelings (sad, anxious, overwhelmed, hopeless, "not going well", etc.) and it is NOT an immediate crisis:
  - Offer: "Would you like to do a quick self-check questionnaire to benchmark how you're feeling?"
  - Give two options: PHQ-9 (mood/depression screening) or DASS-21 (depression/anxiety/stress screening).
  - Make it clear: these are screening tools and not a diagnosis.
  - If the user agrees, ask questions one-by-one, track answers, calculate the score, and provide a brief, non-diagnostic interpretation.
  - If scores suggest higher distress, suggest booking an appointment through the system.

PRIVACY
- Do not request personal identifiers (IC number, full address, etc.).
- If user shares sensitive info, acknowledge and encourage using the appointment system for professional support.`;

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const CareCompanion = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm CareCompanion, your supportive wellbeing companion. I'm here to listen and offer gentle support. How are you feeling today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const callGeminiAI = async (userMessage) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${CARE_COMPANION_PROMPT}\n\nUser message: ${userMessage}`
              }]
            }]
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Gemini API Error:", data);
        return "I'm having trouble connecting right now. Please try again in a moment.";
      }

      if (data.candidates && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I'm having trouble processing that right now. Could you try rephrasing?";
      }

    } catch (error) {
      console.error("Network Error:", error);
      return "I'm experiencing connection issues. Please try again.";
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const botResponseText = await callGeminiAI(userMsg.text);
    
    const botMsg = { id: Date.now() + 1, text: botResponseText, sender: 'bot' };
    setMessages((prev) => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl flex flex-col border border-slate-200 mb-4 animate-fade-in-up overflow-hidden">
          {/* Header */}
          <div className="bg-brand-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-semibold text-sm">CareCompanion</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-brand-700 p-1 rounded">
              <CloseIcon />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none p-3 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
              placeholder="Share how you're feeling..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={isTyping}
              className={`text-white p-2 rounded-full transition-colors shadow-md ${
                isTyping ? 'bg-slate-400 cursor-not-allowed' : 'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              <SendIcon />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'bg-slate-700 rotate-90' : 'bg-brand-600'
        } text-white p-4 rounded-full shadow-lg hover:shadow-brand-500/30 transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};

export default CareCompanion;