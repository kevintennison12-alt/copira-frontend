import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, AlertCircle, RotateCcw, Music, Play, Pause, Download } from 'lucide-react'
import Layout from '../components/Layout'
import DropZone from '../components/DropZone'
import AnalysisProgress from '../components/AnalysisProgress'
import RiskGauge from '../components/RiskGauge'
import PlatformScores from '../components/PlatformScores'
import MatchDetails from '../components/MatchDetails'
import FeatureImportance from '../components/FeatureImportance'
import { predictAPI } from '../services/api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'
const mediaUrl  = (path) => `${BASE_URL}${path}`

const STAGES = { IDLE: 'idle', ANALYZING: 'analyzing', RESULT: 'result', ERROR: 'error' }

// ── Inline royalty-free music player ────────────────────────────────────────
function SafeMusicPanel({ alternatives = [] }) {
  const [playing, setPlaying] = useState(null)   // filename string
  const audioRef = useRef(null)

  if (!alternatives.length) return null

  const toggle = (track) => {
    if (!audioRef.current) return
    if (playing === track.filename) {
      audioRef.current.pause()
      setPlaying(null)
    } else {
      setPlaying(track.filename)
      audioRef.current.src = mediaUrl(track.audio_url)
      audioRef.current.play().catch(console.error)
    }
  }

  const handleEnded = () => setPlaying(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass"
      style={{ borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Music size={14} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
            Royalty-Free Alternatives
          </p>
          <p style={{ fontSize: '0.68rem', color: '#64748b' }}>
            Matched to your audio's genre &amp; mood · Safe to use anywhere
          </p>
        </div>
        <span style={{
          marginLeft: 'auto', fontSize: '0.65rem', fontWeight: 600,
          color: '#22d3ee', background: 'rgba(34,211,238,0.1)',
          border: '1px solid rgba(34,211,238,0.2)',
          borderRadius: 99, padding: '2px 8px',
        }}>
          {alternatives.length} tracks
        </span>
      </div>

      {/* Track list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alternatives.map((track, i) => {
          const isPlaying = playing === track.filename
          return (
            <motion.div
              key={track.filename || i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                background: isPlaying
                  ? 'rgba(124,58,237,0.12)'
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${isPlaying
                  ? 'rgba(124,58,237,0.35)'
                  : 'rgba(255,255,255,0.07)'}`,
                transition: 'all 0.2s',
              }}
            >
              {/* Play button */}
              <button
                onClick={() => toggle(track)}
                style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: isPlaying
                    ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                    : 'rgba(255,255,255,0.08)',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isPlaying ? '#fff' : '#94a3b8',
                  transition: 'all 0.2s',
                  boxShadow: isPlaying ? '0 0 12px rgba(124,58,237,0.4)' : 'none',
                }}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying
                  ? <Pause  size={13} fill="currentColor" />
                  : <Play   size={13} fill="currentColor" style={{ marginLeft: 2 }} />}
              </button>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: '0.78rem', fontWeight: 600, color: '#f1f5f9',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {track.title}
                </p>
                <p style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 1 }}>
                  {track.genre}
                </p>
              </div>

              {/* Now-playing pulse */}
              {isPlaying && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                  {[0, 0.15, 0.3].map((delay, j) => (
                    <motion.div
                      key={j}
                      animate={{ scaleY: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay, ease: 'easeInOut' }}
                      style={{
                        width: 2, height: 12, borderRadius: 2,
                        background: '#7c3aed', originY: 'center',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Download */}
              <a
                href={mediaUrl(track.download_url)}
                download={track.filename}
                onClick={(e) => e.stopPropagation()}
                style={{
                  flexShrink: 0,
                  width: 30, height: 30, borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(34,211,238,0.12)'; e.currentTarget.style.color = '#22d3ee' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8' }}
                title={`Download ${track.title}`}
              >
                <Download size={13} />
              </a>
            </motion.div>
          )
        })}
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleEnded} style={{ display: 'none' }} />
    </motion.div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stage, setStage]   = useState(STAGES.IDLE)
  const [file, setFile]     = useState(null)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')
  const timerRef = useRef(null)

  const simulateProgress = () => {
    setProgress(0)
    let p = 0
    timerRef.current = setInterval(() => {
      p += Math.random() * 14 + 4
      if (p >= 90) { clearInterval(timerRef.current); p = 90 }
      setProgress(Math.min(90, p))
    }, 350)
  }

  const handleAnalyze = async () => {
    if (!file) return
    setStage(STAGES.ANALYZING)
    setError('')
    simulateProgress()
    try {
      const { data } = await predictAPI.predict(file)
      clearInterval(timerRef.current)
      setProgress(100)
      await new Promise(r => setTimeout(r, 400))
      setResult(data)
      setStage(STAGES.RESULT)
    } catch (err) {
      clearInterval(timerRef.current)
      setError(err.response?.data?.detail || 'Analysis failed. Make sure the backend is running on port 8001.')
      setStage(STAGES.ERROR)
    }
  }

  const reset = () => {
    setStage(STAGES.IDLE)
    setFile(null)
    setResult(null)
    setError('')
    setProgress(0)
  }

  return (
    <Layout>
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {stage === STAGES.IDLE && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              minHeight: 'calc(100vh - 0px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#c4b5fd', fontSize: '0.75rem', fontWeight: 600,
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#a78bfa', display: 'inline-block',
                animation: 'pulse 2s infinite',
              }} />
              AI-Powered Copyright Detection
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800,
                textAlign: 'center', color: '#fff',
                marginBottom: '0.75rem', lineHeight: 1.2,
              }}
            >
              Predict Copyright Risks<br />
              <span className="text-gradient">Before You Upload</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                color: '#94a3b8', fontSize: '1rem',
                textAlign: 'center', maxWidth: 480, marginBottom: '2.5rem',
              }}
            >
              Upload your audio or video file and get instant AI-powered copyright
              risk analysis across all major platforms.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
              style={{
                display: 'flex', gap: '1rem',
                marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center',
              }}
            >
              {[
                { label: 'Accuracy',     value: '95%+' },
                { label: 'Platforms',    value: '1'    },
                { label: 'Catalog Size', value: '1000+'},
              ].map(({ label, value }) => (
                <div key={label} className="glass" style={{
                  borderRadius: '0.75rem', padding: '0.75rem 1.25rem',
                  textAlign: 'center', minWidth: 90,
                }}>
                  <div className="text-gradient" style={{ fontSize: '1.25rem', fontWeight: 800 }}>{value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ width: '100%', maxWidth: 560 }}
            >
              <DropZone onFile={setFile} disabled={false} />
              <motion.button
                onClick={handleAnalyze}
                disabled={!file}
                whileHover={{ scale: file ? 1.01 : 1 }}
                whileTap={{ scale: file ? 0.99 : 1 }}
                style={{
                  marginTop: '1rem', width: '100%', padding: '1rem',
                  borderRadius: '0.75rem',
                  background: file
                    ? 'linear-gradient(135deg,#7c3aed,#2563eb)'
                    : 'rgba(255,255,255,0.06)',
                  color: file ? '#fff' : '#475569',
                  fontWeight: 600, fontSize: '1rem',
                  border: 'none', cursor: file ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '0.6rem',
                  boxShadow: file ? '0 0 20px rgba(124,58,237,0.3)' : 'none',
                  transition: 'all 0.2s',
                }}
              >
                <Zap size={18} />
                {file ? `Analyze "${file.name}"` : 'Select a file to analyze'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {/* ── ANALYZING ── */}
        {stage === STAGES.ANALYZING && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              minHeight: '100vh', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '2rem',
            }}
          >
            <div style={{ width: '100%', maxWidth: 480 }}>
              <AnalysisProgress progress={progress} />
            </div>
          </motion.div>
        )}

        {/* ── ERROR ── */}
        {stage === STAGES.ERROR && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              minHeight: '100vh', display: 'flex',
              alignItems: 'center', justifyContent: 'center', padding: '2rem',
            }}
          >
            <div className="glass" style={{
              borderRadius: '1rem', padding: '2.5rem',
              textAlign: 'center', maxWidth: 440,
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.05)',
            }}>
              <AlertCircle size={40} color="#f87171" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                Analysis Failed
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{error}</p>
              <button onClick={reset} className="btn-gradient" style={{
                padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
                color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <RotateCcw size={15} /> Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── RESULT ── */}
        {stage === STAGES.RESULT && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ padding: '2rem' }}
          >
            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem',
            }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>
                  Analysis Complete
                </h2>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: 2 }}>
                  Results for{' '}
                  <span style={{ color: '#c4b5fd', fontWeight: 500 }}>{file?.name}</span>
                </p>
              </div>
              <button
                onClick={reset}
                className="btn-gradient"
                style={{
                  padding: '0.6rem 1.25rem', borderRadius: '0.75rem',
                  color: '#fff', fontWeight: 600, fontSize: '0.875rem',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 0 15px rgba(124,58,237,0.25)',
                }}
              >
                <RotateCcw size={14} /> New Scan
              </button>
            </div>

            {/* Two-column result grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.25rem',
            }}>
              {/* Left column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <RiskGauge
                  riskScore={result.risk_score}
                  riskLabel={result.risk_label}
                  confidence={result.confidence}
                  explanation={result.explanation}
                />
                <PlatformScores scores={result.platform_scores} />

                {/* ── 4 Royalty-Free Alternatives – ALWAYS shown ── */}
                <SafeMusicPanel alternatives={result.alternatives || []} />
              </div>

              {/* Right column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <MatchDetails matches={result.matches} />
                <FeatureImportance
                  features={result.feature_importance}
                  audioFeatures={result.audio_features}
                />
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </Layout>
  )
}