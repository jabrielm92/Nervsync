import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

const STATE_PROMPTS: Record<string, string[]> = {
  fight_flight: [
    "What feels like it needs protecting right now?",
    "If your body could speak, what would it be shouting?",
    "What would help you feel just 10% safer in this moment?",
    "Where in your body do you notice the most activation right now?",
    "What happened today that your nervous system is still responding to?",
  ],
  freeze: [
    "Can you describe what 'frozen' feels like in your body right now?",
    "What is one tiny thing you can still feel or sense?",
    "If you could move just one part of your body freely, what would it do?",
    "What were you doing right before you noticed this shutdown?",
    "What would feel like the gentlest possible next step?",
  ],
  fawn: [
    "What did you say 'yes' to today that you wanted to say 'no' to?",
    "If no one else's feelings mattered for a moment, what would you want?",
    "Where do you end and others begin right now?",
    "What need of yours got pushed aside today?",
    "What would it feel like to take up more space?",
  ],
  dorsal_collapse: [
    "What does this heaviness feel like in your body?",
    "Can you name one thing, no matter how small, that you noticed today?",
    "What would 'just enough' energy look like right now?",
    "Is there a color or texture that matches how you feel?",
    "What is one kind thing you could whisper to yourself right now?",
  ],
  ventral_vagal: [
    "What contributed to this sense of ease today?",
    "Where in your body do you feel the most settled?",
    "What are you grateful for in this moment of regulation?",
    "How could you share this regulated state with someone you care about?",
    "What glimmer caught your attention today?",
  ],
}

export function getJournalPrompt(primaryState: string): string {
  const prompts = STATE_PROMPTS[primaryState] ?? STATE_PROMPTS.ventral_vagal
  const index = Math.floor(Math.random() * prompts.length)
  return prompts[index]
}

export interface JournalAnalysis {
  reflection: string
  tags: string[]
  emotionalTone: string
}

export async function analyzeJournalEntry(
  content: string,
  primaryState: string,
  prompt?: string
): Promise<JournalAnalysis> {
  const systemPrompt = `You are a compassionate, trauma-informed journal companion within the NervSync nervous system regulation app. Your role is to offer a gentle, validating reflection on the user's journal entry.

Guidelines:
- Be warm, non-judgmental, and brief (2-4 sentences for the reflection)
- Validate the user's experience without toxic positivity
- Gently notice body-based or somatic themes if present
- Never diagnose, pathologize, or give clinical advice
- Use polyvagal-informed language naturally (without jargon)
- Honor the user's current state - do not push them to feel differently

Respond with valid JSON only, using this schema:
{
  "reflection": "string - a warm, brief 2-4 sentence reflection that mirrors back what you noticed in their entry and offers a gentle observation or validation",
  "tags": ["string array - 2-5 relevant tags like 'boundaries', 'self-compassion', 'grief', 'body-awareness', 'growth', 'connection', 'safety', 'activation', 'overwhelm', 'release', 'joy', 'anger', 'sadness', 'fear', 'hope', 'gratitude'"],
  "emotionalTone": "string - one word capturing the overall emotional tone, e.g., 'tender', 'raw', 'hopeful', 'heavy', 'reflective', 'anxious', 'peaceful', 'grieving', 'frustrated', 'emerging'"
}`

  const userMessage = `The user's current nervous system state is: ${primaryState.replace(/_/g, " ")}
${prompt ? `The journal prompt they responded to: "${prompt}"` : "They wrote freely without a prompt."}

Their journal entry:
"""
${content}
"""`

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    return JSON.parse(text) as JournalAnalysis
  } catch (error) {
    console.error("Failed to analyze journal entry:", error)
    return buildFallbackAnalysis(primaryState)
  }
}

function buildFallbackAnalysis(primaryState: string): JournalAnalysis {
  const fallbacks: Record<string, JournalAnalysis> = {
    fight_flight: {
      reflection:
        "Thank you for putting words to what you're experiencing. Writing during activation takes real courage - your nervous system is working hard to protect you, and naming that is a powerful step.",
      tags: ["activation", "self-awareness"],
      emotionalTone: "raw",
    },
    freeze: {
      reflection:
        "You showed up to write even when things feel still and heavy. That quiet act of reaching for words is a sign of life stirring beneath the surface. Be gentle with yourself.",
      tags: ["stillness", "self-compassion"],
      emotionalTone: "heavy",
    },
    fawn: {
      reflection:
        "It takes something to pause and check in with yourself when so much energy goes toward others. This journal is a space that belongs entirely to you. What you feel matters.",
      tags: ["boundaries", "self-connection"],
      emotionalTone: "tender",
    },
    dorsal_collapse: {
      reflection:
        "Even writing a few words when everything feels muted is meaningful. You don't have to feel more or do more right now. Just being here is enough.",
      tags: ["gentleness", "presence"],
      emotionalTone: "quiet",
    },
    ventral_vagal: {
      reflection:
        "There's a lovely sense of groundedness in your words. Noticing and savoring these moments of regulation helps your nervous system remember this is home base.",
      tags: ["gratitude", "regulation"],
      emotionalTone: "peaceful",
    },
  }

  return fallbacks[primaryState] ?? fallbacks.ventral_vagal
}
