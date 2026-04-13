import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface Exercise {
  name: string
  category: string
  description: string
  instructions: string[]
  durationSeconds: number
  breathCues?: {
    inhale: number
    hold?: number
    exhale: number
    pattern: string
  }
  order: number
}

export interface GeneratedSession {
  title: string
  description: string
  durationMinutes: number
  targetState: string
  exercises: Exercise[]
}

interface SessionContext {
  primaryState: string
  intensity: number
  preferences?: {
    preferredDuration?: number
    primaryGoal?: string
  }
  history?: {
    recentStates?: string[]
    completedExercises?: string[]
    averageRating?: number
  }
}

const SYSTEM_PROMPT = `You are an expert nervous system regulation coach trained in polyvagal theory, somatic experiencing, and evidence-based breathwork practices. You create personalized nervous system regulation protocols for users based on their current autonomic state.

Your expertise includes:
- Polyvagal theory and the autonomic ladder (ventral vagal, sympathetic/fight-flight, dorsal vagal/freeze, fawn, dorsal collapse)
- Breathwork techniques (box breathing, physiological sigh, extended exhale, coherent breathing)
- Somatic exercises (body scans, progressive muscle relaxation, orienting, pendulation)
- Vagal toning exercises (humming, cold exposure, gargling, singing)
- Grounding techniques (5-4-3-2-1, bilateral stimulation, earthing, containment)

Guidelines for session creation:
- For fight/flight states: prioritize down-regulation through extended exhale breathing, grounding, and discharge exercises
- For freeze states: use gentle activation and pendulation between safety and sensation
- For fawn states: include boundary-setting somatic practices and self-connection exercises
- For dorsal collapse: use gentle mobilization, micro-movements, and co-regulation cues
- For ventral vagal: offer practices that deepen resilience, expand window of tolerance, and celebrate regulation

Always respond with valid JSON matching the requested schema. Do not include any text outside the JSON object.`

export async function generateSession(context: SessionContext): Promise<GeneratedSession> {
  const userPrompt = `Create a personalized nervous system regulation session for this user:

Current State: ${context.primaryState}
Intensity: ${context.intensity}/5
${context.preferences?.preferredDuration ? `Preferred Duration: ${context.preferences.preferredDuration} minutes` : "Duration: 10 minutes"}
${context.preferences?.primaryGoal ? `Primary Goal: ${context.preferences.primaryGoal}` : ""}
${context.history?.recentStates?.length ? `Recent States: ${context.history.recentStates.join(", ")}` : ""}
${context.history?.completedExercises?.length ? `Previously Completed Exercises: ${context.history.completedExercises.join(", ")}` : ""}
${context.history?.averageRating ? `Average Session Rating: ${context.history.averageRating}/5` : ""}

Generate a session as a JSON object with this exact schema:
{
  "title": "string - a warm, descriptive title for the session",
  "description": "string - a brief 1-2 sentence description of what this session will do",
  "durationMinutes": number,
  "targetState": "ventral_vagal",
  "exercises": [
    {
      "name": "string",
      "category": "breathwork | somatic | vagal_toning | grounding",
      "description": "string - brief description of the exercise",
      "instructions": ["step 1", "step 2", ...],
      "durationSeconds": number,
      "breathCues": {
        "inhale": number (seconds),
        "hold": number (seconds, optional),
        "exhale": number (seconds),
        "pattern": "string description of the pattern"
      },
      "order": number (1-based)
    }
  ]
}

Include 3-5 exercises that progressively guide the user from their current state toward ventral vagal regulation. Each exercise should build on the previous one.`

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    })

    const text = response.content[0].type === "text" ? response.content[0].text : ""
    const parsed = JSON.parse(text) as GeneratedSession
    return parsed
  } catch (error) {
    console.error("Failed to generate session via Claude API, using fallback:", error)
    return getFallbackSession(context.primaryState, context.preferences?.preferredDuration ?? 10)
  }
}

// ---------------------------------------------------------------------------
// Fallback sessions (one per state)
// ---------------------------------------------------------------------------

const FALLBACK_SESSIONS: Record<string, GeneratedSession> = {
  fight_flight: {
    title: "Calm the Storm",
    description:
      "A grounding sequence designed to downshift your nervous system from sympathetic activation back toward safety.",
    durationMinutes: 10,
    targetState: "ventral_vagal",
    exercises: [
      {
        name: "Orienting to Safety",
        category: "grounding",
        description: "Slowly look around your environment and name 5 things you can see.",
        instructions: [
          "Pause and take one natural breath.",
          "Slowly turn your head to the left and notice something you see.",
          "Turn your head to the right and notice something else.",
          "Continue until you have named 5 objects aloud or silently.",
          "Notice any shift in your shoulders or jaw.",
        ],
        durationSeconds: 90,
        order: 1,
      },
      {
        name: "Extended Exhale Breathing",
        category: "breathwork",
        description: "Lengthen your exhale to activate the parasympathetic branch.",
        instructions: [
          "Inhale gently through your nose for 4 seconds.",
          "Exhale slowly through your mouth for 6 seconds.",
          "Repeat for 8 rounds.",
          "Let your body soften with each exhale.",
        ],
        durationSeconds: 120,
        breathCues: { inhale: 4, exhale: 6, pattern: "4-in, 6-out extended exhale" },
        order: 2,
      },
      {
        name: "Shake and Release",
        category: "somatic",
        description: "Discharge excess sympathetic energy through intentional shaking.",
        instructions: [
          "Stand up or sit upright.",
          "Begin gently shaking your hands and wrists.",
          "Let the shake spread to your arms and shoulders.",
          "Allow your whole body to tremor gently for 60 seconds.",
          "Slowly come to stillness and notice the sensations.",
        ],
        durationSeconds: 120,
        order: 3,
      },
      {
        name: "Bilateral Tapping",
        category: "grounding",
        description: "Alternating taps to promote hemispheric integration and calm.",
        instructions: [
          "Cross your arms and place hands on opposite shoulders.",
          "Tap your left shoulder, then your right, in a slow alternating rhythm.",
          "Continue for 2 minutes.",
          "Focus on the rhythm and the gentle pressure.",
        ],
        durationSeconds: 120,
        order: 4,
      },
      {
        name: "Settling Breath",
        category: "breathwork",
        description: "Close the session with coherent breathing to sustain regulation.",
        instructions: [
          "Breathe in for 5 seconds.",
          "Breathe out for 5 seconds.",
          "Continue this even rhythm for 6 rounds.",
          "Rest in the stillness when complete.",
        ],
        durationSeconds: 90,
        breathCues: { inhale: 5, exhale: 5, pattern: "5-5 coherent breathing" },
        order: 5,
      },
    ],
  },

  freeze: {
    title: "Gentle Thaw",
    description:
      "Soft micro-movements and warming breathwork to gently reintroduce safety signals to a frozen nervous system.",
    durationMinutes: 10,
    targetState: "ventral_vagal",
    exercises: [
      {
        name: "Feet on the Ground",
        category: "grounding",
        description: "Re-establish a felt sense of contact with the earth.",
        instructions: [
          "Press your feet into the floor and feel the ground beneath you.",
          "Slowly shift your weight from left foot to right foot.",
          "Press your toes down one at a time.",
          "Notice the temperature of the floor through your soles.",
        ],
        durationSeconds: 90,
        order: 1,
      },
      {
        name: "Micro-Movement Activation",
        category: "somatic",
        description: "Reintroduce gentle movement to a still body.",
        instructions: [
          "Wiggle your fingers slowly.",
          "Rotate your wrists in small circles.",
          "Gently roll your shoulders forward, then backward.",
          "Turn your head side to side very slowly.",
          "Notice which movements feel most easeful.",
        ],
        durationSeconds: 120,
        order: 2,
      },
      {
        name: "Warming Breath",
        category: "breathwork",
        description: "A gentle breath pattern to bring warmth and energy back into the body.",
        instructions: [
          "Inhale through your nose for 4 seconds.",
          "Exhale through your mouth with a soft 'haaa' sound for 4 seconds.",
          "Repeat for 8 rounds.",
          "Imagine warmth spreading from your chest to your limbs.",
        ],
        durationSeconds: 120,
        breathCues: { inhale: 4, exhale: 4, pattern: "4-in, 4-out warming breath with 'haaa'" },
        order: 3,
      },
      {
        name: "Self-Hug with Rocking",
        category: "somatic",
        description: "Gentle self-touch and rhythmic movement to signal co-regulation.",
        instructions: [
          "Wrap your arms around yourself in a comfortable hug.",
          "Begin rocking gently side to side or forward and back.",
          "Find a rhythm that feels soothing.",
          "Continue for 90 seconds, noticing the sensation of being held.",
        ],
        durationSeconds: 120,
        order: 4,
      },
      {
        name: "Humming Exhale",
        category: "vagal_toning",
        description: "Stimulate the vagus nerve through gentle humming.",
        instructions: [
          "Inhale naturally through your nose.",
          "Exhale while humming at a comfortable pitch.",
          "Feel the vibration in your chest and throat.",
          "Repeat for 6 rounds.",
        ],
        durationSeconds: 90,
        breathCues: { inhale: 3, exhale: 6, pattern: "3-in, 6-out with humming exhale" },
        order: 5,
      },
    ],
  },

  fawn: {
    title: "Return to Self",
    description:
      "Boundary-strengthening somatic practices to reconnect with your own needs and build a felt sense of self.",
    durationMinutes: 10,
    targetState: "ventral_vagal",
    exercises: [
      {
        name: "Body Scan - Finding Your Edges",
        category: "somatic",
        description: "Reconnect with your physical boundaries by sensing the edges of your body.",
        instructions: [
          "Close your eyes and bring attention to the top of your head.",
          "Slowly scan down, noticing where your body ends and space begins.",
          "Pay attention to the edges of your shoulders, arms, and fingertips.",
          "Notice the boundary between your body and the chair or floor.",
          "Take a moment to appreciate the container that is your body.",
        ],
        durationSeconds: 120,
        order: 1,
      },
      {
        name: "Pushing Away",
        category: "somatic",
        description: "Practice the physical gesture of creating space and setting limits.",
        instructions: [
          "Sit or stand with arms at your sides.",
          "Slowly extend both arms forward, palms out, as if pushing against a wall.",
          "Feel the strength in your arms and say silently: 'I can create space.'",
          "Hold the push for 5 seconds, then release.",
          "Repeat 5 times, noticing any sensations of empowerment.",
        ],
        durationSeconds: 120,
        order: 2,
      },
      {
        name: "Centering Breath",
        category: "breathwork",
        description: "A balanced breath to anchor you in your own center.",
        instructions: [
          "Place one hand on your chest and one on your belly.",
          "Inhale for 4 seconds, directing breath to your belly hand.",
          "Hold gently for 2 seconds.",
          "Exhale for 4 seconds.",
          "Repeat for 8 rounds, focusing on the word 'mine' with each exhale.",
        ],
        durationSeconds: 120,
        breathCues: { inhale: 4, hold: 2, exhale: 4, pattern: "4-2-4 centering breath" },
        order: 3,
      },
      {
        name: "Vocal Toning - Finding Your Voice",
        category: "vagal_toning",
        description: "Use your voice to reclaim expression and strengthen vagal tone.",
        instructions: [
          "Take a deep breath in.",
          "On the exhale, make a long 'Voo' sound from your belly.",
          "Feel the vibration deep in your core.",
          "Repeat 6 times, experimenting with volume and pitch.",
          "Notice how it feels to take up space with your sound.",
        ],
        durationSeconds: 120,
        order: 4,
      },
      {
        name: "Containment Hold",
        category: "grounding",
        description: "Create a physical sense of containment and self-connection.",
        instructions: [
          "Place one hand on your forehead and one on the back of your head.",
          "Hold gently and breathe naturally.",
          "After 30 seconds, move both hands to cradle the sides of your head.",
          "Finish by resting both hands on your heart center.",
          "Notice the felt sense of holding yourself.",
        ],
        durationSeconds: 90,
        order: 5,
      },
    ],
  },

  dorsal_collapse: {
    title: "Spark of Life",
    description:
      "Gentle mobilization practices to bring energy and connection back when you feel shut down or collapsed.",
    durationMinutes: 10,
    targetState: "ventral_vagal",
    exercises: [
      {
        name: "5-4-3-2-1 Sensory Grounding",
        category: "grounding",
        description: "Engage your senses to reconnect with the present moment.",
        instructions: [
          "Name 5 things you can see right now.",
          "Name 4 things you can touch - reach out and feel them.",
          "Name 3 things you can hear.",
          "Name 2 things you can smell.",
          "Name 1 thing you can taste.",
        ],
        durationSeconds: 120,
        order: 1,
      },
      {
        name: "Energizing Breath",
        category: "breathwork",
        description: "A slightly activating breath pattern to gently bring energy up.",
        instructions: [
          "Inhale briskly through your nose for 3 seconds.",
          "Exhale through your mouth for 3 seconds.",
          "Repeat for 6 rounds, allowing a slightly more energetic quality.",
          "Pause and notice any tingling or warmth.",
          "Continue for 4 more rounds if it feels safe.",
        ],
        durationSeconds: 90,
        breathCues: { inhale: 3, exhale: 3, pattern: "3-3 balanced energizing breath" },
        order: 2,
      },
      {
        name: "Gentle Spinal Awakening",
        category: "somatic",
        description: "Soft movement through the spine to wake up the body gently.",
        instructions: [
          "Sit comfortably or lie down.",
          "Very slowly arch your back slightly on the inhale.",
          "Round your back gently on the exhale.",
          "Move as slowly as possible, following your body's pace.",
          "Continue for 8 rounds.",
        ],
        durationSeconds: 120,
        order: 3,
      },
      {
        name: "Cold Water Vagal Activation",
        category: "vagal_toning",
        description: "Use temperature change to stimulate the vagus nerve and increase alertness.",
        instructions: [
          "Get a glass of cold water or a cool damp cloth.",
          "Splash cold water on your face or hold the cloth to your cheeks and forehead.",
          "Take 3 deep breaths while feeling the cold sensation.",
          "Notice the slight increase in alertness.",
          "If you have ice, hold a cube in your hands for 15 seconds.",
        ],
        durationSeconds: 90,
        order: 4,
      },
      {
        name: "Gratitude Anchor",
        category: "grounding",
        description: "End with a gentle positive anchor to reinforce the shift toward engagement.",
        instructions: [
          "Place your hand on your heart.",
          "Think of one small thing that brought you comfort recently - even something tiny.",
          "Breathe that feeling into your chest.",
          "Say to yourself: 'I am here. I am alive. That is enough.'",
          "Take 3 slow breaths to close.",
        ],
        durationSeconds: 90,
        order: 5,
      },
    ],
  },

  ventral_vagal: {
    title: "Deepening Resilience",
    description:
      "Build on your current state of regulation with practices that expand your window of tolerance and strengthen vagal tone.",
    durationMinutes: 10,
    targetState: "ventral_vagal",
    exercises: [
      {
        name: "Savoring Practice",
        category: "grounding",
        description: "Intentionally deepen your connection to the felt sense of safety and well-being.",
        instructions: [
          "Close your eyes and notice the feeling of regulation in your body.",
          "Where do you feel it most? Warmth, openness, ease?",
          "Breathe into that area and let the sensation expand.",
          "Stay with this pleasant sensation for 90 seconds.",
          "This is your nervous system in its home base.",
        ],
        durationSeconds: 120,
        order: 1,
      },
      {
        name: "Coherent Breathing",
        category: "breathwork",
        description: "Optimize heart rate variability with balanced, rhythmic breathing.",
        instructions: [
          "Inhale for 5 seconds.",
          "Exhale for 5 seconds.",
          "Continue this even rhythm for 10 rounds.",
          "Let the rhythm become effortless.",
          "Notice the sense of balance and harmony.",
        ],
        durationSeconds: 120,
        breathCues: { inhale: 5, exhale: 5, pattern: "5-5 coherent breathing for HRV" },
        order: 2,
      },
      {
        name: "Vagal Toning - Om Chant",
        category: "vagal_toning",
        description: "Strengthen vagal tone with extended vocalization.",
        instructions: [
          "Inhale deeply through your nose.",
          "On the exhale, chant 'Om' or hum at a comfortable pitch.",
          "Extend the sound for as long as your exhale lasts.",
          "Feel the vibration in your chest, throat, and skull.",
          "Repeat 8 times.",
        ],
        durationSeconds: 120,
        breathCues: { inhale: 4, exhale: 8, pattern: "4-in, 8-out extended Om chant" },
        order: 3,
      },
      {
        name: "Window of Tolerance Expansion",
        category: "somatic",
        description: "Gently explore the edges of activation while maintaining regulation.",
        instructions: [
          "Think of a mildly stressful situation (2/10 intensity).",
          "Notice any subtle body sensations that arise.",
          "Breathe into those sensations without trying to change them.",
          "Now shift your attention back to your safe anchor point.",
          "Practice this pendulation 3 times - noticing you can move between activation and calm.",
        ],
        durationSeconds: 120,
        order: 4,
      },
      {
        name: "Loving-Kindness Closing",
        category: "grounding",
        description: "Close with a social engagement practice to reinforce ventral vagal connection.",
        instructions: [
          "Bring to mind someone you care about.",
          "Silently send them the words: 'May you be safe. May you be well.'",
          "Now direct those words toward yourself.",
          "Place your hand on your heart and breathe gently.",
          "Appreciate this moment of connection and regulation.",
        ],
        durationSeconds: 90,
        order: 5,
      },
    ],
  },
}

function getFallbackSession(state: string, durationMinutes: number): GeneratedSession {
  const session = FALLBACK_SESSIONS[state] ?? FALLBACK_SESSIONS.fight_flight
  return {
    ...session,
    durationMinutes,
  }
}
