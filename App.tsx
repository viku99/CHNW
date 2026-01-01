
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
  const [loadingText, setLoadingText] = useState("Accessing secret vaults...");
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
    "Error: No not found", "Psych!", "Try again", "Nope."
  ];

  // Loading animation logic
  useEffect(() => {
    if (stage === 'loading') {
      const texts = [
        "Analyzing your expectations...",
        "Checking for wrinkles...",
        "Measuring heart rate...",
        "Validating age certificate...",
        "Preparing the final truth...",
        "READY. HERE WE GO..."
      ];
      let i = 0;
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStage('success'), 600);
            return 100;
          }
          if (prev % 15 === 0 && prev > 0) {
            i++;
            setLoadingText(texts[i] || texts[texts.length - 1]);
          }
          return prev + 1;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const moveNoButton = useCallback(() => {
    if (noCount >= 3) {
      const padding = 80;
      const x = Math.random() * (window.innerWidth - padding * 2) + padding;
      const y = Math.random() * (window.innerHeight - padding * 2) + padding;
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

  const getNoText = () => {
    return noMessages[noCount % noMessages.length];
  };

  return (
    <div className="min-h-screen bg-[#010206] text-white flex items-center justify-center p-6 relative overflow-hidden font-inter">
      <StarBackground />
      {stage === 'success' && <FireworksCanvas />}
      
      {/* Background Blobs */}
      <div className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${stage === 'success' ? 'opacity-40' : 'opacity-10'}`}>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-red-600 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="z-10 w-full max-w-2xl">
        {/* STAGE: INTRO */}
        {stage === 'intro' && (
          <div 
            className="text-center space-y-12 animate-in fade-in zoom-in cursor-pointer group"
            onClick={() => setStage('asking')}
          >
            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-playfair italic font-light tracking-[0.3em] text-white group-hover:scale-105 transition-transform duration-700 drop-shadow-2xl">
                {name}
              </h1>
              <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto group-hover:w-48 transition-all duration-700" />
            </div>
            <p className="text-slate-500 uppercase tracking-[0.8em] text-[10px] animate-pulse">
              Click to initiate the protocol
            </p>
          </div>
        )}

        {/* STAGE: ASKING & CONFIRMING */}
        {(stage === 'asking' || stage === 'confirming') && (
          <div className="glass p-10 md:p-20 rounded-[4rem] border border-white/10 shadow-2xl backdrop-blur-3xl animate-in zoom-in slide-in-from-bottom text-center relative max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-playfair mb-12 leading-tight text-white h-32 flex items-center justify-center">
              {stage === 'asking' ? (
                <>Do you want to know <br/><span className="text-purple-400 italic ml-2">something special?</span></>
              ) : (
                yesQuestions[yesLoopIndex]
              )}
            </h2>

            <div className="flex flex-col gap-5">
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + yesLoopIndex * 0.05})` }}
                className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-purple-400 hover:text-white hover:scale-105 active:scale-90 transition-all shadow-lg text-lg uppercase tracking-widest z-20"
              >
                {yesLoopIndex > 0 ? "YES, DEFINITELY!" : "YES"}
              </button>
              
              <button
                onClick={handleNo}
                onMouseEnter={noCount >= 3 ? moveNoButton : undefined}
                style={{ 
                  position: noPosition.position,
                  top: noPosition.top,
                  left: noPosition.left,
                  width: noCount >= 3 ? '160px' : '100%',
                  opacity: Math.max(0.4, 1 - noCount * 0.03),
                  transition: noCount >= 3 ? 'all 0.1s ease-out' : 'all 0.3s ease',
                  zIndex: 50
                }}
                className={`py-4 rounded-3xl font-bold border whitespace-nowrap overflow-hidden text-ellipsis ${
                  noCount > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/5 text-slate-500 border-white/5'
                }`}
              >
                {getNoText()}
              </button>
            </div>
          </div>
        )}

        {/* STAGE: LOADING */}
        {stage === 'loading' && (
          <div className="text-center space-y-12 animate-in fade-in">
            <div className="relative w-32 h-32 mx-auto">
              <div className="absolute inset-0 border-4 border-white/5 rounded-full" />
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="64" cy="64" r="60"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * loadingProgress) / 100}
                  className="text-red-500 transition-all duration-200"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-lg text-white">
                {loadingProgress}%
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-2xl font-playfair italic text-white animate-pulse">{loadingText}</p>
              <p className="text-[10px] uppercase tracking-[0.5em] text-slate-600">The loop is complete...</p>
            </div>
          </div>
        )}

        {/* STAGE: SUCCESS (THE PRANK) */}
        {stage === 'success' && (
          <div className="text-center space-y-12 animate-in zoom-in max-w-2xl mx-auto">
            <div className="relative inline-block scale-110 md:scale-125 mb-8">
               <span className="text-9xl mb-4 block animate-bounce drop-shadow-[0_0_40px_rgba(255,0,0,0.6)]">😹</span>
               <div className="absolute inset-0 bg-red-400/20 blur-[120px] rounded-full animate-pulse -z-10" />
            </div>
            
            <div className="glass p-8 md:p-12 rounded-[3rem] border border-red-500/20 space-y-8 backdrop-blur-md animate-in slide-in-from-bottom">
              <h3 className="text-6xl md:text-7xl font-playfair italic text-white leading-tight">
                WHAT U THOUGHT?
              </h3>
              
              <div className="space-y-6 max-w-lg mx-auto">
                <p className="text-3xl md:text-4xl font-playfair text-slate-100 leading-relaxed font-bold">
                  IM GONNA PROPOSE?
                </p>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto" />
                <p className="text-2xl md:text-3xl font-playfair italic text-red-400 animate-pulse">
                  NOOOOO UR TOO OLD LADY!
                </p>
                
                <div className="pt-8 space-y-4">
                  <p className="text-xl text-slate-300 font-light">I JUST WANT U TO KNOW...</p>
                  <p className="text-5xl md:text-8xl font-black text-red-500 uppercase tracking-tighter filter drop-shadow-[0_0_20px_rgba(239,68,68,1)] rotate-3 animate-pulse">
                    UR STUPIDDDDDD
                  </p>
                  <p className="text-4xl md:text-7xl font-dancing text-white mt-4 animate-laugh inline-block">
                    AHAHAHAHAH!
                  </p>
                </div>
              </div>

              <div className="pt-10">
                <button
                  onClick={() => {
                    setStage('intro'); 
                    setNoCount(0); 
                    setYesLoopIndex(0); 
                    setLoadingProgress(0); 
                    setNoPosition({ top: 'auto', left: 'auto', position: 'relative' });
                  }}
                  className="px-10 py-4 rounded-full border border-red-500/30 text-red-400 hover:text-white hover:border-red-500 transition-all text-[10px] uppercase tracking-[0.5em] hover:bg-red-500/10"
                >
                  Regret your life choices
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="fixed bottom-8 left-0 w-full flex justify-center opacity-30 pointer-events-none z-50">
        <div className="flex items-center gap-6">
          <div className="h-[1px] w-16 bg-red-800" />
          <span className="text-red-700 text-[10px] tracking-[1.2em] uppercase font-black whitespace-nowrap">
            STUPIDITY • PROTOCOL • 2025
          </span>
          <div className="h-[1px] w-16 bg-red-800" />
        </div>
      </footer>
    </div>
  );
};

export default App;
