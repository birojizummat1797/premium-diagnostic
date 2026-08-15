"use client";

import { useState, useEffect } from "react";
// DIQQAT: import WebApp from "@twa-dev/sdk"; bu yerdan olib tashlandi! (Serverda qulamasligi uchun)

export default function PremiumDiagnostic() {
  const [step, setStep] = useState(0);
  
  // Ma'lumotlarni saqlash (States)
  const [goalAnswers, setGoalAnswers] = useState({ goal: "", timeline: "" });
  const [interestAnswers, setInterestAnswers] = useState<Record<number, string>>({});
  const [aptitudeAnswers, setAptitudeAnswers] = useState<Record<number, string>>({});
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [tradeoffs, setTradeoffs] = useState<Record<number, string>>({});
  const [workStyle, setWorkStyle] = useState({ env: "", task: "", focus: "" });
  const [constraints, setConstraints] = useState({ time: "", budget: "", english: "", tech: "" });
  const [resilience, setResilience] = useState({ study: "", hardest: "" });
  const [preferences, setPreferences] = useState({ model: "", geo: "", noNos: [] as string[] });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // TELEGRAM WEBAPP SOZLAMALARI (Dinamik Import - Xato bermasligi uchun)
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("@twa-dev/sdk").then((module) => {
        const WebApp = module.default;
        WebApp.ready();
        WebApp.expand();
      }).catch((err) => console.error("Telegram SDK yuklanmadi:", err));
    }
  }, []);

  // --- MA'LUMOTLAR BAZASI ---
  const skillsList = ["Excel / Google Sheets", "Dasturlash (Coding)", "Matn yozish (Writing)", "Sotuv (Sales)", "Muloqot va Muzokara", "Dizayn / Video", "Tahlil (Analysis)", "Liderlik / Boshqaruv", "O'qitish / Mentorlik", "Izlanish (Research)", "Marketing / SMM", "Chet tillari", "Texnik / Mexanik ishlar", "Raqamli vositalar (AI, CRM)"];
  const valuesList = ["Daromad", "Barqarorlik", "Mustaqillik", "Ijodkorlik", "Obro'", "Jamiyatga foyda", "Erkin vaqt", "O'sish", "Xalqaro imkoniyat", "Odamlarga yordam berish", "Rahbarlik", "Texnologiya"];
  const interestQuestions = [
    { id: 1, a: "Murakkab muammoni tahlil qilish", b: "Odam bilan suhbatlashib, yechim topish" },
    { id: 2, a: "Biror narsani yaratish yoki dizayn qilish", b: "Tayyor ma'lumotlardan xulosa chiqarish" },
    { id: 3, a: "Jamoani boshqarish va yo'naltirish", b: "Mustaqil va erkin ishlash" },
    { id: 4, a: "Yangi va nostandart g'oyalar yaratish", b: "Aniq qoidalar asosida ishlash" }
  ];
  const aptitudeTasks = [
    { id: 1, tag: "Numerical Reasoning", q: "3 ta mahsulotning sotuvlari e'lon qilindi. Qaysi biri eng yuqori FOIZLI o'sishni ko'rsatgan?", options: ["A mahsulot: 100 ta sotuvdan 150 taga (+50 ta)", "B mahsulot: 50 ta sotuvdan 100 taga (+50 ta)", "C mahsulot: 200 ta sotuvdan 260 taga (+60 ta)"] },
    { id: 2, tag: "Logical Problem Solving", q: "Tizimda birdaniga xatolik yuz berdi va mijozlar shikoyat qila boshladi. Eng mantiqiy birinchi qadamingiz?", options: ["Shikoyatlarga e'tibor bermasdan ishni davom ettirish", "Mijozlardan uzr so'rab, xatoning ildizini tahlil qilish", "Sababni o'rganmasdan darhol kodni o'chirib tashlash"] }
  ];

  // --- PREMIUM VALIDATSIYA ---
  const isStepValid = () => {
    switch (step) {
      case 0: return goalAnswers.goal !== "" && goalAnswers.timeline !== "";
      case 1: return Object.keys(interestAnswers).length === 4;
      case 2: return Object.keys(aptitudeAnswers).length === 2;
      case 3: return selectedSkills.length > 0;
      case 4: return selectedValues.length === 5;
      case 5: return tradeoffs[1] !== undefined && tradeoffs[2] !== undefined;
      case 6: return workStyle.env !== "" && workStyle.task !== "" && workStyle.focus !== "";
      case 7: return constraints.time !== "" && constraints.budget !== "" && constraints.english !== "" && constraints.tech !== "";
      case 8: return resilience.study !== "" && resilience.hardest !== "";
      case 9: return preferences.model !== "" && preferences.geo !== "";
      default: return true;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (step === 9) {
      setStep(10);
      setIsAnalyzing(true);
      setTimeout(() => setIsAnalyzing(false), 3000);
    } else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  // --- TELEGRAM BOTGA MA'LUMOT YUBORISH (Dinamik Import) ---
  const handleComplete = async () => {
    const finalData = {
      action: "diagnostics_completed",
      data: {
        goal: goalAnswers,
        interest: interestAnswers,
        aptitude: aptitudeAnswers,
        skills: selectedSkills,
        values: selectedValues,
        tradeoffs: tradeoffs,
        workStyle: workStyle,
        constraints: constraints,
        resilience: resilience,
        preferences: preferences
      }
    };

    if (typeof window !== "undefined") {
      try {
        const module = await import("@twa-dev/sdk");
        const WebApp = module.default;
        
        if (WebApp.initDataUnsafe?.user) {
          WebApp.sendData(JSON.stringify(finalData));
        } else {
          console.log("To'plangan ma'lumotlar:", finalData);
          alert("Hozir siz kompyuter brauzeridasiz. Bu tizim Telegram bot ichida ishlaganda ma'lumotlarni to'g'ridan-to'g'ri orqaga (botga) yuboradi!");
        }
      } catch (error) {
        console.error("Telegram SDK xatosi:", error);
      }
    }
  };

  // Helper funksiyalar
  const toggleNoNo = (item: string) => {
    if (preferences.noNos.includes(item)) setPreferences({ ...preferences, noNos: preferences.noNos.filter(i => i !== item) });
    else setPreferences({ ...preferences, noNos: [...preferences.noNos, item] });
  };
  const toggleValue = (val: string) => {
    if (selectedValues.includes(val)) setSelectedValues(selectedValues.filter(v => v !== val));
    else if (selectedValues.length < 5) setSelectedValues([...selectedValues, val]);
  };
  const getProgress = () => Math.round((step / 9) * 100);

  return (
    <div className="min-h-screen bg-gray-50 text-black font-sans selection:bg-green-200 pb-24">
      
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm p-4 sticky top-0 z-20">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">Premium <span className="text-green-600">Diagnostika</span></h1>
          <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
            {step < 10 ? `Modul ${step <= 1 ? step : step <= 2 ? 2 : step <= 5 ? 3 : step <= 6 ? 5 : step <= 7 ? 6 : step <= 8 ? 7 : 8} / 8` : "Natija"}
          </span>
        </div>
        <div className="max-w-2xl mx-auto mt-4 bg-gray-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-600 h-full transition-all duration-500 ease-out" style={{ width: `${getProgress()}%` }}></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 mt-4">
        
        {/* MODUL 0: MAQSAD */}
        {step === 0 && (
          <div className="animate-fade-in space-y-10">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Hozirgi asosiy maqsadingiz qaysi?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Kasb tanlash", "Birinchi kasbimni boshlash", "Hozirgi kasbimni rivojlantirish", "Boshqa sohaga o'tish", "Daromadimni oshirish", "O'z biznesimni boshlash", "O'qish yo'nalishini tanlash"].map(opt => (
                  <button key={opt} onClick={() => setGoalAnswers({...goalAnswers, goal: opt})} className={`p-4 rounded-xl border-2 text-left transition-all ${goalAnswers.goal === opt ? "border-green-600 bg-green-50 font-bold shadow-md text-green-900" : "border-gray-200 bg-white hover:border-green-300"}`}>{opt}</button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">2. Ideal natijaga qachon erishmoqchisiz?</h2>
              <div className="grid grid-cols-2 gap-3">
                {["1–3 oy", "3–6 oy", "6–12 oy", "1–2 yil", "2+ yil"].map(opt => (
                  <button key={opt} onClick={() => setGoalAnswers({...goalAnswers, timeline: opt})} className={`p-4 rounded-xl border-2 text-center transition-all ${goalAnswers.timeline === opt ? "border-green-600 bg-green-50 font-bold shadow-md text-green-900" : "border-gray-200 bg-white hover:border-green-300"}`}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODUL 1: MOYILLIK */}
        {step === 1 && (
          <div className="animate-fade-in space-y-10">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 1: Qiziqishlar va Moyillik</div>
            {interestQuestions.map((q, index) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-800">{index + 1}. Qaysi biri sizga ko'proq yoqadi?</h2>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => setInterestAnswers({...interestAnswers, [q.id]: "A"})} className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${interestAnswers[q.id] === "A" ? "border-green-600 bg-green-50 shadow-md text-green-900 font-bold" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${interestAnswers[q.id] === "A" ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-400"}`}>A</div>
                    {q.a}
                  </button>
                  <button onClick={() => setInterestAnswers({...interestAnswers, [q.id]: "B"})} className={`p-4 rounded-xl border-2 text-left flex items-center gap-3 transition-all ${interestAnswers[q.id] === "B" ? "border-green-600 bg-green-50 shadow-md text-green-900 font-bold" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${interestAnswers[q.id] === "B" ? "bg-green-600 text-white border-green-600" : "border-gray-300 text-gray-400"}`}>B</div>
                    {q.b}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODUL 2: MANTIQIY QOBILIYAT */}
        {step === 2 && (
          <div className="animate-fade-in space-y-10">
            <div className="mb-2 text-sm text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="bg-black text-white px-2 py-1 rounded text-xs">Mini-Tasks</span> Modul 2
            </div>
            {aptitudeTasks.map((task, index) => (
              <div key={task.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">{task.tag}</span>
                <h2 className="text-lg font-bold mb-4 text-gray-800 leading-relaxed">{index + 1}. {task.q}</h2>
                <div className="grid grid-cols-1 gap-3">
                  {task.options.map(opt => (
                    <button key={opt} onClick={() => setAptitudeAnswers({...aptitudeAnswers, [task.id]: opt})} className={`p-4 rounded-xl border-2 text-left transition-all ${aptitudeAnswers[task.id] === opt ? "border-black bg-gray-900 text-white font-medium shadow-md" : "border-gray-200 hover:border-gray-400 text-gray-700"}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODUL 3: SKILLS */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 3: Ko'nikmalar</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Hozirda qanday ko'nikmalarga egasiz?</h2>
            <p className="text-gray-500 mb-6">O'zingizda bor deb hisoblagan barcha yo'nalishlarni tanlang.</p>
            <div className="flex flex-wrap gap-3">
              {skillsList.map(skill => (
                <button key={skill} onClick={() => {
                  selectedSkills.includes(skill) ? setSelectedSkills(selectedSkills.filter(s => s !== skill)) : setSelectedSkills([...selectedSkills, skill]);
                }} className={`px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selectedSkills.includes(skill) ? "border-green-600 bg-green-600 text-white shadow-md transform scale-105" : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"}`}>
                  {selectedSkills.includes(skill) && "✓ "} {skill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODUL 4: VALUES */}
        {step === 4 && (
          <div className="animate-fade-in">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 4: Qadriyatlar</div>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Hayotda siz uchun eng muhim bo'lgan 5 tasini tanlang:</h2>
              <span className={`font-bold text-xl px-3 py-1 rounded-lg ${selectedValues.length === 5 ? "bg-green-100 text-green-600" : "bg-gray-200 text-gray-500"}`}>{selectedValues.length}/5</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {valuesList.map(val => (
                <button key={val} onClick={() => toggleValue(val)} disabled={!selectedValues.includes(val) && selectedValues.length >= 5} className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${selectedValues.includes(val) ? "border-black bg-black text-white shadow-md" : selectedValues.length >= 5 ? "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed" : "border-gray-200 bg-white hover:border-gray-400"}`}>
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODUL 4: TRADEOFFS */}
        {step === 5 && (
          <div className="animate-fade-in space-y-12">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Qaysi birini tanlaysiz? (Og'ir tanlov 1)</h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => setTradeoffs({...tradeoffs, 1: "A"})} className={`p-8 rounded-2xl border-4 w-full md:w-1/2 transition-all ${tradeoffs[1] === "A" ? "border-green-600 bg-green-50 shadow-lg" : "border-gray-200 bg-white hover:border-green-300"}`}>
                  <span className="text-xl font-bold block mb-2 text-gray-900">Yuqori daromad</span>
                  <span className="text-gray-500 font-medium">+ Yuqori bosim va mas'uliyat</span>
                </button>
                <button onClick={() => setTradeoffs({...tradeoffs, 1: "B"})} className={`p-8 rounded-2xl border-4 w-full md:w-1/2 transition-all ${tradeoffs[1] === "B" ? "border-green-600 bg-green-50 shadow-lg" : "border-gray-200 bg-white hover:border-green-300"}`}>
                  <span className="text-xl font-bold block mb-2 text-gray-900">O'rtacha daromad</span>
                  <span className="text-gray-500 font-medium">+ Ko'proq erkinlik va bo'sh vaqt</span>
                </button>
              </div>
            </div>
            
            <div className="text-center border-t-2 border-dashed border-gray-200 pt-10">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">Ikkinchi og'ir tanlov:</h2>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={() => setTradeoffs({...tradeoffs, 2: "A"})} className={`p-8 rounded-2xl border-4 w-full md:w-1/2 transition-all ${tradeoffs[2] === "A" ? "border-green-600 bg-green-50 shadow-lg" : "border-gray-200 bg-white hover:border-green-300"}`}>
                  <span className="text-xl font-bold block mb-2 text-gray-900">Barqaror ish o'rni</span>
                  <span className="text-gray-500 font-medium">+ Kamroq ijodkorlik (Rutin)</span>
                </button>
                <button onClick={() => setTradeoffs({...tradeoffs, 2: "B"})} className={`p-8 rounded-2xl border-4 w-full md:w-1/2 transition-all ${tradeoffs[2] === "B" ? "border-green-600 bg-green-50 shadow-lg" : "border-gray-200 bg-white hover:border-green-300"}`}>
                  <span className="text-xl font-bold block mb-2 text-gray-900">Noaniq Karyera</span>
                  <span className="text-gray-500 font-medium">+ Yuqori ijodkorlik va tavakkal</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODUL 5: WORK STYLE */}
        {step === 6 && (
          <div className="animate-fade-in space-y-8">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 5: Ish uslubi</div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">1. Qaysi muhit ko'proq mos? (Jamoa)</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Yakka / Mustaqil", "Kichik jamoa (2-5 kishi)", "Katta jamoa", "Mijozlar bilan (Yuzma-yuz)"].map(opt => (
                  <button key={opt} onClick={() => setWorkStyle({...workStyle, env: opt})} className={`p-3 rounded-xl border-2 text-sm ${workStyle.env === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">2. Topshiriq turi qanday bo'lsin?</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Aniq ko'rsatmalari bor topshiriqlar", "Ochiq, yechimi noaniq muammolar"].map(opt => (
                  <button key={opt} onClick={() => setWorkStyle({...workStyle, task: opt})} className={`p-3 rounded-xl border-2 text-sm ${workStyle.task === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">3. Ko'proq nimalar bilan ishlashni xohlaysiz?</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Odamlar bilan", "Ma'lumotlar bilan", "Texnologiyalar bilan", "Obyekt / Mexanizmlar bilan"].map(opt => (
                  <button key={opt} onClick={() => setWorkStyle({...workStyle, focus: opt})} className={`p-3 rounded-xl border-2 text-sm ${workStyle.focus === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODUL 6: CONSTRAINTS */}
        {step === 7 && (
          <div className="animate-fade-in space-y-8">
            <div className="mb-2 text-sm text-red-500 font-bold uppercase tracking-wider">Modul 6: Haqiqiy Sharoit va Cheklovlar</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Ta'limga qancha VAQT ajrata olasiz?</h2>
                <div className="flex flex-col gap-2">
                  {["Haftada 0-5 soat (Juda bandman)", "Haftada 5-10 soat", "Haftada 10-20 soat", "Haftada 20+ soat (Bo'shman)"].map(opt => (
                    <button key={opt} onClick={() => setConstraints({...constraints, time: opt})} className={`p-3 rounded-xl border-2 text-left text-sm ${constraints.time === opt ? "border-red-500 bg-red-50 font-bold text-red-900" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Ta'limga qancha MABLAG' ajrata olasiz?</h2>
                <div className="flex flex-col gap-2">
                  {["Faqat bepul", "Oyiga 500 minggacha", "Oyiga 1-2 million", "Sifat uchun pul ayamayman"].map(opt => (
                    <button key={opt} onClick={() => setConstraints({...constraints, budget: opt})} className={`p-3 rounded-xl border-2 text-left text-sm ${constraints.budget === opt ? "border-red-500 bg-red-50 font-bold text-red-900" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Ingliz tili darajangiz qanday?</h2>
                <div className="grid grid-cols-2 gap-2">
                  {["Nol", "A1/A2 (Boshlang'ich)", "B1/B2 (O'rta)", "C1+ (Erkin)"].map(opt => (
                    <button key={opt} onClick={() => setConstraints({...constraints, english: opt})} className={`p-3 rounded-xl border-2 text-sm ${constraints.english === opt ? "border-blue-500 bg-blue-50 font-bold text-blue-900" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h2 className="font-bold text-gray-800 mb-4">Qanday kompyuteringiz bor?</h2>
                <div className="flex flex-col gap-2">
                  {["Kompyuter yo'q, faqat telefon", "Oddiy noutbuk (ofis uchun)", "Kuchli texnika (Dasturlash/Video)"].map(opt => (
                    <button key={opt} onClick={() => setConstraints({...constraints, tech: opt})} className={`p-3 rounded-xl border-2 text-left text-sm ${constraints.tech === opt ? "border-blue-500 bg-blue-50 font-bold text-blue-900" : "border-gray-200 hover:bg-gray-50"}`}>{opt}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODUL 7: RESILIENCE */}
        {step === 8 && (
          <div className="animate-fade-in space-y-8">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 7: Sabr va Qurbonlik</div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">1. Yangi kasb uchun 6-12 oy tinimsiz o'qish va boshida past daromadga tayyormisiz?</h2>
              <div className="grid grid-cols-1 gap-3">
                {["Umuman tayyor emasman", "Qisman tayyorman (Sinab ko'raman)", "To'liq tayyorman, oxirigacha boraman"].map(opt => (
                  <button key={opt} onClick={() => setResilience({...resilience, study: opt})} className={`p-4 rounded-xl border-2 text-left ${resilience.study === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200 hover:border-gray-300"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-800">2. Siz uchun quyidagilardan qaysi biri ENG QIYIN (chiday olmaysiz)?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["Uzoq vaqt bir joyda o'tirish", "Ko'p odam bilan gaplashish", "Noaniqlik va doimiy o'zgarish", "Takroriy va rutin qoidalar", "Qat'iy deadline va bosim", "Og'ir jismoniy mehnat"].map(opt => (
                  <button key={opt} onClick={() => setResilience({...resilience, hardest: opt})} className={`p-3 rounded-xl border-2 text-sm ${resilience.hardest === opt ? "border-black bg-black text-white font-bold" : "border-gray-200 hover:border-gray-300"}`}>{opt}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODUL 8: CAREER PREFERENCES */}
        {step === 9 && (
          <div className="animate-fade-in space-y-8">
            <div className="mb-2 text-sm text-green-600 font-bold uppercase tracking-wider">Modul 8: Karyera Formatlari</div>
            
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">1. Qaysi ish modelini xohlaysiz?</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Yollanma ishchi (Employee)", "Frilanser (Freelancer)", "Tadbirkor (Entrepreneur)", "Aralash (Hybrid)"].map(opt => (
                  <button key={opt} onClick={() => setPreferences({...preferences, model: opt})} className={`p-3 rounded-xl border-2 text-sm ${preferences.model === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">2. Ish joyi geografiyasi:</h2>
              <div className="grid grid-cols-2 gap-3">
                {["O'zbekiston hududida", "Remote (Masofadan/Global)", "Chet elga ko'chish", "Farqi yo'q"].map(opt => (
                  <button key={opt} onClick={() => setPreferences({...preferences, geo: opt})} className={`p-3 rounded-xl border-2 text-sm ${preferences.geo === opt ? "border-green-600 bg-green-50 font-bold" : "border-gray-200"}`}>{opt}</button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <h2 className="font-bold text-gray-800 mb-4">3. Ishingizda MUTLAQO bo'lmasligi kerak bo'lgan narsalar (ixtiyoriy):</h2>
              <div className="grid grid-cols-1 gap-2">
                {["Doimiy tungi smena", "Kun bo'yi mijozlar bilan asabiy suhbat", "Faqat kompyuter ekraniga termilib o'tirish", "Qat'iy 09:00 - 18:00 ofis grafigi"].map(item => (
                  <button key={item} onClick={() => toggleNoNo(item)} className={`p-3 rounded-xl border-2 text-left text-sm transition-all ${preferences.noNos.includes(item) ? "border-red-500 bg-red-50 text-red-700 font-bold" : "border-gray-200 hover:bg-red-50"}`}>
                    {preferences.noNos.includes(item) && "🚫 "} {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* YAKUNIY NATIJA EKRANI */}
        {step === 10 && (
          <div className="animate-fade-in">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-8"></div>
                <h2 className="text-3xl font-bold text-black mb-3 tracking-tight">Tahlil qilinmoqda...</h2>
                <p className="text-gray-500 text-center max-w-sm">Sun'iy intellekt sizning javoblaringizni 100+ kasblar bazasi va mehnat bozori bilan solishtirmoqda.</p>
              </div>
            ) : (
              <div className="py-6">
                <div className="text-center mb-10">
                  <div className="inline-block bg-black text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">Natija Tayyor</div>
                  <h2 className="text-3xl sm:text-4xl font-black text-black mb-4 tracking-tight">Sizning Profilingizga Eng Mos Kasblar</h2>
                  <p className="text-gray-600 max-w-md mx-auto">Sizning analitik qobiliyatlaringiz, qadriyatlaringiz va cheklovlaringiz asosida topilgan 3 ta eng kuchli yo'nalish:</p>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="p-6 bg-white border-2 border-green-600 rounded-3xl shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 bg-green-600 text-white px-5 py-1.5 font-bold text-sm rounded-bl-2xl">Fit: 86/100</div>
                    <h3 className="text-2xl font-black text-black mb-2 mt-2">🎯 1. Data Analyst</h3>
                    <p className="text-gray-500 mb-5 text-sm">Kuchli moslik sababi: Analitik fikrlash, kompyuterda ishlash xohishi va mustaqillik.</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-black">6-9 oy o'qish</span>
                      <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-black">Talab yuqori</span>
                      <span className="bg-green-100 border border-green-200 px-3 py-1 rounded-lg text-xs font-bold text-green-800">Remote imkoniyati</span>
                    </div>
                  </div>

                  <div className="p-6 bg-white border border-gray-200 rounded-3xl opacity-90 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1">2. Product Manager</h3>
                      <p className="text-xs text-gray-500">Muloqot va strategiya</p>
                    </div>
                    <span className="font-black text-xl text-gray-400">82/100</span>
                  </div>

                  <div className="p-6 bg-white border border-gray-200 rounded-3xl opacity-80 shadow-sm flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-black mb-1">3. Business Analyst</h3>
                      <p className="text-xs text-gray-500">Tahlil va biznes</p>
                    </div>
                    <span className="font-black text-xl text-gray-400">77/100</span>
                  </div>
                </div>

                <div className="bg-black p-8 sm:p-10 rounded-3xl text-center shadow-2xl text-white relative overflow-hidden">
                  <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-green-500 rounded-full blur-3xl opacity-20"></div>
                  <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Batafsil Yo'l Xaritangizni Oling!</h3>
                  <p className="text-gray-400 mb-8 text-sm max-w-md mx-auto leading-relaxed">Ushbu kasblarga kirish uchun qaysi texnologiyalarni o'rganish kerak, qancha vaqt ketadi, qayerdan topish mumkin va eng katta risklar nimalardan iborat ekanligi haqidagi to'liq 20 sahifalik <span className="font-bold text-green-400">Shaxsiy Premium PDF Diagnostika</span> xulosasini yuklab oling.</p>
                  
                  {/* --- TELEGRAMGA YUBORISH TUGMASI --- */}
                  <button onClick={handleComplete} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-5 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-xl text-lg flex items-center justify-center gap-3">
                    Xaritani Yuklab Olish <span>🔒 99,000 UZS</span>
                  </button>
                  {/* --------------------------------- */}

                </div>
              </div>
            )}
          </div>
        )}

        {/* NAVIGATION (Faqat barcha talablar bajarilganda faol bo'ladi) */}
        {step < 10 && (
          <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-6">
            {step > 0 ? (
              <button onClick={() => { setStep(step - 1); window.scrollTo(0,0); }} className="text-gray-500 hover:text-black font-semibold py-3 px-4 transition-colors">← Orqaga</button>
            ) : <div></div>}
            
            <button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className={`font-bold py-4 px-10 rounded-2xl shadow-lg transition-all flex items-center gap-2 ${
                isStepValid() ? "bg-black text-white hover:bg-gray-800 hover:scale-105 active:scale-95" : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {step === 9 ? "Tahlilni Boshlash" : "Keyingi"} {isStepValid() && "➔"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}