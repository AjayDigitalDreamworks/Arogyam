import { useState, useEffect, useRef } from "react";

export default function CalmMindFullPage() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I'm CalmMind AI. I'm here to listen. How are you feeling today?",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);



  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userText = input;

  const userMessage = {
    sender: "user",
    text: userText,
    time: new Date().toLocaleTimeString(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userText }),
    });

    const data = await response.json();

    const botReply = {
      sender: "bot",
      text: data.reply,
      time: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, botReply]);
  } catch (error) {
    console.error("Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Something went wrong. Please try again later.",
        time: new Date().toLocaleTimeString(),
      },
    ]);
  }

  setIsTyping(false);
};

  const handleQuickMood = (moodText) => {
    setInput(moodText);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">

      {/* Header */}
      <div className="text-center py-6 border-b border-gray-200 bg-white/60 backdrop-blur-md">
        <h1 className="text-3xl font-semibold text-gray-800">
          CalmMind AI 🌿
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Your Safe Space for Mental Wellness
        </p>
        <div className="flex justify-center items-center gap-2 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-400">AI Support Active</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-40 py-6 space-y-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex animate-fadeIn ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-2xl px-6 py-4 rounded-2xl text-sm md:text-base shadow-sm ${
                msg.sender === "user"
                  ? "bg-indigo-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <p className="text-[10px] mt-2 opacity-60 text-right">
                {msg.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-200 text-sm text-gray-500 animate-pulse">
              CalmMind AI is typing...
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-4">

          {/* Input Box */}
          <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-sm px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-300 transition">

            <input
              type="text"
              placeholder="Type your thoughts here..."
              className="flex-1 outline-none bg-transparent text-gray-700 text-sm md:text-base"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />

            <button
              onClick={sendMessage}
              className="ml-3 bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-full transition duration-200"
            >
              Send
            </button>

          </div>

          {/* Quick Mood Buttons */}
          <div className="flex justify-center gap-3 mt-4 text-xs md:text-sm flex-wrap">
            <button
              onClick={() => handleQuickMood("I'm feeling really happy today 😃")}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition"
            >
              😃 I'm Happy
            </button>

            <button
              onClick={() => handleQuickMood("I'm just okay today 😐")}
              className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full hover:bg-yellow-200 transition"
            >
              😐 Just Okay
            </button>

            <button
              onClick={() => handleQuickMood("I'm feeling low and stressed 😔")}
              className="bg-red-100 text-red-700 px-3 py-1 rounded-full hover:bg-red-200 transition"
            >
              😔 Feeling Low
            </button>
          </div>

          {/* Safety Footer */}
          <p className="text-center text-[11px] text-gray-400 mt-4">
            If you are feeling unsafe or thinking about harming yourself,
            please contact a trusted adult or local helpline immediately.
          </p>

        </div>
      </div>
    </div>
  );
}