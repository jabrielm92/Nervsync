// @ts-expect-error - PrismaClient is generated after `prisma generate` with a valid DATABASE_URL
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

interface ProtocolData {
  name: string; slug: string; category: string; targetStates: string[]
  description: string; instructions: string; durationSeconds: number
  difficulty: string; breathCues?: object; scienceNote?: string
  isPremium?: boolean; contraindications?: string; sortOrder: number
}

const protocols: ProtocolData[] = [
  // BREATHWORK (10)
  { name:"Physiological Sigh", slug:"physiological-sigh", category:"breathwork", targetStates:["fight_flight"], description:"The fastest known way to reduce real-time stress via double inhale and long exhale.", instructions:"1. Quick inhale through nose\n2. Second deeper inhale without exhaling\n3. Slow exhale through mouth for 6s\n4. Repeat", durationSeconds:60, difficulty:"beginner", breathCues:{inhale:3,hold:1,exhale:6,holdEmpty:0}, scienceNote:"Discovered by Stanford researchers. Double inhale reinflates collapsed alveoli, maximizing CO2 offload.", sortOrder:1 },
  { name:"4-7-8 Breathing", slug:"4-7-8-breathing", category:"breathwork", targetStates:["fight_flight","freeze"], description:"Calming breath pattern activating parasympathetic nervous system through extended exhale.", instructions:"1. Inhale through nose 4s\n2. Hold 7s\n3. Exhale through mouth 8s\n4. Repeat", durationSeconds:120, difficulty:"beginner", breathCues:{inhale:4,hold:7,exhale:8,holdEmpty:0}, scienceNote:"Extended exhale ratio stimulates vagus nerve activation.", sortOrder:2 },
  { name:"Box Breathing", slug:"box-breathing", category:"breathwork", targetStates:["fight_flight"], description:"Equal-ratio breathing used by Navy SEALs for stress management.", instructions:"1. Inhale 4s\n2. Hold 4s\n3. Exhale 4s\n4. Hold empty 4s\n5. Repeat", durationSeconds:180, difficulty:"beginner", breathCues:{inhale:4,hold:4,exhale:4,holdEmpty:4}, scienceNote:"Creates rhythmic autonomic balance through equal-phase breathing.", sortOrder:3 },
  { name:"Extended Exhale", slug:"extended-exhale", category:"breathwork", targetStates:["fight_flight","fawn"], description:"Simple pattern with longer exhale to activate calming nervous system branch.", instructions:"1. Inhale through nose 3s\n2. Exhale through mouth 6s\n3. Keep exhale smooth\n4. Repeat", durationSeconds:120, difficulty:"beginner", breathCues:{inhale:3,hold:0,exhale:6,holdEmpty:0}, sortOrder:4 },
  { name:"Coherence Breathing", slug:"coherence-breathing", category:"breathwork", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Optimal ~6 breaths/min to maximize heart rate variability.", instructions:"1. Inhale slowly 5s\n2. Exhale slowly 5s\n3. No pauses between\n4. Keep rhythm steady", durationSeconds:300, difficulty:"intermediate", breathCues:{inhale:5,hold:0,exhale:5,holdEmpty:0}, scienceNote:"Synchronizes heart rate with breathing, maximizing HRV.", sortOrder:5 },
  { name:"Straw Breathing", slug:"straw-breathing", category:"breathwork", targetStates:["fight_flight"], description:"Exhale through pursed lips to naturally slow and extend the breath.", instructions:"1. Inhale through nose\n2. Purse lips like a straw\n3. Exhale slowly through pursed lips\n4. Repeat", durationSeconds:120, difficulty:"beginner", sortOrder:6 },
  { name:"Energizing Breath", slug:"energizing-breath", category:"breathwork", targetStates:["freeze","dorsal_collapse"], description:"Quick rhythmic breathing to boost energy when feeling sluggish.", instructions:"1. Sit tall\n2. Quick forceful inhales/exhales through nose\n3. 15 breaths then rest 30s\n4. Repeat 2-3 rounds", durationSeconds:60, difficulty:"intermediate", breathCues:{inhale:1,hold:0,exhale:1,holdEmpty:0}, sortOrder:7 },
  { name:"Three-Part Breath", slug:"three-part-breath", category:"breathwork", targetStates:["fight_flight","fawn"], description:"Deep full-body breath filling belly, ribs, and chest sequentially.", instructions:"1. Hand on belly, hand on chest\n2. Inhale: fill belly\n3. Continue: expand ribs\n4. Complete: fill upper chest\n5. Exhale in reverse\n6. Repeat", durationSeconds:180, difficulty:"beginner", sortOrder:8 },
  { name:"Alternate Nostril Breathing", slug:"alternate-nostril-breathing", category:"breathwork", targetStates:["fight_flight","freeze"], description:"Nadi Shodhana pranayama balancing both brain hemispheres.", instructions:"1. Close right nostril with thumb\n2. Inhale left 4s\n3. Close left, open right\n4. Exhale right 4s\n5. Inhale right 4s\n6. Close right, open left, exhale\n7. Repeat", durationSeconds:300, difficulty:"intermediate", sortOrder:9 },
  { name:"Ocean Breath", slug:"ocean-breath", category:"breathwork", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Gentle throat constriction creating ocean-like sound for deep calm.", instructions:"1. Slightly constrict back of throat\n2. Inhale through nose with ocean sound\n3. Exhale with same constriction\n4. Keep breaths slow and even", durationSeconds:180, difficulty:"intermediate", sortOrder:10 },
  // SOMATIC (8)
  { name:"Progressive Muscle Relaxation", slug:"progressive-muscle-relaxation", category:"somatic", targetStates:["fight_flight","fawn"], description:"Systematically tense and release muscle groups to discharge stored tension.", instructions:"1. Start with feet: tense 5s, release\n2. Move to calves, thighs, glutes\n3. Stomach, chest, hands, arms\n4. Shoulders, neck, face\n5. Notice the contrast between tension and release", durationSeconds:300, difficulty:"beginner", scienceNote:"Teaches the nervous system the difference between tension and relaxation.", sortOrder:11 },
  { name:"Body Scan", slug:"body-scan", category:"somatic", targetStates:["freeze","dorsal_collapse"], description:"Systematic attention through your body to reconnect and notice sensations.", instructions:"1. Close eyes, breathe normally\n2. Notice sensations in feet\n3. Slowly move attention up: legs, hips, belly\n4. Continue: chest, hands, arms, shoulders\n5. Neck, face, top of head\n6. Just notice — no need to change anything", durationSeconds:300, difficulty:"beginner", sortOrder:12 },
  { name:"Butterfly Hug", slug:"butterfly-hug", category:"somatic", targetStates:["fight_flight","fawn"], description:"Cross-arm tapping for bilateral stimulation and self-soothing.", instructions:"1. Cross arms over chest, hands on shoulders\n2. Alternate tapping left and right\n3. Keep a gentle, steady rhythm\n4. Breathe normally\n5. Continue for the full duration", durationSeconds:120, difficulty:"beginner", scienceNote:"Bilateral stimulation activates both brain hemispheres, similar to EMDR processing.", sortOrder:13 },
  { name:"Tension Release Exercises", slug:"tension-release-exercises", category:"somatic", targetStates:["fight_flight"], description:"Gentle tremoring exercises to release deep muscular tension.", instructions:"1. Stand with feet shoulder-width apart\n2. Bend knees slightly and hold\n3. Let legs begin to tremble naturally\n4. Allow the tremoring to spread\n5. Breathe and let your body shake\n6. Slowly come to stillness", durationSeconds:300, difficulty:"intermediate", scienceNote:"TRE activates the body's natural tremor mechanism to release stored stress.", sortOrder:14 },
  { name:"Jaw Release Sequence", slug:"jaw-release", category:"somatic", targetStates:["fight_flight","fawn"], description:"Targeted massage and stretching to release jaw tension.", instructions:"1. Place fingers on jaw muscles\n2. Massage in small circles 30s\n3. Open mouth wide, hold 5s\n4. Move jaw side to side gently\n5. Let jaw hang open loosely\n6. Repeat massage", durationSeconds:120, difficulty:"beginner", sortOrder:15 },
  { name:"Hip Opening Sequence", slug:"hip-opening", category:"somatic", targetStates:["fight_flight","fawn"], description:"Gentle stretches to release tension stored in the hips.", instructions:"1. Seated: bring soles of feet together\n2. Gently press knees toward floor 30s\n3. Cross one ankle over opposite knee\n4. Lean forward gently 30s each side\n5. Hug knees to chest, rock side to side", durationSeconds:300, difficulty:"intermediate", sortOrder:16 },
  { name:"Shoulder Drop & Roll", slug:"shoulder-drop-roll", category:"somatic", targetStates:["fight_flight"], description:"Systematic shoulder tension release through movement.", instructions:"1. Inhale: squeeze shoulders to ears\n2. Hold 3s\n3. Exhale: drop shoulders completely\n4. Roll shoulders forward 5 times\n5. Roll shoulders backward 5 times\n6. Repeat the squeeze-drop cycle", durationSeconds:120, difficulty:"beginner", sortOrder:17 },
  { name:"Spinal Wave", slug:"spinal-wave", category:"somatic", targetStates:["freeze","dorsal_collapse"], description:"Gentle seated spinal undulation to awaken body awareness.", instructions:"1. Sit tall in a chair\n2. Begin a gentle wave from tailbone upward\n3. Let spine curl forward then extend back\n4. Move slowly like a wave through your spine\n5. Let the movement be fluid and organic", durationSeconds:180, difficulty:"beginner", sortOrder:18 },
  // VAGAL TONING (7)
  { name:"Humming Bee Breath", slug:"humming-bee-breath", category:"vagal_toning", targetStates:["fight_flight","freeze"], description:"Inhale deeply, hum on the exhale to vibrate and tone the vagus nerve.", instructions:"1. Inhale deeply through nose 4s\n2. Exhale with a steady humming sound 8s\n3. Feel the vibration in your throat and chest\n4. Repeat", durationSeconds:180, difficulty:"beginner", breathCues:{inhale:4,hold:0,exhale:8,holdEmpty:0}, scienceNote:"Humming vibrates the vagus nerve directly through the larynx.", sortOrder:19 },
  { name:"Cold Face Splash", slug:"cold-face-splash", category:"vagal_toning", targetStates:["fight_flight"], description:"Splash cold water on your face to trigger the mammalian dive reflex.", instructions:"1. Get a bowl of cold water or use the tap\n2. Splash cold water on your face\n3. Focus on forehead, cheeks, around eyes\n4. Hold a cold cloth on your face for 15s\n5. Breathe slowly", durationSeconds:30, difficulty:"beginner", scienceNote:"Triggers the mammalian dive reflex, instantly activating the parasympathetic system.", sortOrder:20 },
  { name:"Gargling", slug:"gargling", category:"vagal_toning", targetStates:["freeze","dorsal_collapse"], description:"Vigorous gargling to activate vagus nerve through throat muscles.", instructions:"1. Take a mouthful of water\n2. Gargle vigorously for 15-20 seconds\n3. The goal is to gargle hard enough to make your eyes water slightly\n4. Spit and repeat 3-4 times", durationSeconds:60, difficulty:"beginner", scienceNote:"Activates the vagus nerve through the muscles at the back of the throat.", sortOrder:21 },
  { name:"Singing & Chanting", slug:"singing-chanting", category:"vagal_toning", targetStates:["freeze","dorsal_collapse"], description:"Sustained vocalization to stimulate vagal tone and lift energy.", instructions:"1. Choose a simple song or chant\n2. Sing or chant at a comfortable volume\n3. Focus on sustaining long notes\n4. Feel the vibration in your chest\n5. Continue for the full duration", durationSeconds:180, difficulty:"beginner", sortOrder:22 },
  { name:"Ear Massage", slug:"ear-massage", category:"vagal_toning", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Systematic ear stimulation targeting the auricular vagus nerve branch.", instructions:"1. Gently pull earlobes downward 10x\n2. Massage the outer rim of each ear\n3. Use thumb and finger to rub behind ears\n4. Gently tug ears outward\n5. Massage the tragus (small flap) in circles", durationSeconds:120, difficulty:"beginner", scienceNote:"The auricular branch of the vagus nerve runs through the ear.", sortOrder:23 },
  { name:"Neck Stretches", slug:"neck-stretches", category:"vagal_toning", targetStates:["fight_flight"], description:"Gentle lateral neck stretches to release tension around the vagus nerve.", instructions:"1. Drop right ear toward right shoulder\n2. Hold 15s, breathe into the stretch\n3. Return to center\n4. Drop left ear toward left shoulder\n5. Hold 15s\n6. Gently rotate chin toward each shoulder", durationSeconds:120, difficulty:"beginner", sortOrder:24 },
  { name:"Voo Breath", slug:"voo-breath", category:"vagal_toning", targetStates:["freeze","dorsal_collapse"], description:"Deep vibrating 'voo' sound on exhale to stimulate vagal tone.", instructions:"1. Inhale deeply through nose\n2. Exhale with a deep 'voooo' sound\n3. Make it low-pitched and resonant\n4. Feel vibration in belly and chest\n5. Repeat", durationSeconds:180, difficulty:"intermediate", scienceNote:"The deep vibration of the voo sound resonates through the core, stimulating the vagus nerve along its path.", sortOrder:25 },
  // GROUNDING (6)
  { name:"5-4-3-2-1 Senses", slug:"5-4-3-2-1-senses", category:"grounding", targetStates:["fight_flight","freeze"], description:"Name things for each sense to anchor yourself in the present moment.", instructions:"1. Name 5 things you can SEE\n2. Name 4 things you can TOUCH\n3. Name 3 things you can HEAR\n4. Name 2 things you can SMELL\n5. Name 1 thing you can TASTE", durationSeconds:180, difficulty:"beginner", sortOrder:26 },
  { name:"Feet on Ground", slug:"feet-on-ground", category:"grounding", targetStates:["fight_flight","freeze","fawn"], description:"Feel your feet pressing into the floor to reconnect with your body.", instructions:"1. Stand or sit with feet flat on floor\n2. Press feet down firmly\n3. Notice the pressure, temperature, texture\n4. Rock slightly forward and back\n5. Find your center of gravity\n6. Breathe and feel supported", durationSeconds:120, difficulty:"beginner", sortOrder:27 },
  { name:"Cold Water Hands", slug:"cold-water-hands", category:"grounding", targetStates:["fight_flight"], description:"Run cold water over hands to quickly ground through sensory input.", instructions:"1. Run cold water over your hands\n2. Focus on the sensation of temperature\n3. Notice front and back of hands\n4. Rub hands together under the water\n5. Pat cold hands on your face and neck", durationSeconds:60, difficulty:"beginner", sortOrder:28 },
  { name:"Orienting Exercise", slug:"orienting-exercise", category:"grounding", targetStates:["freeze"], description:"Slowly look around the room, naming objects to reconnect with your environment.", instructions:"1. Slowly turn your head to look around\n2. Name each object you see out loud\n3. Notice colors, shapes, textures\n4. Take your time — there is no rush\n5. Let your eyes rest on anything pleasant", durationSeconds:120, difficulty:"beginner", sortOrder:29 },
  { name:"Texture Touch", slug:"texture-touch", category:"grounding", targetStates:["freeze","dorsal_collapse"], description:"Find and focus on different textures to reconnect through touch.", instructions:"1. Find something soft — feel it fully\n2. Find something rough — notice the contrast\n3. Find something cool — hold it\n4. Find something smooth — run fingers over it\n5. Notice which texture feels most calming", durationSeconds:120, difficulty:"beginner", sortOrder:30 },
  { name:"Barefoot Walking", slug:"barefoot-walking", category:"grounding", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Mindful barefoot walking to connect with the earth.", instructions:"1. Remove shoes and socks\n2. Walk slowly on a natural surface\n3. Feel each part of your foot: heel, arch, toes\n4. Notice temperature and texture of ground\n5. Walk in a slow, deliberate pace\n6. Breathe in rhythm with your steps", durationSeconds:300, difficulty:"beginner", sortOrder:31 },
  // SOUND HEALING (5)
  { name:"Binaural Beats Calm", slug:"binaural-beats-calm", category:"sound", targetStates:["fight_flight"], description:"Listen to preset binaural beats tuned for calm and relaxation.", instructions:"1. Put on headphones (required for binaural beats)\n2. Close your eyes\n3. Listen without trying to do anything\n4. Let the tones wash over you\n5. Breathe naturally", durationSeconds:600, difficulty:"beginner", isPremium:true, sortOrder:32 },
  { name:"528 Hz Solfeggio Tone", slug:"528-hz-solfeggio", category:"sound", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Listen to the 528 Hz frequency associated with healing and repair.", instructions:"1. Find a comfortable position\n2. Play the 528 Hz tone\n3. Close your eyes\n4. Breathe slowly and deeply\n5. Let the frequency resonate through you", durationSeconds:300, difficulty:"beginner", isPremium:true, sortOrder:33 },
  { name:"Brown Noise Grounding", slug:"brown-noise-grounding", category:"sound", targetStates:["freeze","dorsal_collapse"], description:"Deep brown noise to promote grounding and body awareness.", instructions:"1. Play brown noise at comfortable volume\n2. Close your eyes\n3. Let the deep tones anchor you\n4. Notice your body settling\n5. Breathe slowly", durationSeconds:300, difficulty:"beginner", isPremium:true, sortOrder:34 },
  { name:"Tibetan Bowl Resonance", slug:"tibetan-bowl-resonance", category:"sound", targetStates:["fight_flight","ventral_vagal"], description:"Singing bowl tones for deep relaxation and vagal stimulation.", instructions:"1. Play singing bowl tones\n2. Close eyes and listen\n3. Feel the vibrations in your body\n4. Let each tone fade completely before the next\n5. Breathe in the spaces between tones", durationSeconds:420, difficulty:"beginner", isPremium:true, sortOrder:35 },
  { name:"Vocal Toning Scale", slug:"vocal-toning-scale", category:"sound", targetStates:["freeze","dorsal_collapse"], description:"Hum an ascending scale to activate vagal tone through vocalization.", instructions:"1. Start with a low comfortable hum\n2. Slowly raise the pitch\n3. Hold each note for a full breath\n4. Go as high as comfortable\n5. Descend back down\n6. Repeat the full scale", durationSeconds:180, difficulty:"intermediate", sortOrder:36 },
  // COLD EXPOSURE (2)
  { name:"Cold Hands Immersion", slug:"cold-hands-immersion", category:"cold_exposure", targetStates:["fight_flight"], description:"Immerse hands in cold water to activate the dive reflex.", instructions:"1. Fill a bowl with cold water and ice if available\n2. Submerge both hands fully\n3. Keep hands in for 30-60 seconds\n4. Breathe slowly through the discomfort\n5. Remove and notice the energy shift", durationSeconds:60, difficulty:"intermediate", sortOrder:37 },
  { name:"Cold Shower Finish", slug:"cold-shower-finish", category:"cold_exposure", targetStates:["fight_flight"], description:"End your shower with 30-60 seconds of cold water.", instructions:"1. At the end of your warm shower\n2. Turn water to cold\n3. Start with legs, then arms, then torso\n4. Breathe slowly through the shock\n5. Stay for 30-60 seconds\n6. Notice the energy and alertness after", durationSeconds:60, difficulty:"advanced", sortOrder:38 },
  // MOVEMENT (5)
  { name:"Vagal Walk", slug:"vagal-walk", category:"movement", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Slow intentional walking synchronized with breath.", instructions:"1. Walk at half your normal pace\n2. Inhale for 4 steps\n3. Exhale for 6 steps\n4. Let arms swing naturally\n5. Look around with soft eyes\n6. Continue for the full duration", durationSeconds:300, difficulty:"beginner", sortOrder:39 },
  { name:"Joint Circles", slug:"joint-circles", category:"movement", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Systematic joint mobilization to release tension throughout the body.", instructions:"1. Ankle circles: 10 each direction per foot\n2. Knee circles: 10 each direction\n3. Hip circles: 10 each direction\n4. Wrist circles: 10 each direction\n5. Shoulder circles: 10 each direction\n6. Neck circles: 5 each direction (gently)", durationSeconds:180, difficulty:"beginner", sortOrder:40 },
  { name:"Cross-Crawl", slug:"cross-crawl", category:"movement", targetStates:["freeze"], description:"Bilateral movement crossing the midline for brain integration.", instructions:"1. Stand comfortably\n2. Lift right knee, touch with left hand\n3. Lower, then lift left knee, touch with right hand\n4. Continue alternating\n5. Keep a steady rhythm\n6. Add complexity: touch knee behind your back", durationSeconds:120, difficulty:"beginner", scienceNote:"Crossing the body's midline activates both brain hemispheres simultaneously.", sortOrder:41 },
  { name:"Gentle Swaying", slug:"gentle-swaying", category:"movement", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Standing weight shift to activate the vestibular system and soothe.", instructions:"1. Stand with feet hip-width apart\n2. Shift weight slowly to right foot\n3. Shift weight slowly to left foot\n4. Like a tree swaying in gentle wind\n5. Let arms hang loose\n6. Breathe naturally", durationSeconds:120, difficulty:"beginner", sortOrder:42 },
  { name:"Shake It Off", slug:"shake-it-off", category:"movement", targetStates:["fight_flight","freeze"], description:"Whole-body shaking to discharge stored stress and tension.", instructions:"1. Stand with soft knees\n2. Begin shaking your hands\n3. Let it spread to arms, shoulders\n4. Shake your whole body\n5. Include legs, hips, head\n6. Gradually slow down and stop\n7. Stand still and notice the buzzing", durationSeconds:180, difficulty:"beginner", scienceNote:"Animals in the wild shake after a threat to discharge stress hormones. Humans can do the same.", sortOrder:43 },
  // SELF-COMPASSION (3)
  { name:"Compassionate Touch", slug:"compassionate-touch", category:"self_compassion", targetStates:["fawn","dorsal_collapse"], description:"Systematic self-touch protocol for nervous system soothing.", instructions:"1. Place both hands over your heart\n2. Feel warmth and pressure 30s\n3. Move one hand to belly\n4. Hold heart and belly 30s\n5. Cup your face with both hands\n6. Give yourself a gentle hug", durationSeconds:180, difficulty:"beginner", sortOrder:44 },
  { name:"Inner Child Check-In", slug:"inner-child-check-in", category:"self_compassion", targetStates:["fawn","dorsal_collapse"], description:"Guided visualization to connect with and comfort your younger self.", instructions:"1. Close eyes, breathe slowly\n2. Imagine yourself as a young child\n3. Notice what they need\n4. Offer them words of comfort\n5. Tell them they are safe\n6. Give them a mental hug\n7. Breathe together", durationSeconds:300, difficulty:"intermediate", isPremium:true, sortOrder:45 },
  { name:"Loving-Kindness Breath", slug:"loving-kindness-breath", category:"self_compassion", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Breathwork combined with loving-kindness phrases.", instructions:"1. Breathe slowly and deeply\n2. On inhale, think 'May I be safe'\n3. On exhale, think 'May I be at peace'\n4. Next breath: 'May I be healthy / May I be happy'\n5. Then extend to others: 'May you be safe...'\n6. Continue alternating", durationSeconds:300, difficulty:"intermediate", isPremium:true, sortOrder:46 },
  // ADVANCED VAGAL (4)
  { name:"Dive Reflex Activation", slug:"dive-reflex-activation", category:"advanced_vagal", targetStates:["fight_flight"], description:"Combine cold and breath hold to powerfully activate the dive reflex.", instructions:"1. Fill a bowl with cold water\n2. Take a deep breath and hold\n3. Submerge your face in cold water 15-30s\n4. Come up and breathe normally\n5. Wait 30s, repeat 2-3 times", durationSeconds:60, difficulty:"advanced", isPremium:true, scienceNote:"The dive reflex combines cold exposure and apnea to powerfully activate parasympathetic tone.", sortOrder:47 },
  { name:"Valsalva Maneuver", slug:"valsalva-maneuver", category:"advanced_vagal", targetStates:["fight_flight"], description:"Controlled pressure technique to stimulate the vagus nerve.", instructions:"1. Take a moderate breath in\n2. Close mouth and pinch nose\n3. Try to exhale gently against closed airways 10-15s\n4. Release and breathe normally\n5. Wait 30s between attempts\n6. Repeat 3-4 times", durationSeconds:60, difficulty:"advanced", isPremium:true, contraindications:"Avoid if you have heart conditions, high blood pressure, or are pregnant.", sortOrder:48 },
  { name:"Unilateral Nostril Breathing", slug:"unilateral-nostril-breathing", category:"advanced_vagal", targetStates:["fight_flight","freeze"], description:"Single nostril focus for targeted nervous system activation.", instructions:"1. Close right nostril with thumb\n2. Breathe only through left nostril for 2 min\n3. This activates the calming right brain hemisphere\n4. Switch: close left, breathe through right for 2 min\n5. This activates the energizing left hemisphere\n6. End with 1 min of normal breathing", durationSeconds:300, difficulty:"intermediate", sortOrder:49 },
  { name:"Vagal Brake Training", slug:"vagal-brake-training", category:"advanced_vagal", targetStates:["fight_flight","freeze","fawn","dorsal_collapse","ventral_vagal"], description:"Controlled HRV modulation through precise breath ratios.", instructions:"1. Start with 4s inhale, 4s exhale (1 min)\n2. Shift to 4s inhale, 6s exhale (1 min)\n3. Shift to 4s inhale, 8s exhale (1 min)\n4. Return to 4s inhale, 6s exhale (1 min)\n5. Return to 4s inhale, 4s exhale (1 min)\n6. Notice how your body responded to each ratio", durationSeconds:300, difficulty:"advanced", isPremium:true, scienceNote:"Training the vagal brake by progressively shifting exhale ratios builds autonomic flexibility.", sortOrder:50 },
]

// Helper to generate program modules
function generateModules(config: { weeks: number; dailyThemes: { title: string; desc: string; protocols: string[]; journal: string }[] }) {
  const modules = []
  for (let i = 0; i < config.dailyThemes.length; i++) {
    const theme = config.dailyThemes[i]
    modules.push({ week: Math.floor(i / 7) + 1, day: i + 1, title: theme.title, description: theme.desc, protocolSlugs: theme.protocols, journalPrompt: theme.journal })
  }
  return modules
}

const programs = [
  {
    name: "The 21-Day Nervous System Reset",
    slug: "21-day-reset",
    description: "A comprehensive 3-week journey to understand, regulate, and strengthen your nervous system. Start from the foundations and build lasting regulation skills.",
    durationWeeks: 3,
    targetAudience: "everyone",
    difficulty: "beginner",
    modules: generateModules({ weeks: 3, dailyThemes: [
      // Week 1: Foundations
      { title:"Meet Your Nervous System", desc:"Learn to recognize your current state", protocols:["physiological-sigh","feet-on-ground"], journal:"What does stress feel like in your body right now?" },
      { title:"The Power of Breath", desc:"Your breath is the remote control to your nervous system", protocols:["4-7-8-breathing","three-part-breath"], journal:"When do you notice your breathing changes during the day?" },
      { title:"Grounding Basics", desc:"Learn to anchor yourself in the present", protocols:["5-4-3-2-1-senses","feet-on-ground"], journal:"Where in your body do you feel most connected right now?" },
      { title:"Body Awareness", desc:"Start listening to what your body is telling you", protocols:["body-scan","shoulder-drop-roll"], journal:"What sensations did you notice during the body scan?" },
      { title:"Vagal Toning Intro", desc:"Meet your vagus nerve — your regulation superhighway", protocols:["humming-bee-breath","ear-massage"], journal:"How did the humming feel in your body?" },
      { title:"Movement as Medicine", desc:"Gentle movement to shift your state", protocols:["gentle-swaying","joint-circles"], journal:"How does your body feel different after moving?" },
      { title:"Week 1 Integration", desc:"Bring it all together with your favorite practices", protocols:["coherence-breathing","butterfly-hug"], journal:"What have you learned about your nervous system this week?" },
      // Week 2: Deepening
      { title:"Somatic Release", desc:"Let your body release stored tension", protocols:["progressive-muscle-relaxation","jaw-release"], journal:"Where do you hold tension most? What might it be protecting?" },
      { title:"Vagal Power", desc:"Deepen your vagal toning practice", protocols:["gargling","voo-breath"], journal:"What does safety feel like in your body?" },
      { title:"State Shifting", desc:"Practice moving between states intentionally", protocols:["energizing-breath","extended-exhale"], journal:"What state do you default to under stress?" },
      { title:"Grounding Deepening", desc:"Expand your grounding toolkit", protocols:["orienting-exercise","barefoot-walking"], journal:"When do you feel most grounded during your day?" },
      { title:"Touch & Compassion", desc:"The healing power of safe touch", protocols:["compassionate-touch","butterfly-hug"], journal:"How does it feel to offer yourself compassion?" },
      { title:"Breath Mastery", desc:"Explore more advanced breath patterns", protocols:["alternate-nostril-breathing","box-breathing"], journal:"Which breathing pattern feels most natural to you?" },
      { title:"Week 2 Integration", desc:"Deepening your practice with intention", protocols:["ocean-breath","body-scan"], journal:"How has your relationship with your body changed?" },
      // Week 3: Integration
      { title:"Morning Activation", desc:"Build an energizing morning routine", protocols:["energizing-breath","cross-crawl"], journal:"How do you want to feel when you start your day?" },
      { title:"Midday Reset", desc:"Quick regulation tools for busy days", protocols:["physiological-sigh","shoulder-drop-roll"], journal:"What triggers dysregulation during your workday?" },
      { title:"Evening Wind-Down", desc:"Prepare your nervous system for rest", protocols:["4-7-8-breathing","progressive-muscle-relaxation"], journal:"What helps you transition from doing to being?" },
      { title:"Stress Inoculation", desc:"Build resilience through controlled activation", protocols:["cold-water-hands","shake-it-off"], journal:"How do you want to respond when stress hits?" },
      { title:"Your Regulation Toolkit", desc:"Identify your go-to practices", protocols:["coherence-breathing","compassionate-touch"], journal:"Which 3 practices will you keep using daily?" },
      { title:"Celebration & Review", desc:"Honor how far you've come", protocols:["loving-kindness-breath","gentle-swaying"], journal:"What has shifted in you over these 21 days?" },
      { title:"The Path Forward", desc:"Set intentions for ongoing practice", protocols:["ocean-breath","barefoot-walking"], journal:"What does your ideal daily regulation practice look like?" },
    ]}),
  },
  {
    name: "Sleep Restoration Protocol",
    slug: "sleep-restoration",
    description: "A 2-week program to rebuild your relationship with sleep through evening wind-down sequences, morning activation, and circadian rhythm education.",
    durationWeeks: 2,
    targetAudience: "sleep",
    difficulty: "beginner",
    modules: generateModules({ weeks: 2, dailyThemes: [
      { title:"Sleep & Your Nervous System", desc:"How dysregulation disrupts sleep", protocols:["4-7-8-breathing","body-scan"], journal:"Describe your current relationship with sleep." },
      { title:"Evening Wind-Down", desc:"Create a calming pre-sleep ritual", protocols:["extended-exhale","progressive-muscle-relaxation"], journal:"What does your current bedtime routine look like?" },
      { title:"Morning Light Reset", desc:"Use morning to set your circadian clock", protocols:["energizing-breath","joint-circles"], journal:"How do you typically feel when you wake up?" },
      { title:"The 90-Minute Rule", desc:"Align with your natural sleep cycles", protocols:["coherence-breathing","gentle-swaying"], journal:"What time do you naturally get sleepy?" },
      { title:"Releasing the Day", desc:"Let go of the day's tension before bed", protocols:["jaw-release","shoulder-drop-roll"], journal:"What from today can you release right now?" },
      { title:"Deep Rest Practice", desc:"Train your body to fully relax", protocols:["body-scan","humming-bee-breath"], journal:"What does deep rest feel like to you?" },
      { title:"Week 1 Review", desc:"Assess your sleep improvements", protocols:["4-7-8-breathing","compassionate-touch"], journal:"What has changed about your sleep this week?" },
      { title:"Advanced Wind-Down", desc:"Deepen your evening protocol", protocols:["alternate-nostril-breathing","hip-opening"], journal:"How does your body feel different in the evening now?" },
      { title:"Nap Architecture", desc:"Strategic rest without disrupting nighttime sleep", protocols:["physiological-sigh","feet-on-ground"], journal:"When during the day do you feel most tired?" },
      { title:"Dream & Processing", desc:"Understanding night-time processing", protocols:["ocean-breath","body-scan"], journal:"Have you noticed any changes in your dreams?" },
      { title:"Weekend Sleep", desc:"Maintaining rhythm on free days", protocols:["vagal-walk","three-part-breath"], journal:"How does your weekend sleep differ from weekdays?" },
      { title:"Nighttime Waking", desc:"Tools for middle-of-night activation", protocols:["extended-exhale","ear-massage"], journal:"What happens when you wake in the night?" },
      { title:"Sleep Environment", desc:"Optimize your space for regulation", protocols:["straw-breathing","texture-touch"], journal:"What about your sleep environment could improve?" },
      { title:"Your Sleep Protocol", desc:"Finalize your personal sleep ritual", protocols:["4-7-8-breathing","progressive-muscle-relaxation"], journal:"Write out your ideal evening-to-morning sleep protocol." },
    ]}),
  },
  {
    name: "Burnout Recovery",
    slug: "burnout-recovery",
    description: "A 4-week intensive for high-achievers recovering from burnout. Combines nervous system regulation with energy management and boundary-setting somatic practices.",
    durationWeeks: 4,
    targetAudience: "burnout_recovery",
    difficulty: "intermediate",
    modules: generateModules({ weeks: 4, dailyThemes: [
      // Week 1
      { title:"Recognizing Burnout", desc:"Understanding your body's shutdown signals", protocols:["body-scan","feet-on-ground"], journal:"When did you first notice you were burning out?" },
      { title:"Permission to Rest", desc:"Your nervous system needs recovery, not more pushing", protocols:["compassionate-touch","extended-exhale"], journal:"What makes it hard for you to rest?" },
      { title:"Energy Audit", desc:"Where is your energy actually going?", protocols:["gentle-swaying","three-part-breath"], journal:"List your top 5 energy drains and top 5 energy sources." },
      { title:"The Freeze Response", desc:"Burnout often masks a freeze state", protocols:["spinal-wave","voo-breath"], journal:"Do you feel more wired or more shut down?" },
      { title:"Micro-Recovery", desc:"2-minute resets throughout the day", protocols:["physiological-sigh","shoulder-drop-roll"], journal:"Where in your day could you insert a 2-minute reset?" },
      { title:"Boundaries as Regulation", desc:"Saying no is a nervous system practice", protocols:["jaw-release","box-breathing"], journal:"What boundary would most help your recovery?" },
      { title:"Week 1 Check-In", desc:"Gentle assessment of where you are", protocols:["coherence-breathing","body-scan"], journal:"What feels different after one week of intentional regulation?" },
      // Week 2
      { title:"Rebuilding Energy", desc:"Gentle activation without pushing", protocols:["energizing-breath","cross-crawl"], journal:"What does sustainable energy feel like?" },
      { title:"The Achiever Pattern", desc:"Why your nervous system learned to push", protocols:["butterfly-hug","humming-bee-breath"], journal:"What were you taught about rest growing up?" },
      { title:"Pleasure & Play", desc:"Reconnecting with what feels good", protocols:["vagal-walk","ear-massage"], journal:"What did you enjoy before burnout took over?" },
      { title:"Digital Boundaries", desc:"Screen time and nervous system load", protocols:["orienting-exercise","neck-stretches"], journal:"How does screen time affect your energy?" },
      { title:"Somatic Release", desc:"Letting the body release stored tension", protocols:["tension-release-exercises","shake-it-off"], journal:"What did you notice during the release exercises?" },
      { title:"Nourishment Practices", desc:"Feeding your nervous system what it needs", protocols:["ocean-breath","barefoot-walking"], journal:"What nourishes you beyond food?" },
      { title:"Week 2 Integration", desc:"Noticing the shifts", protocols:["loving-kindness-breath","gentle-swaying"], journal:"How has your energy changed this week?" },
      // Week 3
      { title:"Values Realignment", desc:"Burnout often signals misaligned values", protocols:["coherence-breathing","compassionate-touch"], journal:"What matters most to you right now?" },
      { title:"Capacity Building", desc:"Gradually increasing your window of tolerance", protocols:["box-breathing","cold-water-hands"], journal:"What used to overwhelm you that feels manageable now?" },
      { title:"Relational Energy", desc:"Which relationships regulate vs dysregulate you?", protocols:["alternate-nostril-breathing","butterfly-hug"], journal:"Who helps your nervous system feel safe?" },
      { title:"Creative Recovery", desc:"Creativity as regulation", protocols:["vocal-toning-scale","spinal-wave"], journal:"When did you last create something just for fun?" },
      { title:"Sleep & Recovery", desc:"Optimizing rest for burnout recovery", protocols:["4-7-8-breathing","progressive-muscle-relaxation"], journal:"How is your sleep quality changing?" },
      { title:"Joy Practice", desc:"Actively cultivating positive states", protocols:["vagal-walk","singing-chanting"], journal:"What brought you joy today, even briefly?" },
      { title:"Week 3 Reflection", desc:"Celebrating your recovery progress", protocols:["ocean-breath","body-scan"], journal:"What would you tell yourself from 3 weeks ago?" },
      // Week 4
      { title:"Sustainable Rhythms", desc:"Building daily patterns that prevent burnout", protocols:["coherence-breathing","joint-circles"], journal:"What does a sustainable daily rhythm look like for you?" },
      { title:"Stress Inoculation", desc:"Building resilience without overdoing", protocols:["physiological-sigh","cold-water-hands"], journal:"How do you want to handle stress differently going forward?" },
      { title:"Work Boundaries", desc:"Protecting your energy at work", protocols:["shoulder-drop-roll","straw-breathing"], journal:"What one work boundary will you commit to?" },
      { title:"Support Systems", desc:"Building a regulation-supportive environment", protocols:["compassionate-touch","humming-bee-breath"], journal:"What support do you need that you haven't asked for?" },
      { title:"Relapse Prevention", desc:"Recognizing early warning signs", protocols:["body-scan","feet-on-ground"], journal:"What are your personal early warning signs of burnout?" },
      { title:"Your Recovery Toolkit", desc:"Your personalized regulation practice", protocols:["coherence-breathing","butterfly-hug"], journal:"Which 5 practices are your non-negotiable daily toolkit?" },
      { title:"Moving Forward", desc:"From recovery to thriving", protocols:["loving-kindness-breath","barefoot-walking"], journal:"What does thriving look like for you now?" },
    ]}),
  },
  {
    name: "Anxiety Unwinding",
    slug: "anxiety-unwinding",
    description: "A 3-week program specifically targeting fight/flight and fawn patterns. Progressive exposure to activation paired with regulation skills.",
    durationWeeks: 3,
    targetAudience: "anxiety",
    difficulty: "beginner",
    modules: generateModules({ weeks: 3, dailyThemes: [
      { title:"Understanding Anxiety", desc:"Anxiety is your nervous system's alarm — let's learn to work with it", protocols:["physiological-sigh","feet-on-ground"], journal:"What does anxiety feel like in your body?" },
      { title:"The Safety Signal", desc:"Teaching your body it's safe right now", protocols:["extended-exhale","orienting-exercise"], journal:"When did you last feel truly safe?" },
      { title:"Chest & Throat Release", desc:"Where anxiety lives in the body", protocols:["three-part-breath","jaw-release"], journal:"Where do you feel anxiety most — chest, throat, stomach?" },
      { title:"Grounding When Spinning", desc:"Anchoring when thoughts race", protocols:["5-4-3-2-1-senses","cold-water-hands"], journal:"What thoughts loop most when you're anxious?" },
      { title:"Vagal Soothing", desc:"Direct nervous system calming techniques", protocols:["humming-bee-breath","ear-massage"], journal:"What helps you feel calm, even a little?" },
      { title:"The Fawn Pattern", desc:"When anxiety shows up as people-pleasing", protocols:["butterfly-hug","compassionate-touch"], journal:"Do you notice yourself over-accommodating others when anxious?" },
      { title:"Week 1 Reflection", desc:"Reviewing your anxiety patterns", protocols:["coherence-breathing","body-scan"], journal:"What have you learned about your anxiety this week?" },
      { title:"Expanding the Window", desc:"Gradually building tolerance for activation", protocols:["box-breathing","shoulder-drop-roll"], journal:"What small stressor could you practice regulating through?" },
      { title:"Social Anxiety Tools", desc:"Regulation before and during social situations", protocols:["straw-breathing","neck-stretches"], journal:"How does your body change in social situations?" },
      { title:"Worry Release", desc:"Discharging anxious energy through movement", protocols:["shake-it-off","vagal-walk"], journal:"What worries can you release right now?" },
      { title:"Nighttime Anxiety", desc:"When anxiety peaks before sleep", protocols:["4-7-8-breathing","progressive-muscle-relaxation"], journal:"What keeps you awake at night?" },
      { title:"The Inner Critic", desc:"Anxiety's companion — the voice of not enough", protocols:["loving-kindness-breath","compassionate-touch"], journal:"What does your inner critic say most often?" },
      { title:"Body Trust", desc:"Rebuilding trust in your body's signals", protocols:["body-scan","gentle-swaying"], journal:"When does your body feel trustworthy?" },
      { title:"Week 2 Integration", desc:"Celebrating your growing resilience", protocols:["ocean-breath","butterfly-hug"], journal:"What situations feel less triggering now?" },
      { title:"Anticipatory Anxiety", desc:"Handling the 'what ifs'", protocols:["physiological-sigh","orienting-exercise"], journal:"What upcoming event are you most anxious about?" },
      { title:"Somatic Courage", desc:"Using the body to build confidence", protocols:["energizing-breath","cross-crawl"], journal:"What would courage feel like in your body?" },
      { title:"Trigger Mapping", desc:"Identifying your specific anxiety triggers", protocols:["coherence-breathing","feet-on-ground"], journal:"List your top 5 anxiety triggers." },
      { title:"Post-Trigger Recovery", desc:"Quick regulation after activation", protocols:["physiological-sigh","cold-water-hands"], journal:"How quickly can you return to baseline after a trigger?" },
      { title:"Anxiety vs Excitement", desc:"They share the same physiology — learn to reframe", protocols:["three-part-breath","vocal-toning-scale"], journal:"When might your anxiety actually be excitement?" },
      { title:"Your Anxiety Toolkit", desc:"Building your personal regulation kit", protocols:["box-breathing","butterfly-hug"], journal:"Which 3 tools help your anxiety most?" },
      { title:"Living Beyond Anxiety", desc:"From managing to thriving", protocols:["loving-kindness-breath","barefoot-walking"], journal:"What would your life look like with less anxiety?" },
    ]}),
  },
  {
    name: "The Parent's Nervous System",
    slug: "parents-nervous-system",
    description: "A 2-week program for parents. Learn co-regulation with children, repair after rupture, and micro-regulation techniques for the chaos of parenting.",
    durationWeeks: 2,
    targetAudience: "new_parents",
    difficulty: "beginner",
    modules: generateModules({ weeks: 2, dailyThemes: [
      { title:"Your Regulation = Their Regulation", desc:"Children co-regulate through your nervous system", protocols:["physiological-sigh","coherence-breathing"], journal:"How does your stress affect your children?" },
      { title:"The 10-Second Reset", desc:"Quick regulation in the middle of chaos", protocols:["extended-exhale","feet-on-ground"], journal:"When do you most lose your cool as a parent?" },
      { title:"Rupture & Repair", desc:"Every parent loses it — here's how to repair", protocols:["compassionate-touch","humming-bee-breath"], journal:"Describe a recent rupture. How did you handle it?" },
      { title:"Morning Chaos Protocol", desc:"Regulating through the morning rush", protocols:["energizing-breath","shoulder-drop-roll"], journal:"What's the hardest part of your morning routine?" },
      { title:"Bedtime Battles", desc:"Staying regulated during bedtime resistance", protocols:["4-7-8-breathing","gentle-swaying"], journal:"How does bedtime affect your nervous system?" },
      { title:"Touched Out", desc:"When physical contact becomes overwhelming", protocols:["body-scan","neck-stretches"], journal:"When do you feel 'touched out' and what do you need?" },
      { title:"Week 1 Integration", desc:"Reviewing your parenting regulation", protocols:["ocean-breath","butterfly-hug"], journal:"What's one parenting moment you regulated well this week?" },
      { title:"The Hidden Fawn", desc:"People-pleasing your own children", protocols:["jaw-release","box-breathing"], journal:"Do you notice yourself fawning with your kids?" },
      { title:"Micro-Moments of Calm", desc:"Finding 30-second regulation windows", protocols:["physiological-sigh","ear-massage"], journal:"Where are the hidden calm moments in your day?" },
      { title:"Big Feelings (Theirs)", desc:"Staying regulated while they dysregulate", protocols:["feet-on-ground","straw-breathing"], journal:"Which of your child's emotions is hardest for you?" },
      { title:"Big Feelings (Yours)", desc:"Processing your own activation from parenting", protocols:["tension-release-exercises","voo-breath"], journal:"What feelings come up for you when parenting is hard?" },
      { title:"Partner Co-Regulation", desc:"Regulating together as a team", protocols:["coherence-breathing","compassionate-touch"], journal:"How do you and your partner support each other's regulation?" },
      { title:"Self-Compassion for Parents", desc:"You're doing better than you think", protocols:["loving-kindness-breath","gentle-swaying"], journal:"What would you say to a friend in your exact situation?" },
      { title:"Your Parenting Toolkit", desc:"Sustainable regulation for the long haul", protocols:["physiological-sigh","butterfly-hug"], journal:"What 3 tools will you use daily as a regulated parent?" },
    ]}),
  },
  {
    name: "Emotional Fitness Fundamentals",
    slug: "emotional-fitness",
    description: "A 3-week program teaching emotional regulation as a daily practice. Combines check-ins, journaling, somatic practices, and pattern recognition.",
    durationWeeks: 3,
    targetAudience: "emotional_resilience",
    difficulty: "beginner",
    modules: generateModules({ weeks: 3, dailyThemes: [
      { title:"What Is Emotional Fitness?", desc:"Emotions are data, not damage — learn to work with them", protocols:["coherence-breathing","body-scan"], journal:"How would you rate your emotional fitness right now (1-10)?" },
      { title:"The Emotion-Body Connection", desc:"Every emotion has a physical signature", protocols:["feet-on-ground","three-part-breath"], journal:"Where do you feel sadness? Anger? Joy?" },
      { title:"Naming to Tame", desc:"Labeling emotions reduces their intensity", protocols:["orienting-exercise","extended-exhale"], journal:"Name 5 emotions you felt today." },
      { title:"The Anger Channel", desc:"Anger is energy — learn to use it wisely", protocols:["shake-it-off","jaw-release"], journal:"What is your relationship with anger?" },
      { title:"Sadness as Healing", desc:"Allowing sadness without drowning in it", protocols:["compassionate-touch","humming-bee-breath"], journal:"What are you grieving right now, even quietly?" },
      { title:"Joy Spotting", desc:"Training your brain to notice positive moments", protocols:["vagal-walk","ear-massage"], journal:"List 3 moments of joy or pleasure from today." },
      { title:"Week 1 Review", desc:"Your emotional landscape after one week", protocols:["ocean-breath","butterfly-hug"], journal:"How has your awareness of emotions changed?" },
      { title:"Emotional Triggers", desc:"Understanding what sets you off", protocols:["physiological-sigh","5-4-3-2-1-senses"], journal:"Map your top 3 emotional triggers." },
      { title:"The Freeze-Feel-Flow Model", desc:"Pause, feel the emotion, let it move through", protocols:["body-scan","gentle-swaying"], journal:"Can you recall a time you froze an emotion? What happened?" },
      { title:"Boundaries & Emotions", desc:"Healthy boundaries protect emotional energy", protocols:["box-breathing","shoulder-drop-roll"], journal:"Where do you need a stronger emotional boundary?" },
      { title:"Emotional Contagion", desc:"How others' emotions affect your system", protocols:["alternate-nostril-breathing","neck-stretches"], journal:"Whose emotions do you absorb most easily?" },
      { title:"Self-Regulation vs Co-Regulation", desc:"When to self-soothe vs seek connection", protocols:["compassionate-touch","voo-breath"], journal:"Do you tend to isolate or seek others when emotional?" },
      { title:"Emotional Agility", desc:"Moving fluidly between emotional states", protocols:["energizing-breath","4-7-8-breathing"], journal:"Which emotional transition is hardest for you?" },
      { title:"Week 2 Integration", desc:"Building emotional muscle", protocols:["coherence-breathing","barefoot-walking"], journal:"What emotions are you more comfortable with now?" },
      { title:"Emotional Intelligence at Work", desc:"Regulation in professional settings", protocols:["straw-breathing","feet-on-ground"], journal:"How do emotions show up in your work life?" },
      { title:"Emotional Intimacy", desc:"Vulnerability as strength in relationships", protocols:["loving-kindness-breath","gentle-swaying"], journal:"What emotion is hardest for you to share with others?" },
      { title:"The Inner Landscape", desc:"Deep dive into your emotional patterns", protocols:["body-scan","spinal-wave"], journal:"What emotion do you avoid most? Why?" },
      { title:"Emotional First Aid", desc:"Quick tools for emotional overwhelm", protocols:["physiological-sigh","cold-water-hands"], journal:"What's your go-to when emotions overwhelm you?" },
      { title:"Gratitude as Regulation", desc:"Gratitude shifts your nervous system state", protocols:["coherence-breathing","compassionate-touch"], journal:"Write 5 things you're genuinely grateful for right now." },
      { title:"Your Emotional Toolkit", desc:"Assembling your personal practices", protocols:["ocean-breath","butterfly-hug"], journal:"Which practices most helped your emotional fitness?" },
      { title:"Emotionally Fit for Life", desc:"Sustaining your practice going forward", protocols:["loving-kindness-breath","vagal-walk"], journal:"How will you maintain your emotional fitness practice?" },
    ]}),
  },
]

// ═══════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════
async function main() {
  console.log("Seeding NervSync database...")

  // Clear existing data (order matters for FK constraints)
  await prisma.programEnrollment.deleteMany()
  await prisma.program.deleteMany()
  await prisma.protocol.deleteMany()
  console.log("Cleared existing protocols and programs")

  // Seed protocols
  for (const p of protocols) {
    await prisma.protocol.create({ data: p as any })
  }
  console.log(`Created ${protocols.length} protocols`)

  // Seed programs
  for (const prog of programs) {
    await prisma.program.create({ data: prog as any })
  }
  console.log(`Created ${programs.length} programs`)

  console.log("Seeding complete!")
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
