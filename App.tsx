import React, { useState, useEffect, useCallback, useRef } from 'react';
import StarBackground from './components/StarBackground';
import FireworksCanvas from './components/FireworksCanvas';
import Countdown from './components/Countdown';
import { fetchNewYearMessage } from './services/geminiService';
import { GreetingMessage } from './types';

type AppStage = 'intro' | 'asking' | 'confirming' | 'loading' | 'success';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro');
  const [noCount, setNoCount] = useState(0);
  const [yesLoopIndex, setYesLoopIndex] = useState(0);
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [isJittering, setIsJittering] = useState(false);
  const [isNear, setIsNear] = useState(false);
  const [noPosition, setNoPosition] = useState<{ top: string; left: string; position: 'relative' | 'fixed' }>({ 
    top: 'auto', 
    left: 'auto', 
    position: 'relative' 
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [aiMessage, setAiMessage] = useState<GreetingMessage | null>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const lastTeleportRef = useRef<number>(0);
  const name = "Chaitra";
  const targetYear = 2026;

  const yesQuestions = [
    "Wait... do you really want to know?",
    "Are you absolutely, 100% positive?",
    "Like, pinky promise you're ready?",
    "No take-backs? No regrets?",
    "Are you actually sure? Like, REALLY sure?",
    "Final answer? Is this your final answer?",
    "Okay, but are you SURE sure? For real this time?",
    "Last chance to turn back. Proceed anyway?",
    "One more thing... do you trust me?",
    "Okay. Preparing for the big reveal..."
  ];

  const noMessages = [
    "NO", "Are you sure?", "Really?", "Think again...", 
    "Why not?", "Please?", "Don't be like that!", "Chaitra, pleaseeee!",
    "I'll be sad...", "I'm crying now.", "Okay, fine.", "Wait, no!",
    "STOP CLICKING NO", "You're mean.", "Still no?", "Catch me if you can!",
    "Psych!", "Try again", "Nope.", "Keep trying...", "Almost had it!"
  ];

  const teleportNoButton = useCallback(() => {
    const now = Date.now();
    // Throttling to prevent lag but keeping it responsive
    if (now - lastTeleportRef.current < 40) return;
    lastTeleportRef.current = now;

    const btnWidth = 160;
    const btnHeight = 60;
    const padding = 20; // Minimum distance from screen edge

    // Calculate safe bounds
    const maxX = Math.max(padding, window.innerWidth - btnWidth - padding);
    const maxY = Math.max(padding, window.innerHeight - btnHeight - padding);

    // Ensure it doesn't just stay in one spot - pick a point far from current
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    setIsTeleporting(true);
    setIsNear(false);
    setNoPosition({
      top: `${randomY}px`,
      left: `${randomX}px`,
      position: 'fixed'
    });
    setNoCount(prev => prev + 1);

    setTimeout(() => setIsTeleporting(false), 200);
  }, []);

  // Fleeing and Jitter Logic
  useEffect(() => {
    if ((stage === 'asking' || stage === 'confirming')) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!noButtonRef.current) return;
        
        const rect = noButtonRef.current.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - buttonCenterX, 2) + 
          Math.pow(e.clientY - buttonCenterY, 2)
        );

        // Fleeing threshold - grows slightly to be annoying but capped to keep it visible
        const fleeThreshold = Math.min(130 + (noCount * 4), 300);
        // Jitter threshold - button shakes when mouse is somewhat close
        const jitterThreshold = fleeThreshold + 100;
        // Temptation threshold - button glows when mouse is further away
        const nearThreshold = jitterThreshold + 150;

        if (distance < fleeThreshold) {
          teleportNoButton();
          setIsJittering(false);
          setIsNear(false);
        } else if (distance < jitterThreshold) {
          setIsJittering(true);
          setIsNear(true);
        } else if (distance < nearThreshold) {
          setIsNear(true);
          setIsJittering(false);
        } else {
          setIsNear(false);
          setIsJittering(false);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [stage, noCount, teleportNoButton]);

  useEffect(() => {
    if (stage === 'loading') {
      fetchNewYearMessage(name, targetYear).then(msg => setAiMessage(msg));
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStage('success');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 800);
            return 100;
          }
          return prev + 1.2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const handleYes = () => {
    if (yesLoopIndex < yesQuestions.length - 1) {
      setYesLoopIndex(prev => prev + 1);
      setStage('confirming');
    } else {
      setStage('loading');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center p-4 md:p-8 lg:p-12 relative overflow-hidden transition-all duration-700 bg-[#010206]">
      <StarBackground />
      {stage === 'success' && <FireworksCanvas />}
      
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 -z-10 ${stage === 'success' ? 'opacity-80' : 'opacity-30'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-red-900/10 rounded-full blur-[180px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-purple-900/10 rounded-full blur-[180px] animate-pulse" />
      </div>

      <main className="z-10 w-full max-w-5xl my-auto flex flex-col items-center">
        {stage === 'intro' && (
          <div 
            className="text-center space-y-10 md:space-y-20 cursor-pointer group animate-scale-in py-10"
            onClick={() => setStage('asking')}
          >
            <div className="space-y-4 md:space-y-8 animate-float">
              <h1 className="text-7xl md:text-[10rem] lg:text-[13rem] font-playfair italic font-black tracking-tight text-white transition-all duration-1000 group-hover:tracking-normal drop-shadow-[0_15px_50px_rgba(255,255,255,0.15)]">
                {name}
              </h1>
              <div className="h-[2px] w-24 md:w-48 bg-gradient-to-r from-transparent via-red-600 to-transparent mx-auto group-hover:w-full transition-all duration-1000 max-w-lg" />
            </div>
            <div className="space-y-6">
              <p className="text-slate-500 uppercase tracking-[1.5em] text-[10px] md:text-xs font-black opacity-60 animate-pulse text-center w-full">
                CLICK TO START PROTOCOL {targetYear}
              </p>
              <Countdown targetYear={targetYear} />
            </div>
          </div>
        )}

        {(stage === 'asking' || stage === 'confirming') && (
          <div className="glass p-8 md:p-16 lg:p-24 rounded-[3rem] md:rounded-[6rem] text-center w-full max-w-3xl shadow-2xl animate-scale-in relative border-white/5 mx-auto">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-playfair mb-12 md:mb-20 leading-tight text-white min-h-[160px] flex items-center justify-center font-bold px-2">
              {stage === 'asking' ? (
                <span>Chaitra, I have something <span className="text-red-600 italic block mt-4">extremely important</span> to tell you...</span>
              ) : (
                <span className="animate-fade-in">{yesQuestions[yesLoopIndex]}</span>
              )}
            </h2>

            <div className="flex flex-col gap-6 md:gap-10 max-w-md mx-auto relative min-h-[160px] items-center justify-center">
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + yesLoopIndex * 0.06})` }}
                className="w-full py-6 md:py-8 bg-white text-black font-black rounded-[2rem] md:rounded-[3rem] hover:bg-red-600 hover:text-white transition-all duration-300 shadow-2xl text-xl md:text-3xl uppercase tracking-[0.2em] z-30 active:scale-95 ring-offset-4 ring-offset-[#010206] ring-white/10"
              >
                {yesLoopIndex > 0 ? "YES! YES!" : "TELL ME"}
              </button>
              
              <button
                ref={noButtonRef}
                onMouseEnter={teleportNoButton}
                onClick={teleportNoButton}
                style={{ 
                  position: noPosition.position,
                  top: noPosition.top,
                  left: noPosition.left,
                  width: noPosition.position === 'fixed' ? '160px' : '100%',
                  zIndex: 50,
                  transition: noCount > 0 && !isTeleporting ? 'all 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.1)' : 'none'
                }}
                className={`py-5 rounded-[2rem] font-black border transition-all text-[10px] md:text-xs uppercase tracking-widest ${
                  noCount > 0 
                    ? 'text-red-400 border-red-500/40 shadow-xl cursor-none pointer-events-auto bg-red-600/20' 
                    : 'bg-white/5 text-slate-500 border-white/10 hover:bg-white/10'
                } ${isTeleporting ? 'animate-teleport' : ''} ${isJittering ? 'animate-shake' : ''} ${isNear ? 'animate-wobble animate-glow-pulse !text-red-500 !bg-red-600/30' : ''}`}
              >
                {noMessages[noCount % noMessages.length]}
              </button>
            </div>
          </div>
        )}

        {stage === 'loading' && (
          <div className="text-center space-y-16 md:space-y-24 animate-scale-in py-10">
            <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto">
              <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_40px_rgba(220,38,38,0.3)]">
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="1000" strokeDashoffset={1000 - (1000 * loadingProgress) / 100} className="text-red-600 transition-all duration-300 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-black text-6xl md:text-8xl text-white italic drop-shadow-xl">{Math.round(loadingProgress)}%</span>
                <span className="text-[10px] text-slate-500 tracking-[1.2em] uppercase mt-2">CALCULATING...</span>
              </div>
            </div>
            <p className="text-xl md:text-3xl font-playfair italic text-white animate-pulse tracking-[0.4em]">DECRYPTING HEART_PROTOCOL...</p>
          </div>
        )}

        {stage === 'success' && (
          <div className="text-center space-y-12 md:space-y-24 w-full py-10 md:py-20 animate-scale-in">
            <div className="relative inline-block">
               <span className="text-[160px] md:text-[240px] block animate-bounce drop-shadow-[0_20px_80px_rgba(255,0,0,0.8)] select-none">😹</span>
               <div className="absolute inset-0 bg-red-600/30 blur-[120px] -z-10 rounded-full animate-pulse" />
            </div>
            
            <div className="glass p-10 md:p-24 lg:p-32 rounded-[4rem] md:rounded-[8rem] border-red-600/20 space-y-16 md:space-y-24 shadow-2xl max-w-5xl mx-auto overflow-hidden">
              <div className="space-y-6">
                <h3 className="text-6xl md:text-[10rem] lg:text-[12rem] font-playfair italic text-white font-black leading-none drop-shadow-2xl uppercase tracking-tighter">GOTCHA!</h3>
                <div className="h-[2px] w-32 bg-red-600 mx-auto opacity-70" />
              </div>
              
              <div className="space-y-12">
                <p className="text-3xl md:text-6xl font-playfair text-slate-200 font-bold tracking-tight">IM GONNA PROPOSE?</p>
                <p className="text-5xl md:text-[8rem] font-playfair italic text-red-600 font-black uppercase tracking-tighter animate-glitch leading-none py-6">NOOOOO UR TOO OLD LADY!</p>
                <div className="pt-10 space-y-16">
                    <p className="text-8xl md:text-[14rem] font-black text-red-800 uppercase tracking-tighter leading-none animate-shake inline-block drop-shadow-[0_0_50px_rgba(255,0,0,0.5)]">STUPID</p>
                    <p className="text-6xl md:text-[10rem] font-dancing text-white block drop-shadow-[0_0_60px_rgba(255,255,255,0.4)]">AHAHAHAHAH!</p>
                </div>
              </div>

              <div className="pt-32 space-y-16 border-t border-white/10">
                <div className="space-y-10">
                    <p className="text-xl md:text-3xl font-playfair text-white/70 italic">Actually... I'm only joking 99%.</p>
                    <div className="space-y-6">
                      <p className="text-5xl md:text-9xl font-playfair font-black text-yellow-500 tracking-widest uppercase">HAPPY NEW YEAR!</p>
                      <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-2xl leading-relaxed italic px-4 font-light">
                        {aiMessage ? aiMessage.poetry : "A fresh new year is at your door."}
                      </p>
                    </div>
                    <div className="p-8 md:p-16 glass rounded-[3rem] md:rounded-[5rem] max-w-4xl mx-auto border-yellow-500/10">
                      <p className="text-slate-100 text-xl md:text-3xl font-light leading-relaxed font-playfair">
                        {aiMessage ? aiMessage.wishes : `Chaitra, wishing you a magnificent ${targetYear}!`}
                      </p>
                    </div>
                </div>
                
                <div className="pt-10">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-16 py-8 rounded-full border border-white/5 text-white/20 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all text-[10px] md:text-xs uppercase tracking-[2em] font-black shadow-2xl"
                    >
                      REPLAY PRANK
                    </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full flex flex-col items-center justify-center py-20 opacity-30 pointer-events-none mt-auto gap-6">
        <span className="text-red-900 text-[10px] md:text-xs tracking-[4em] uppercase font-black ml-[4em]">CHAITRA • {targetYear}</span>
        <div className="h-[1px] w-24 bg-white/10" />
        <span className="text-slate-800 text-[6px] md:text-[8px] uppercase tracking-[1.5em] font-mono">STUPIDITY_OVERLOAD_SUCCESSFUL</span>
      </footer>
    </div>
  );
};

export default App;