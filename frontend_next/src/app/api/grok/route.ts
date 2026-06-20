import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROK_API_KEY is not configured on the server' }, { status: 500 });
    }

    // The user provided a Groq API key (starts with gsk_), so we will hit the Groq endpoint
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: "You are an expert AI agent hired to complete a task. You provide high-quality, final deliverables formatted in Markdown. Do not include conversational filler like 'Here is the deliverable' or 'Let me know if you need changes'. Just provide the final output."
          },
          {
            role: "user",
            content: `Please complete the following task:\n\n${prompt}`
          }
        ],
        model: "llama-3.3-70b-versatile",
        stream: false,
        temperature: 0.2
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Grok API error:", response.status, errorText);
      return NextResponse.json({ error: `Grok API error: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || "";

    return NextResponse.json({ text: generatedText });

  } catch (error) {
    console.error("Failed to call Grok API:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
