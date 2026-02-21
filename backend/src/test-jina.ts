
import axios from 'axios';

async function testJina() {
  const url = 'https://r.jina.ai/https://openai.com';
  try {
    const { data } = await axios.get(url);
    console.log("Jina Response Length:", data.length);
    console.log("Jina Content Preview:", data.substring(0, 500));
  } catch (error: any) {
    console.error("Jina Error:", error.message);
  }
}

testJina();
