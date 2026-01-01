import React, { useState, useEffect, useCallback, useRef } from 'react';
import StarBackground from './components/StarBackground';
import FireworksCanvas from './components/FireworksCanvas';

type AppStage = 'intro' | 'asking' | 'confirming' | 'loading' | 'success';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('intro');
  const [noCount, setNoCount] = useState(0);
  const [yesLoopIndex, setYesLoopIndex] = useState(0);
  const [noPosition, setNoPosition] = useState<{ top: string; left: string; position: 'relative' | 'fixed' }>({ 
    top: 'auto', 
    left: 'auto', 
    position: 'relative' 
  });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
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

  // Teleport logic for the NO button
  const teleportNoButton = useCallback(() => {
    const btnWidth = 140;
    const btnHeight = 50;
    const margin = 60; // Safety margin from edges

    const maxX = window.innerWidth - btnWidth - margin;
    const maxY = window.innerHeight - btnHeight - margin;

    // Erratic behavior: occasionally jump twice
    const randomX = Math.max(margin, Math.floor(Math.random() * maxX));
    const randomY = Math.max(margin, Math.floor(Math.random() * maxY));

    setNoPosition({
      top: `${randomY}px`,
      left: `${randomX}px`,
      position: 'fixed'
    });
    setNoCount(prev => prev + 1);
  }, []);

  // Fleeing behavior: check distance to mouse
  useEffect(() => {
    if ((stage === 'asking' || stage === 'confirming') && noCount >= 1) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!noButtonRef.current) return;
        
        const rect = noButtonRef.current.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - buttonCenterX, 2) + 
          Math.pow(e.clientY - buttonCenterY, 2)
        );

        // If mouse gets within 120 pixels, flee!
        const threshold = noCount > 10 ? 180 : 120;
        if (distance < threshold) {
          teleportNoButton();
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [stage, noCount, teleportNoButton]);

  // Loading animation simulation
  useEffect(() => {
    if (stage === 'loading') {
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
          return prev + 2;
        });
      }, 50);
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-x-hidden">
      <StarBackground />
      {stage === 'success' && <FireworksCanvas />}
      
      {/* Dynamic Background Glow */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 -z-10 ${stage === 'success' ? 'opacity-50' : 'opacity-20'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-900/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/40 rounded-full blur-[120px] animate-pulse" />
      </div>

      <main className="z-10 w-full max-w-2xl relative">
        {/* STAGE 1: INTRO */}
        {stage === 'intro' && (
          <div 
            className="text-center space-y-8 cursor-pointer group"
            onClick={() => setStage('asking')}
          >
            <div className="space-y-4 animate-float">
              <h1 className="text-7xl md:text-9xl font-playfair italic font-light tracking-tighter text-white transition-all duration-700 group-hover:tracking-normal">
                {name}
              </h1>
              <div className="h-[1px] w-24 bg-red-600 mx-auto group-hover:w-48 transition-all duration-700" />
            </div>
            <p className="text-slate-400 uppercase tracking-[1em] text-[10px] opacity-60">
              Initiating encrypted message...
            </p>
          </div>
        )}

        {/* STAGE 2: ASKING & CONFIRMING */}
        {(stage === 'asking' || stage === 'confirming') && (
          <div className="glass p-10 md:p-20 rounded-[3rem] text-center w-full max-w-xl mx-auto shadow-2xl scale-in relative">
            <h2 className="text-3xl md:text-4xl font-playfair mb-16 leading-tight text-white min-h-[100px] flex items-center justify-center">
              {stage === 'asking' ? (
                <span>Chaitra, I have something <span className="text-red-500 italic">very important</span> to tell you...</span>
              ) : (
                <span className="animate-fade-in">{yesQuestions[yesLoopIndex]}</span>
              )}
            </h2>

            <div className="flex flex-col gap-8">
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + yesLoopIndex * 0.05})` }}
                className="w-full py-6 bg-white text-black font-black rounded-3xl hover:bg-red-600 hover:text-white transition-all duration-300 shadow-xl text-xl uppercase tracking-widest z-20"
              >
                {yesLoopIndex > 0 ? "YES, ABSOLUTELY!" : "TELL ME"}
              </button>
              
              <button
                ref={noButtonRef}
                onMouseEnter={teleportNoButton}
                onClick={teleportNoButton}
                style={{ 
                  position: noPosition.position,
                  top: noPosition.top,
                  left: noPosition.left,
                  width: noPosition.position === 'fixed' ? '140px' : '100%',
                  zIndex: 50,
                  transition: noCount > 0 && noCount < 5 ? 'all 0.2s ease-out' : 'none'
                }}
                className={`py-4 rounded-2xl font-bold border ${
                  noCount > 0 
                    ? 'bg-red-500/20 text-red-500 border-red-500/40 shadow-lg cursor-none' 
                    : 'bg-white/5 text-slate-500 border-white/10'
                }`}
              >
                {noMessages[noCount % noMessages.length]}
              </button>
            </div>
          </div>
        )}

        {/* STAGE 3: LOADING */}
        {stage === 'loading' && (
          <div className="text-center space-y-12">
            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 - (552.92 * loadingProgress) / 100}
                  className="text-red-600 transition-all duration-100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-white">
                {loadingProgress}%
              </div>
            </div>
            <p className="text-2xl font-playfair italic text-white animate-pulse tracking-[0.2em]">
              PREPARING THE REVEAL...
            </p>
          </div>
        )}

        {/* STAGE 4: THE PRANK (SUCCESS) */}
        {stage === 'success' && (
          <div className="text-center space-y-12 w-full py-10">
            <div className="relative inline-block mb-10">
               <span className="text-[150px] md:text-[200px] block animate-bounce drop-shadow-[0_0_50px_rgba(255,0,0,0.6)]">😹</span>
            </div>
            
            <div className="glass p-12 md:p-20 rounded-[4rem] border-red-600/30 space-y-12 shadow-[0_0_100px_rgba(255,0,0,0.2)]">
              <h3 className="text-5xl md:text-8xl font-playfair italic text-white font-black leading-none">
                WHAT U THOUGHT?
              </h3>
              
              <div className="space-y-8">
                <p className="text-3xl md:text-5xl font-playfair text-slate-300 font-bold">
                  IM GONNA PROPOSE?
                </p>
                
                <div className="h-[2px] w-full max-w-[400px] bg-red-600 mx-auto opacity-30" />
                
                <p className="text-4xl md:text-7xl font-playfair italic text-red-600 font-black uppercase tracking-tighter animate-glitch">
                  NOOOOO UR TOO OLD LADY!
                </p>
                
                <div className="pt-10 space-y-8">
                  <p className="text-sm text-slate-500 font-light tracking-[1em] uppercase">MESSAGE FROM THE HEART:</p>
                  
                  <div className="space-y-6">
                    <p className="text-6xl md:text-[9rem] font-black text-red-600 uppercase tracking-tighter leading-none animate-shake inline-block">
                      UR A STUPID
                    </p>
                    <p className="text-5xl md:text-9xl font-dancing text-white block mt-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                      AHAHAHAHAH!
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-20">
                <button
                  onClick={() => window.location.reload()}
                  className="px-14 py-5 rounded-full border border-red-500/20 text-red-500 hover:bg-red-600 hover:text-white transition-all text-xs uppercase tracking-[1em] font-black shadow-lg"
                >
                  START OVER
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full flex justify-center py-16 opacity-30 pointer-events-none mt-auto">
        <span className="text-red-700 text-[10px] md:text-xs tracking-[2em] uppercase font-black">
          CHAITRA • 2025 • PRANKED
        </span>
      </footer>
    </div>
  );
};

export default App;