import React, { useState, useEffect, useCallback } from 'react';
import StarBackground from './components/StarBackground';
import FireworksCanvas from './components/FireworksCanvas';

type AppStage = 'intro' | 'asking' | 'confirming' | 'loading' | 'success';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro');
  const [noCount, setNoCount] = useState(0);
  const [yesLoopIndex, setYesLoopIndex] = useState(0);
  const [noPosition, setNoPosition] = useState<{ top: string; left: string; position: 'relative' | 'fixed' }>({ top: 'auto', left: 'auto', position: 'relative' });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const name = "Chaitra";

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
    "Psych!", "Try again", "Nope."
  ];

  // Simple loading animation
  useEffect(() => {
    if (stage === 'loading') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('success'), 500);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const moveNoButton = useCallback(() => {
    if (noCount >= 3) {
      const btnWidth = 120;
      const btnHeight = 50;
      const x = Math.random() * (window.innerWidth - btnWidth);
      const y = Math.random() * (window.innerHeight - btnHeight);
      setNoPosition({ 
        top: `${y}px`, 
        left: `${x}px`, 
        position: 'fixed' 
      });
    }
  }, [noCount]);

  const handleNo = () => {
    setNoCount(prev => prev + 1);
    moveNoButton();
  };

  const handleYes = () => {
    if (yesLoopIndex < yesQuestions.length - 1) {
      setYesLoopIndex(prev => prev + 1);
      setStage('confirming');
    } else {
      setStage('loading');
    }
  };

  return (
    <div className="min-h-screen bg-[#010206] text-white flex items-center justify-center p-6 relative overflow-hidden">
      <StarBackground />
      {stage === 'success' && <FireworksCanvas />}
      
      {/* Background Ambience */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${stage === 'success' ? 'opacity-30' : 'opacity-10'}`}>
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-900/40 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[150px] animate-pulse" />
      </div>

      <main className="z-10 w-full max-w-2xl relative">
        {/* STAGE: INTRO */}
        {stage === 'intro' && (
          <div 
            className="text-center space-y-12 animate-fade-in cursor-pointer group"
            onClick={() => setStage('asking')}
          >
            <div className="space-y-4">
              <h1 className="text-6xl md:text-9xl font-playfair italic font-light tracking-[0.2em] text-white transition-all duration-700 group-hover:tracking-[0.4em] drop-shadow-2xl">
                {name}
              </h1>
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto group-hover:w-64 transition-all duration-700" />
            </div>
            <p className="text-slate-500 uppercase tracking-[0.8em] text-[10px] animate-pulse">
              Click to initiate protocol
            </p>
          </div>
        )}

        {/* STAGE: ASKING & CONFIRMING */}
        {(stage === 'asking' || stage === 'confirming') && (
          <div className="glass p-8 md:p-16 rounded-[3rem] animate-zoom-in text-center max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-playfair mb-12 leading-tight text-white h-24 flex items-center justify-center">
              {stage === 'asking' ? (
                <>Do you want to know <br/><span className="text-red-400 italic ml-2">something special?</span></>
              ) : (
                yesQuestions[yesLoopIndex]
              )}
            </h2>

            <div className="flex flex-col gap-6">
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + yesLoopIndex * 0.05})` }}
                className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-2xl text-lg uppercase tracking-widest z-20 active:scale-95"
              >
                {yesLoopIndex > 0 ? "YES, TELL ME!" : "YES"}
              </button>
              
              <button
                onClick={handleNo}
                onMouseEnter={noCount >= 3 ? handleNo : undefined}
                style={{ 
                  position: noPosition.position,
                  top: noPosition.top,
                  left: noPosition.left,
                  width: noCount >= 3 ? '140px' : '100%',
                  transition: 'all 0.15s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
                  zIndex: 50
                }}
                className={`py-4 rounded-2xl font-bold border ${
                  noCount > 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-white/5 text-slate-500 border-white/5'
                }`}
              >
                {noMessages[noCount % noMessages.length]}
              </button>
            </div>
          </div>
        )}

        {/* STAGE: LOADING */}
        {stage === 'loading' && (
          <div className="text-center space-y-10 animate-fade-in">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
              <div 
                className="absolute inset-0 border-4 border-red-500 rounded-full transition-all" 
                style={{ clipPath: `inset(0 ${100 - loadingProgress}% 0 0)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white">
                {loadingProgress}%
              </div>
            </div>
            <p className="text-xl font-playfair italic text-white animate-pulse">Scanning the matrix...</p>
          </div>
        )}

        {/* STAGE: SUCCESS (THE PRANK) */}
        {stage === 'success' && (
          <div className="text-center space-y-12 animate-zoom-in">
            <div className="relative inline-block scale-125 mb-6">
               <span className="text-9xl mb-4 block animate-bounce">😹</span>
               <div className="absolute inset-0 bg-red-600/20 blur-[100px] rounded-full animate-pulse -z-10" />
            </div>
            
            <div className="glass p-8 md:p-12 rounded-[4rem] border-red-500/20 space-y-10">
              <h3 className="text-5xl md:text-7xl font-playfair italic text-white leading-tight animate-slide-up">
                WHAT U THOUGHT?
              </h3>
              
              <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <p className="text-2xl md:text-4xl font-playfair text-slate-100 font-bold tracking-wide">
                  IM GONNA PROPOSE?
                </p>
                <div className="h-px w-48 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
                <p className="text-3xl md:text-5xl font-playfair italic text-red-500 font-black">
                  NOOOOO UR TOO OLD LADY!
                </p>
                
                <div className="pt-8 space-y-6">
                  <p className="text-lg text-slate-400 font-light tracking-[0.3em]">I JUST WANT U TO KNOW...</p>
                  <p className="text-6xl md:text-9xl font-black text-red-600 uppercase tracking-tighter animate-pulse-red">
                    UR STUPID
                  </p>
                  <p className="text-5xl md:text-8xl font-dancing text-white mt-6 animate-shake inline-block">
                    AHAHAHAHAH!
                  </p>
                </div>
              </div>

              <div className="pt-10">
                <button
                  onClick={() => { setStage('intro'); setNoCount(0); setYesLoopIndex(0); setLoadingProgress(0); setNoPosition({ top: 'auto', left: 'auto', position: 'relative' }); }}
                  className="px-12 py-4 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs uppercase tracking-[0.5em]"
                >
                  Regret your life choices
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="fixed bottom-10 left-0 w-full flex justify-center opacity-20 pointer-events-none">
        <span className="text-red-500 text-[10px] tracking-[1.5em] uppercase font-black">
          CHAITRA • PROTOCOL • 2025
        </span>
      </footer>
    </div>
  );
};

export default App;