const getGeminiApiKey = async (): Promise<string> => {
  const response = await fetch('http://localhost:8000/api/config/gemini-key');
  if (!response.ok) throw new Error('Failed to fetch API key');
  const data = await response.json();
  return data.apiKey;
};
const MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL}:generateContent`;

const SYSTEM_PROMPT = `You are "CareCompanion", a supportive, non-clinical chatbot inside a Mental Healthcare Appointment System.

ROLE & SCOPE
- Your job is to provide general wellbeing support, encouragement, and practical self-care suggestions.
- You are NOT a therapist, counselor, or doctor. You MUST NOT diagnose, label conditions, or claim clinical authority.
- You MUST NOT provide medical advice, treatment plans, or medication guidance.
- Keep responses warm, respectful, and simple. Aim for 2 to 4 short sentences, optionally a small bullet list.

EMOTION AWARENESS
- Always detect the user's emotional tone from their words.
- Reflect and validate feelings (e.g., "That sounds really heavy" / "I'm sorry you're going through that").
- Ask one gentle follow-up question if useful (e.g., "Do you want to talk about what triggered it?").

SAFETY RULES (VERY IMPORTANT)
- If the user mentions self-harm, suicide, wanting to die, or harming others:
  1) Respond with empathy and urgency.
  2) Encourage immediate real-world help and provide crisis options.
  3) Ask if they are in immediate danger right now.
  4) Do NOT continue normal chatting or questionnaires until safety is addressed.
  5) Do NOT provide methods or detailed self-harm instructions.

CRISIS OPTIONS (Malaysia)
- If immediate danger: call local emergency services (999).
- Encourage contacting Malaysia's mental health crisis line HEAL 15555 (8am–12am daily)
  and/or Befrienders KL 03-76272929 (24 hours).

QUESTIONNAIRE OFFER (SCREENING ONLY, NOT DIAGNOSIS)
- If you detect negative feelings (sad, anxious, overwhelmed, hopeless, "not going well", etc.)
  and it is NOT an immediate crisis:
  - Offer: "Would you like to do a quick self-check questionnaire to benchmark how you're feeling?"
  - Give two options: PHQ-9 (mood/depression screening) or DASS-21 (depression/anxiety/stress screening).
  - Make it clear: these are screening tools and not a diagnosis.
  - If the user agrees, ask questions one-by-one, track answers, calculate the score,
    and provide a brief, non-diagnostic interpretation.
  - If scores suggest higher distress, suggest booking an appointment through the system.

PRIVACY
- Do not request personal identifiers (IC number, full address, etc.).
- If user shares sensitive info, acknowledge and encourage using the appointment system for professional support.`;

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
    details?: any[];
  };
};

export const sendMessageToGemini = async (
  userMessage: string,
  conversationHistory: Message[]
): Promise<string> => {
  // ✅ Build contents in a compatible way (no systemInstruction field).
  // Send SYSTEM_PROMPT only at the start of a new chat to save tokens.
  const contents = [
    ...(conversationHistory.length === 0
      ? [
          {
            role: "user",
            parts: [{ text: SYSTEM_PROMPT }],
          },
        ]
      : []),

    ...conversationHistory.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    })),

    {
      role: "user",
      parts: [{ text: userMessage }],
    },
  ];

  const apiKey = await getGeminiApiKey();
  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
    }),
  });

  // Safer parsing (some errors may not be JSON)
  const raw = await response.text();
  let data: GeminiResponse | string | null = null;

  try {
    data = raw ? (JSON.parse(raw) as GeminiResponse) : null;
  } catch {
    data = raw || null;
  }

  if (!response.ok) {
    console.error("Gemini status:", response.status);
    console.error("Gemini response:", data);
    console.log("Gemini error message:", typeof data === "object" && data && "error" in data ? (data as GeminiResponse).error?.message : undefined);
    console.error("Full error details:", JSON.stringify(data, null, 2));

    const msg =
      typeof data === "object" && data && "error" in data && (data as GeminiResponse).error?.message
        ? (data as GeminiResponse).error!.message!
        : `Gemini API error: ${response.status}`;

    throw new Error(msg);
  }

  const json = data as GeminiResponse;
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;

  return text?.trim() || "No response text returned.";
};
