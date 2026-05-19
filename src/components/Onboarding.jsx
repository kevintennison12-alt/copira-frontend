import { useState } from "react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 0,
    question: "What type of creator are you?",
    key: "creatorType",
    options: [
      { label: "YouTube Creator", icon: "🎬" },
      { label: "Instagram Creator", icon: "📸" },
      { label: "Podcast Creator", icon: "🎙️" },
      { label: "Video Editor", icon: "🎞️" },
      { label: "Music Creator", icon: "🎵" },
      { label: "Other", icon: "✨" },
    ],
  },
  {
    id: 1,
    question: "What kind of content do you create?",
    key: "contentType",
    options: [
      { label: "Shorts / Reels", icon: "⚡" },
      { label: "Gaming", icon: "🎮" },
      { label: "Vlogs", icon: "📹" },
      { label: "Educational", icon: "📚" },
      { label: "Music", icon: "🎶" },
      { label: "Movies / Edits", icon: "🎥" },
      { label: "Memes", icon: "😂" },
      { label: "Tech", icon: "💻" },
      { label: "AI Content", icon: "🤖" },
      { label: "Other", icon: "🌟" },
    ],
  },
  {
    id: 2,
    question: "Why are you using COPIRA - A Copyright Risk Predictor?",
    key: "useCase",
    options: [
      { label: "Check copyright risks", icon: "🛡️" },
      { label: "Analyze music / video usage", icon: "🔍" },
      { label: "Protect my content", icon: "🔒" },
      { label: "Avoid copyright strikes", icon: "⚠️" },
      { label: "Safe content publishing", icon: "✅" },
    ],
  },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ob-root {
    min-height: 100vh;
    background: #050508;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .ob-bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .ob-bg-orb-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(99,51,255,0.22) 0%, transparent 70%); top: -100px; left: -100px; }
  .ob-bg-orb-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(0,180,255,0.15) 0%, transparent 70%); bottom: -80px; right: -80px; }
  .ob-bg-orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(180,0,255,0.10) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); }

  .ob-grid-lines {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: linear-gradient(rgba(99,51,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,51,255,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  .ob-card {
    position: relative; z-index: 1;
    width: 100%; max-width: 580px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 24px;
    padding: 2.5rem 2.5rem 2rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 0 0 1px rgba(99,51,255,0.1) inset, 0 32px 80px rgba(0,0,0,0.6);
  }

  .ob-brand {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 2rem;
  }

  .ob-brand-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, #6333ff, #00b4ff);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }

  .ob-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px; font-weight: 700;
    background: linear-gradient(90deg, #a78bff, #60cfff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
  }

  .ob-progress {
    display: flex; gap: 6px; margin-bottom: 2rem;
  }
  .ob-prog-bar {
    height: 3px; border-radius: 2px; flex: 1;
    background: rgba(255,255,255,0.08);
    transition: background 0.5s ease;
  }
  .ob-prog-bar.active { background: linear-gradient(90deg, #6333ff, #00b4ff); }
  .ob-prog-bar.done { background: rgba(99,51,255,0.5); }

  .ob-step-label {
    font-size: 12px; color: rgba(255,255,255,0.35);
    letter-spacing: 0.12em; text-transform: uppercase;
    margin-bottom: 0.5rem;
    font-family: 'DM Sans', sans-serif;
  }

  .ob-question {
    font-family: 'Syne', sans-serif;
    font-size: clamp(18px, 4vw, 24px);
    font-weight: 700;
    color: #fff;
    line-height: 1.3;
    margin-bottom: 1.75rem;
    letter-spacing: -0.02em;
  }

  .ob-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(148px, 1fr));
    gap: 10px;
    margin-bottom: 2rem;
  }

  .ob-option {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 14px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
    user-select: none;
    display: flex; flex-direction: column; align-items: center; gap: 8px;
  }

  .ob-option:hover {
    background: rgba(99,51,255,0.12);
    border-color: rgba(99,51,255,0.4);
    transform: translateY(-2px);
  }

  .ob-option.selected {
    background: rgba(99,51,255,0.18);
    border-color: rgba(99,51,255,0.8);
    box-shadow: 0 0 20px rgba(99,51,255,0.2) inset, 0 0 0 1px rgba(99,51,255,0.3);
    transform: translateY(-2px);
  }

  .ob-option-icon {
    font-size: 22px; line-height: 1;
  }

  .ob-option-label {
    font-size: 12.5px; font-weight: 500;
    color: rgba(255,255,255,0.75);
    line-height: 1.3;
  }

  .ob-option.selected .ob-option-label { color: #fff; }

  .ob-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
  }

  .ob-btn-back {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.5);
    border-radius: 12px;
    padding: 13px 20px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; gap: 6px;
  }
  .ob-btn-back:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.8); }

  .ob-btn-next {
    flex: 1;
    background: linear-gradient(135deg, #6333ff, #4f7fff);
    border: none;
    color: #fff;
    border-radius: 12px;
    padding: 14px 24px;
    font-size: 15px; font-family: 'DM Sans', sans-serif; font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    letter-spacing: -0.01em;
    box-shadow: 0 4px 24px rgba(99,51,255,0.35);
  }
  .ob-btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,51,255,0.45); filter: brightness(1.08); }
  .ob-btn-next:disabled { opacity: 0.35; cursor: not-allowed; }

  .ob-done-screen {
    position: relative; z-index: 1;
    width: 100%; max-width: 480px;
    text-align: center;
    animation: ob-fade-in 0.6s ease;
  }

  .ob-done-icon {
    width: 80px; height: 80px; border-radius: 24px;
    background: linear-gradient(135deg, #6333ff, #00b4ff);
    display: flex; align-items: center; justify-content: center;
    font-size: 36px; margin: 0 auto 1.5rem;
    box-shadow: 0 0 60px rgba(99,51,255,0.4);
  }

  .ob-done-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
    color: #fff; margin-bottom: 0.75rem; letter-spacing: -0.03em;
  }

  .ob-done-sub {
    color: rgba(255,255,255,0.4); font-size: 15px; margin-bottom: 2rem;
    line-height: 1.6;
  }

  .ob-done-btn {
    background: linear-gradient(135deg, #6333ff, #4f7fff);
    border: none; color: #fff; border-radius: 14px;
    padding: 16px 36px; font-size: 16px;
    font-family: 'DM Sans', sans-serif; font-weight: 600;
    cursor: pointer; letter-spacing: -0.01em;
    box-shadow: 0 4px 32px rgba(99,51,255,0.4);
    transition: all 0.2s ease;
  }
  .ob-done-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 40px rgba(99,51,255,0.5); }

  .ob-slide {
    animation: ob-slide-in 0.35s cubic-bezier(0.34, 1.1, 0.64, 1);
  }

  @keyframes ob-slide-in {
    from { opacity: 0; transform: translateX(32px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes ob-fade-in {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const current = STEPS[step];
  const selected = answers[current?.key];

  const selectOption = (label) => {
    setAnswers((prev) => ({ ...prev, [current.key]: label }));
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      setSlideKey((k) => k + 1);
    } else {
      setDone(true);
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep((s) => s - 1);
      setSlideKey((k) => k + 1);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ob-root">
        <div className="ob-bg-orb ob-bg-orb-1" />
        <div className="ob-bg-orb ob-bg-orb-2" />
        <div className="ob-bg-orb ob-bg-orb-3" />
        <div className="ob-grid-lines" />

        {done ? (
          <div className="ob-done-screen">
            <div className="ob-done-icon">🛡️</div>
            <h1 className="ob-done-title">You're all set!</h1>
            <p className="ob-done-sub">
              Your creator profile is ready. Let's protect your content with AI-powered copyright analysis.
            </p>
            <button
              className="ob-done-btn"
              onClick={() => {
                localStorage.setItem("onboarding_done", "true");
                navigate("/dashboard");
              }}
            >
              Go to Dashboard →
            </button>
          </div>
        ) : (
          <div className="ob-card">
            <div className="ob-brand">
              <div className="ob-brand-icon">🛡️</div>
              <span className="ob-brand-name">COPIRA AI</span>
            </div>

            <div className="ob-progress">
              {STEPS.map((s, i) => (
                <div
                  key={s.id}
                  className={`ob-prog-bar ${i < step ? "done" : i === step ? "active" : ""}`}
                />
              ))}
            </div>

            <div key={slideKey} className="ob-slide">
              <p className="ob-step-label">Step {step + 1} of {STEPS.length}</p>
              <h2 className="ob-question">{current.question}</h2>

              <div className="ob-options">
                {current.options.map((opt) => (
                  <div
                    key={opt.label}
                    className={`ob-option ${selected === opt.label ? "selected" : ""}`}
                    onClick={() => selectOption(opt.label)}
                  >
                    <span className="ob-option-icon">{opt.icon}</span>
                    <span className="ob-option-label">{opt.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="ob-footer">
              {step > 0 && (
                <button className="ob-btn-back" onClick={goBack}>
                  ← Back
                </button>
              )}
              <button
                className="ob-btn-next"
                onClick={goNext}
                disabled={!selected}
              >
                {step < STEPS.length - 1 ? "Continue →" : "Finish Setup →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}