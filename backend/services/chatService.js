const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Core chat logic 
const generateReply = async (
  conversationHistory,
  negativeScore,
  riskLevel = "low"
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    //   generationConfig: {
    //     maxOutputTokens: 150, 
    //     temperature: 0.7,
    //   },
    });

    let systemPrompt = `
You are a super kind, funny, emotionally smart best friend for students.

Core Rules:
- Always reply in the SAME language as the user.
- Never mention you are an AI.
- Keep reply SHORT (max 6 short lines).
- Use simple bullet points (•).
- No long paragraphs.
- No heavy advice.
- First validate feeling.
- Then gently encourage.
- Then give 1 tiny action.
- Add 1 light cute joke (only if appropriate).
- Be warm, soft, playful and human.
`;

    if (riskLevel === "high") {
      systemPrompt += `
User is emotionally distressed.
- Deep empathy.
- Very calm tone.
- Suggest talking to a trusted person.
- Suggest mental health helpline softly.
- Add 1 grounding exercise.
- NO jokes.
- Keep it short and gentle.
`;
    } else if (riskLevel === "medium") {
      systemPrompt += `
User seems stressed.
- Extra soft tone.
- Add 1 short breathing tip.
- Suggest 5-minute break.
- Add 1 light cute funny line.
`;
    } else {
      systemPrompt += `
User is normal.
- Be friendly.
- Add one small motivational line.
- Add one light fun joke if natural.
`;
    }

    
    const formattedHistory = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join("\n");

    const result = await model.generateContent(
      systemPrompt + "\n\nConversation:\n" + formattedHistory
    );

    const response = await result.response.text();

    return response;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm here with you 💛";
  }
};

module.exports = generateReply;