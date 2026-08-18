"use client";
import { useState } from 'react';
import { diagnosticQuestions } from '../data/questions';

export default function DiagnosticPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  
  const [textInput, setTextInput] = useState("");
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  
  const [activeOther, setActiveOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  // YUKLANISH HOLATI UCHUN YANGI XOTIRA
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = diagnosticQuestions[currentStep];

  // YAKUNIY FUNKSIYA: Ma'lumotni Telegramga yuborish
  const finishDiagnostic = (finalAnswers: any) => {
    setIsSubmitting(true);
    
    // Telegram API ni chaqiramiz
    const tg = (window as any).Telegram?.WebApp;
    
    if (tg) {
      // 1. Olingan barcha javoblarni JSON formatida Telegram botga otamiz
      tg.sendData(JSON.stringify(finalAnswers));
      
      // 2. Mijozga chiroyli animatsiya ko'rinishi uchun 2 soniya kutib, oynani yopamiz
      setTimeout(() => {
        tg.close();
      }, 2000);
    } else {
      // Brauzerda test qilinayotgan bo'lsa
      setTimeout(() => {
        alert("Diagnostika yakunlandi! (Brauzer rejimi)");
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const goNext = (newAnswers = answers) => {
    if (currentStep < diagnosticQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
      setTextInput("");
      setMultiSelect([]);
      setRatings({});
      setActiveOther(false);
      setOtherText("");
    } else {
      // Oxirgi qadamda Telegramga jo'natamiz
      finishDiagnostic(newAnswers);
    }
  };

  const handleSingleChoice = (answer: string) => {
    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);
    goNext(newAnswers);
  };

  const handleMultiSelectToggle = (optionText: string) => {
    let newSelection = [...multiSelect];
    if (newSelection.includes(optionText)) {
      newSelection = newSelection.filter(item => item !== optionText);
    } else {
      if (question.max_selections && newSelection.length >= question.max_selections) return;
      newSelection.push(optionText);
    }
    setMultiSelect(newSelection);
  };

  const saveAndNext = () => {
    let newAnswers = { ...answers };
    
    if (question.type === 'text_input') {
      newAnswers[question.id] = textInput;
    } else if (question.type === 'multi_select') {
      const finalSelection = [...multiSelect];
      if (otherText.trim() !== "") {
        finalSelection.push(otherText.trim());
      }
      newAnswers[question.id] = finalSelection;
    } else if (question.type === 'multi_select_rating') {
      newAnswers[question.id] = ratings;
    }
    
    setAnswers(newAnswers);
    goNext(newAnswers);
  };

  // AGAR YUBORILAYOTGAN BO'LSA, KUTISH EKRANINI KO'RSATAMIZ
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-[#0A192F] flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-16 h-16 border-4 border-[#233554] border-t-[#64FFDA] rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-white mb-2 animate-pulse text-center">Natijalar tahlil qilinmoqda...</h2>
        <p className="text-[#8892B0] text-center">Iltimos, Telegram botga qayting!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A192F] text-[#CCD6F6] flex flex-col items-center justify-center p-6 font-sans selection:bg-[#64FFDA] selection:text-[#0A192F]">
      
      <div className="w-full max-w-2xl mb-10">
        <div className="flex justify-between text-sm font-medium text-[#8892B0] mb-3">
          <span>Premium Diagnostika</span>
          <span>{currentStep + 1} / {diagnosticQuestions.length}</span>
        </div>
        <div className="h-2 w-full bg-[#112240] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#64FFDA] rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(100,255,218,0.5)]"
            style={{ width: `${((currentStep + 1) / diagnosticQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-[#112240] p-8 md:p-10 rounded-2xl shadow-2xl border border-[#233554] transform transition-all duration-500">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="flex flex-col gap-4">
          
          {(question.type === 'single_choice' || question.type === 'ab_choice' || question.type === 'mini_task' || question.type === 'forced_tradeoff') && (
            <>
              {!activeOther ? (
                <>
                  {question.options?.map((opt: any, idx: number) => {
                    const optionText = typeof opt === 'string' ? opt : opt.text;
                    const optionId = typeof opt === 'string' ? opt : opt.id;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSingleChoice(optionText)}
                        className="group relative w-full text-left px-6 py-4 rounded-xl border border-[#233554] bg-[#0A192F]/50 hover:border-[#64FFDA] hover:bg-[#64FFDA]/10 transition-all duration-300 flex items-center"
                      >
                        {typeof opt !== 'string' && (
                          <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#233554] text-[#64FFDA] group-hover:bg-[#64FFDA] group-hover:text-[#0A192F] font-bold mr-4 transition-colors">
                            {opt.id}
                          </span>
                        )}
                        <span className="text-lg text-[#CCD6F6] group-hover:text-white transition-colors">
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                  
                  {question.type === 'single_choice' && (
                    <button
                      onClick={() => setActiveOther(true)}
                      className="group relative w-full text-left px-6 py-4 rounded-xl border border-[#233554] bg-[#0A192F]/50 hover:border-[#64FFDA] hover:bg-[#64FFDA]/10 transition-all duration-300 flex items-center"
                    >
                      <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#233554] text-[#8892B0] group-hover:text-[#0A192F] font-bold mr-4 transition-colors">
                        +
                      </span>
                      <span className="text-lg text-[#8892B0] group-hover:text-white transition-colors">
                        Boshqa (o'z variantim)
                      </span>
                    </button>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-4 animate-in fade-in duration-300">
                  <input
                    type="text"
                    value={otherText}
                    onChange={(e) => setOtherText(e.target.value)}
                    placeholder="O'z variantingizni yozing..."
                    className="w-full bg-[#0A192F]/50 border border-[#64FFDA] rounded-xl p-4 text-white focus:outline-none shadow-[0_0_15px_rgba(100,255,218,0.15)]"
                    autoFocus
                  />
                  <div className="flex gap-3 mt-2">
                    <button onClick={() => setActiveOther(false)} className="px-6 py-4 rounded-xl border border-[#233554] text-[#8892B0] hover:text-white transition-colors">
                      Orqaga
                    </button>
                    <button 
                      onClick={() => { if(otherText.trim()) handleSingleChoice(otherText.trim()); }} 
                      className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${otherText.trim() ? 'bg-[#64FFDA] text-[#0A192F] hover:bg-[#52e0c4] shadow-[0_0_15px_rgba(100,255,218,0.3)]' : 'bg-[#233554] text-[#8892B0] cursor-not-allowed'}`}
                    >
                      Yuborish
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {question.type === 'multi_select' && (
            <>
              <p className="text-sm text-[#8892B0] mb-2">Eng ko'pi bilan {question.max_selections} tasini tanlang.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
                {question.options?.map((opt: any, idx: number) => {
                  const isSelected = multiSelect.includes(opt);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleMultiSelectToggle(opt)}
                      className={`text-left px-4 py-3 rounded-xl border transition-all duration-300 ${isSelected ? 'border-[#64FFDA] bg-[#64FFDA]/20 text-white' : 'border-[#233554] bg-[#0A192F]/50 text-[#CCD6F6] hover:border-[#8892B0]'}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              <input
                type="text"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="+ Boshqa variant bo'lsa yozing..."
                className="w-full bg-[#0A192F]/50 border border-[#233554] rounded-xl p-4 mt-2 text-white focus:outline-none focus:border-[#64FFDA] transition-colors"
              />
            </>
          )}

          {question.type === 'text_input' && (
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="O'z fikringizni yozing..."
              className="w-full bg-[#0A192F]/50 border border-[#233554] rounded-xl p-4 text-white focus:outline-none focus:border-[#64FFDA] transition-colors h-32 resize-none"
            ></textarea>
          )}

          {question.type === 'multi_select_rating' && (
            <div className="flex flex-col gap-6">
              {question.skills_list?.map((skill, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-[#CCD6F6]">{skill}</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => setRatings({ ...ratings, [skill]: num })}
                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${ratings[skill] === num ? 'border-[#64FFDA] bg-[#64FFDA] text-[#0A192F] font-bold' : 'border-[#233554] bg-[#0A192F]/50 hover:border-[#64FFDA]/50'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {['text_input', 'multi_select', 'multi_select_rating'].includes(question.type) && (
            <button
              onClick={saveAndNext}
              className="mt-6 w-full py-4 rounded-xl bg-[#64FFDA] text-[#0A192F] font-bold text-lg hover:bg-[#52e0c4] transition-colors shadow-[0_0_15px_rgba(100,255,218,0.3)]"
            >
              Davom etish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}