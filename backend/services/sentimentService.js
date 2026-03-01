// const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();





// const axios = require("axios");

// const analyzeSentiment = async (text) => {
//   try {
//     const response = await axios.post(
//     //   "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment",
//     //    "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment",
//       "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment",
//       { inputs: text },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.HF_TOKEN}`,
//         },
//       }
//     );

//     return response.data[0];
//   } catch (error) {
//     console.error("HF ERROR:", error.response?.data || error.message);
//     throw error;
//   }
// };

// module.exports = analyzeSentiment;



const axios = require("axios");

const analyzeSentiment = async (message) => {
  try {
    const response = await axios.post(
    //   "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
      "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment",
      { inputs: message },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
        },
      }
    );

    const result = response.data[0];

    // Find highest score label
    let highest = result.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );

    return {
      label: highest.label.toLowerCase(),
      score: highest.score,
    };

  } catch (error) {
    console.error("Sentiment Error:", error.response?.data || error.message);
    return {
      label: "neutral",
      score: 0,
    };
  }
};

module.exports = analyzeSentiment;