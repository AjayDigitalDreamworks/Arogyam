const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateReply = async (message, negativeScore, riskLevel = "low") => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    let systemPrompt = `
You are a kind, emotionally intelligent AI friend for students.
Your goal:
- Make the user feel heard and cared for
- Reduce stress and sadness
- Use warm, soft, friendly language
- Never sound robotic
- Never say you are an AI
- Talk like a caring best friend

Always:
1. Validate their feeling first
2. Then encourage gently
3. Then give one small helpful action
Keep response medium length.
`;

    //  Medium Risk Mode
    if (negativeScore > 0.75 && riskLevel === "medium") {
      systemPrompt += `
User seems stressed or sad.
- Show empathy
- Suggest 1 breathing exercise
- Add one light positive joke
- Encourage small break
`;
    }

    // High Risk Mode
    if (riskLevel === "high") {
      systemPrompt += `
User seems emotionally distressed.
- Respond with deep empathy
- Encourage them to talk to trusted adult/friend
- Suggest contacting a mental health helpline
- Stay calm and supportive
- Do NOT panic them
- Give one grounding exercise
`;
    }

    //  Normal Mode
    if (riskLevel === "low") {
      systemPrompt += `
User is normal.
- Be friendly
- Add one small motivational line
- If appropriate, add one light fun joke
`;
    }

    const result = await model.generateContent(
      systemPrompt + "\n\nUser message: " + message
    );

    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here with you. Something went wrong, but you're not alone 💛";
  }
};

module.exports = generateReply;