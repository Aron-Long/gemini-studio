const apiKey = 'sk-ai-v1-aa27ff4f7bc6d11573b41d3d51888aaa1a945a1a154b47699e594e087540c31f';
const baseUrl = 'https://zenmux.ai/api';
const modelId = 'google/gemini-3-pro-preview-free';

async function testApi() {
  console.log("Testing Gemini API with raw fetch...");
  
  // Try OpenAI compatible endpoint structure often used by proxies
  // const url = `${baseUrl}/v1/chat/completions`;
  
  // Try OpenAI compatible endpoint
  const url = `${baseUrl}/v1/chat/completions`;
  
  console.log(`Target URL: ${url}`);

  const payload = {
    model: modelId,
    messages: [
      { role: "user", content: "Hello, explain in one sentence what you are." }
    ],
    stream: false
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error Body:", errorText);
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log("\n--- API Response ---");
    console.log(JSON.stringify(data, null, 2));
    console.log("--- End Response ---\n");
    console.log("✅ API test successful!");

  } catch (error) {
    console.error("\n❌ API test failed!");
    console.error(error);
  }
}

testApi();
