const express = require("express");
const router = express.Router();
const analyzeSentiment = require("../services/sentimentService");
const generateReply = require("../services/chatService");
const sendAlert = require("../services/alertService");

router.post("/", async (req, res) => {
  const { message } = req.body;

  // Sentiment
  const sentiment = await analyzeSentiment(message);

  let riskLevel = "low";

  //  Risk Logic
  if (sentiment.label === "negative" && sentiment.score > 0.75) {
    riskLevel = "medium";
  }

 const dangerWords = [
  // English
  "suicide",
  "kill myself",
  "die",
  "end my life",
  "no reason to live",
  "want to disappear",
  "hurt myself",

  // Hindi
  "mar jana hai",
  "jeena nahi hai",
  "jeene ka mann nahi",
  "khud ko khatam",
  "apni jaan lena",
  "mar jaunga",
  "mar jaungi",
  "zindagi bekar hai",
  "jeene ka koi matlab nahi",

  // Hinglish
  "mujhe mar jana hai",
  "life khatam karna chahta hoon",
  "main khatam ho jana chahta hoon",

  // Bengali
  "ami more jete chai",
  "amar bachte ichha kore na",

  // General hopelessness
  "I give up",
  "nothing matters",
  "I'm done",
  "no point living"
];

  if (dangerWords.some(word =>
      message.toLowerCase().includes(word)
  )) {
    riskLevel = "high";
  }

  //  Generate Gemini Reply
  const reply = await generateReply(
    message,
    sentiment.score,
    riskLevel
  );

  // Admin Alert if high
  if (riskLevel === "high") {
    console.log(" ALERT ADMIN");
  }

  res.json({
    reply,
    sentiment,
    riskLevel
  });
});
module.exports = router;