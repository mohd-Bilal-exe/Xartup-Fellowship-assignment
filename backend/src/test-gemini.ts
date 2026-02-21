
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function testGemini() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log("Gemini Response:", response.text());
  } catch (error: any) {
    console.error("Gemini Error Details:");
    console.error("Message:", error.message);
    console.error("Status:", error.status);
    console.error("Response:", error.response?.data);
  }
}

testGemini();
