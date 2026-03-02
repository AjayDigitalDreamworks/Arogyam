const express = require("express");
const router = express.Router();

const analyzeSentiment = require("../services/sentimentService");
const generateReply = require("../services/chatService");
const sendAlert = require("../services/alertService");

const sessions = {}; 

router.post("/", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    console.log("Received message:", message, "Session ID:", sessionId);

    if (!message || !sessionId) {
      return res.status(400).json({ error: "Message and sessionId required" });
    }

    //  Create session if not exists
    if (!sessions[sessionId]) {
      sessions[sessionId] = [];
    }

    // Save user message in memory
    sessions[sessionId].push({
      role: "user",
      content: message
    });

    //  Sentiment Analysis
    const sentiment = await analyzeSentiment(message);

    let riskLevel = "low";

    if (sentiment.label === "negative" && sentiment.score > 0.75) {
      riskLevel = "medium";
    }

    // Danger Word Detection (backup layer)
    const lowerMsg = message.toLowerCase();

    const dangerWords = [
      "suicide",
      "kill myself",
      "die",
      "end my life",
      "no reason to live",
      "want to disappear",
      "hurt myself",
      "mar jana hai",
      "jeena nahi hai",
      "jeene ka mann nahi",
      "khud ko khatam",
      "apni jaan lena",
      "mar jaunga",
      "mar jaungi",
      "zindagi bekar hai",
      "jeene ka koi matlab nahi",
      "mujhe mar jana hai",
      "life khatam karna chahta hoon",
      "main khatam ho jana chahta hoon",
      "ami more jete chai",
      "amar bachte ichha kore na",
      "i give up",
      "nothing matters",
      "i'm done",
      "no point living"
    ];

    if (dangerWords.some(word => lowerMsg.includes(word))) {
      riskLevel = "high";
    }

    //  Send last 10 messages only (context limit)
    const conversationHistory = sessions[sessionId].slice(-10);

    // Generate AI Reply
    const reply = await generateReply(
      conversationHistory,
      sentiment.score,
      riskLevel
    );

    // Save bot reply in memory
    sessions[sessionId].push({
      role: "assistant",
      content: reply
    });

    // Admin Alert
    if (riskLevel === "high") {
      await sendAlert({
        message,
        sessionId,
        time: new Date()
      });
    }

    res.json({
      reply,
      sentiment,
      riskLevel
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;