// data/questions.ts

export type QuestionType = 
  | 'single_choice' 
  | 'ab_choice' 
  | 'mini_task' 
  | 'multi_select_rating' 
  | 'forced_tradeoff'
  | 'multi_select'
  | 'text_input';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  module: string;
  type: QuestionType;
  question: string;
  options?: Option[] | string[];
  skills_list?: string[];
  correct_answer?: string;
  max_selections?: number; // Masalan, "Eng muhim 5 tasini tanlang" degan joylar uchun
}

export const diagnosticQuestions: Question[] = [
  // ==========================================
  // 0. USER GOAL — “Nima xohlaysan?”
  // ==========================================
  {
    id: "goal_1",
    module: "Goal",
    type: "single_choice",
    question: "Hozirgi asosiy maqsadingiz qaysi?",
    options: ["Kasb tanlash", "Birinchi kasbimni boshlash", "Hozirgi kasbimni rivojlantirish", "Boshqa sohaga o'tish", "Daromadimni oshirish", "O'z biznesimni boshlash", "O'qish yo'nalishini tanlash", "Ish topish", "Hali aniq bilmayman"]
  },
  {
    id: "goal_2",
    module: "Goal",
    type: "single_choice",
    question: "Ideal natijaga qachon erishishni xohlaysiz?",
    options: ["1–3 oy", "3–6 oy", "6–12 oy", "1–2 yil", "2+ yil"]
  },
  {
    id: "goal_3",
    module: "Goal",
    type: "single_choice",
    question: "Siz uchun hozir eng muhim natija nima?",
    options: ["Yuqori daromad", "Barqaror ish", "O'zimga mos ish", "Erkinlik", "O'sish", "Jamiyatga foyda", "Xalqaro imkoniyat"]
  },

  // ==========================================
  // 1. INTEREST — “Nimalarga moyilliging bor?”
  // ==========================================
  {
    id: "interest_1",
    module: "Interest",
    type: "ab_choice",
    question: "Quyidagi faoliyatlardan qaysi birini bajarish sizga ko‘proq yoqadi?",
    options: [
      { id: "A", text: "Murakkab muammoni tahlil qilish" },
      { id: "B", text: "Odam bilan suhbatlashib, uning muammosiga yechim topish" }
    ]
  },
  {
    id: "interest_2",
    module: "Interest",
    type: "ab_choice",
    question: "Qaysi biri sizga ko'proq zavq beradi?",
    options: [
      { id: "A", text: "Biror narsani noldan yaratish va dizayn qilish" },
      { id: "B", text: "Tayyor ma'lumotlardan mantiqiy xulosa chiqarish" }
    ]
  },
  {
    id: "interest_3",
    module: "Interest",
    type: "ab_choice",
    question: "Ish jarayonida qaysi birini afzal ko'rasiz?",
    options: [
      { id: "A", text: "Yangi va noodatiy g‘oyalar yaratish" },
      { id: "B", text: "Aniq qoidalar va tizim asosida ishlash" }
    ]
  },

  // ==========================================
  // 2. APTITUDE — “Nimaga qodirligingni tekshiramiz”
  // ==========================================
  {
    id: "apt_1",
    module: "Aptitude",
    type: "mini_task",
    question: "Mantiqiy tahlil: 3 ta mahsulotning sotuvlari berilgan. Qaysi biri eng katta foizlik o'sish ko'rsatgan?",
    options: [
      { id: "A", text: "Mahsulot X (100 tadan 150 taga)" },
      { id: "B", text: "Mahsulot Y (50 tadan 90 taga)" },
      { id: "C", text: "Mahsulot Z (200 tadan 250 taga)" }
    ],
    correct_answer: "B" // Tizim yashirincha tekshiradi
  },

  // ==========================================
  // 3. SKILLS — “Hozir nimalarni bilasan?”
  // ==========================================
  {
    id: "skills_1",
    module: "Skills",
    type: "multi_select_rating",
    question: "Quyidagi ko'nikmalarni qay darajada bilasiz? (0 dan 5 gacha baholang)",
    skills_list: ["Excel / Jadvallar", "Dasturlash", "Sotuv (Sales)", "Muloqot (Communication)", "Dizayn", "Tahlil (Analysis)", "Liderlik", "Chet tillari"]
  },

  // ==========================================
  // 4. VALUES — “Nima sen uchun muhim?”
  // ==========================================
  {
    id: "val_1",
    module: "Values",
    type: "multi_select",
    question: "Siz uchun kelajakdagi karyerangizda eng muhim 3 ta qadriyatni tanlang:",
    max_selections: 3,
    options: ["Daromad", "Barqarorlik", "Mustaqillik", "Ijodkorlik", "Obro‘", "Jamiyatga foyda", "Erkin vaqt", "Odamlarga yordam berish", "Texnologiya"]
  },
  {
    id: "val_2",
    module: "Values",
    type: "forced_tradeoff",
    question: "Qattiq tanlov! Qaysi birini tanlaysiz?",
    options: [
      { id: "A", text: "Yuqori daromad, lekin doimiy bosim va stress" },
      { id: "B", text: "O‘rtacha daromad, lekin ko‘proq erkinlik va xotirjamlik" }
    ]
  },

  // ==========================================
  // 5. WORK STYLE — “Qanday ishlashga moslashgansan?”
  // ==========================================
  {
    id: "style_1",
    module: "Work_Style",
    type: "single_choice",
    question: "Qaysi ish muhiti sizga ko‘proq mos?",
    options: ["Yakka tartibda", "Kichik jamoa", "Katta jamoa/Korporatsiya", "Mijozlar bilan", "Doimiy o‘zgaruvchan muhit", "Tartibli/rutin ish"]
  },
  {
    id: "style_2",
    module: "Work_Style",
    type: "single_choice",
    question: "Ko‘proq nimalar bilan ishlashni xohlaysiz?",
    options: ["Odamlar bilan", "Raqamlar va ma'lumotlar bilan", "Texnologiyalar va dasturlar bilan", "Mexanizmlar/obyektlar bilan"]
  },

  // ==========================================
  // 6. REAL-LIFE CONSTRAINTS — “Haqiqiy sharoiting qanday?”
  // ==========================================
  {
    id: "cons_1",
    module: "Constraints",
    type: "single_choice",
    question: "Haftasiga ta'lim olish yoki yangi kasb o'rganish uchun qancha vaqt ajrata olasiz?",
    options: ["5 soatgacha", "10-15 soat", "20-30 soat", "To'liq kun (Full-time)"]
  },
  {
    id: "cons_2",
    module: "Constraints",
    type: "single_choice",
    question: "Ingliz tili darajangiz qanday?",
    options: ["Umuman bilmayman", "Boshlang'ich (A1-A2)", "O'rta (B1-B2)", "Erkin so'zlashaman (C1+)"]
  },
  {
    id: "cons_3",
    module: "Constraints",
    type: "single_choice",
    question: "Kompyuter va texnik vositalaringiz holati qanday?",
    options: ["Faqat smartfonim bor", "Oddiy (Basic) noutbuk", "Kuchli kompyuter/noutbuk", "Professional uskunalarim bor"]
  },

  // ==========================================
  // 7. SACRIFICE & RESILIENCE — “Qayerda sabr qilish kerak?”
  // ==========================================
  {
    id: "res_1",
    module: "Resilience",
    type: "single_choice",
    question: "Siz uchun quyidagilardan qaysi biri eng qiyini?",
    options: ["Uzoq vaqt bir joyda o'tirish", "Ko‘p odamlar bilan gaplashish", "Doimiy yangi narsalarni o‘rganish", "Noaniqlik va tavakkal qilish", "Yuqori stress va qat'iy deadline'lar"]
  },

  // ==========================================
  // 8. CAREER PREFERENCES — “Qanday hayot xohlaysan?”
  // ==========================================
  {
    id: "pref_1",
    module: "Preferences",
    type: "single_choice",
    question: "Qaysi ish modelini xohlaysiz?",
    options: ["Kompaniya xodimi (Employee)", "Erkin mutaxassis (Freelancer)", "O'z biznesim (Entrepreneur)", "Hali bilmayman"]
  },
  {
    id: "pref_2",
    module: "Preferences",
    type: "text_input",
    question: "Siz uchun ishda MUTLAQO bo‘lmasligi kerak bo‘lgan narsa nima? (Masalan: Tungi smena, mijozlar bilan janjallashish)",
  }
];