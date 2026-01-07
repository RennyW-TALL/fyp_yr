import React, { useState, useEffect, useRef } from 'react';

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
  const [conversationStep, setConversationStep] = useState(0);
  const messagesEndRef = useRef(null);

  const staticConversation = [
    {
      userInput: "Ugh, I'm feelin' so sad and depressed.",
      botResponse: "I'm really sorry you're feeling this way. It sounds like you're going through a tough time."
    },
    {
      userInput: "Everything's just falling apart, like nothing's going right.",
      botResponse: "That sounds really heavy. I'm sorry you're going through that. Would you like to talk about what's been going on?"
    },
    {
      userInput: "I dunno, it just feels like nothing ever works out.",
      botResponse: "It must be overwhelming to feel like things aren't going well. It's okay to feel that way sometimes."
    },
    {
      userInput: "I can't handle anything anymore, it's too much.",
      botResponse: "It's important to be gentle with yourself when you feel this way. Life can get overwhelming, but taking small steps can really help."
    },
    {
      userInput: "I don't even think anything will work, though.",
      botResponse: "It can be hard to believe in self-care when you're feeling down, but even small actions can make a difference. Would you like some self-care tips to ease the stress?"
    },
    {
      userInput: "What's this questionnaire thing?",
      botResponse: "It's a short screening tool to help understand your mood. It's not a diagnosis, but it might give you a sense of where you are emotionally. If you're interested, I can provide more details, or you can check it out on a separate page."
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || conversationStep >= staticConversation.length) return;

    const userMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Add bot response after a short delay
    setTimeout(() => {
      const botMsg = { 
        id: Date.now() + 1, 
        text: staticConversation[conversationStep].botResponse, 
        sender: 'bot' 
      };
      setMessages((prev) => [...prev, botMsg]);
      setConversationStep(prev => prev + 1);
    }, 1000);
  };

  const getPlaceholderText = () => {
    if (conversationStep < staticConversation.length) {
      return staticConversation[conversationStep].userInput;
    }
    return "Continue the conversation...";
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
            {/* Typing Indicator - removed since we're using static responses */}
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
            />
            <button
              type="submit"
              className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-full transition-colors shadow-md"
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