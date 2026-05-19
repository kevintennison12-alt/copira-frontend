import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Play, Pause, Download, Music, Clock, Activity,
         Volume2, VolumeX, AlertCircle } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || ''

// Use relative URL so Vite proxy handles it — avoids CORS on audio elements
function resolveUrl(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  // src is like /media/yal_001-sunset-drive.wav
  // In dev: Vite proxy forwards /media/* → http://localhost:8001/media/*
  // In prod: set VITE_API_URL to your backend base
  return API_BASE ? `${API_BASE}${src}` : src
}

const MOOD_COLOR = {
  Relaxing:'#22d3ee', Energetic:'#fb923c', Epic:'#f87171', Happy:'#facc15',
  Nostalgic:'#a78bfa', Smooth:'#60a5fa', Calm:'#34d399', Cheerful:'#f472b6',
  Powerful:'#fb923c', Cool:'#22d3ee', Fun:'#facc15', Adventurous:'#4ade80',
  Peaceful:'#60a5fa', Upbeat:'#a78bfa', Emotional:'#f472b6', Dark:'#94a3b8',
  Melancholic:'#818cf8', Tense:'#f87171', Uplifting:'#34d399', Groovy:'#fbbf24',
  Soulful:'#fb923c', Inspiring:'#60a5fa', Triumphant:'#facc15', Focused:'#22d3ee',
  Romantic:'#f472b6', Meditative:'#34d399',
}

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// Global audio manager — only one track plays at a time
const audioManager = { current: null }

function TrackPlayer({ src, title, duration }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const audioRef = useRef(null)

  const fullSrc = resolveUrl(src)

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.crossOrigin = 'anonymous'
    audio.volume = volume
    audioRef.current = audio

    audio.addEventListener('loadedmetadata', () => {
      setTotalDuration(audio.duration)
      setLoading(false)
    })
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
      if (audio.duration > 0) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    })
    audio.addEventListener('ended', () => {
      setPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    })
    audio.addEventListener('waiting', () => setLoading(true))
    audio.addEventListener('canplay', () => setLoading(false))
    audio.addEventListener('error', (e) => {
      setError('Audio failed to load')
      setLoading(false)
      setPlaying(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      // Stop any other playing track
      if (audioManager.current && audioManager.current !== audio) {
        audioManager.current.pause()
      }
      audioManager.current = audio

      if (!audio.src) {
        audio.src = fullSrc
        setLoading(true)
      }
      audio.play()
        .then(() => setPlaying(true))
        .catch(err => {
          setError('Playback failed — try clicking again')
          setPlaying(false)
        })
    }
  }

  const seek = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audio.currentTime = pct * audio.duration
    setProgress(pct * 100)
  }

  const changeVolume = (e) => {
    e.stopPropagation()
    const v = parseFloat(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
    setMuted(v === 0)
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    const newMuted = !muted
    setMuted(newMuted)
    audio.muted = newMuted
  }

  return (
    <div style={{ marginTop: 12, padding: '10px 12px', borderRadius: 10,
      background: 'var(--surface)', border: '1px solid var(--border)' }}>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
          fontSize: '0.7rem', color: '#f87171' }}>
          <AlertCircle size={11} />
          {error}
          <button onClick={() => setError(null)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none',
              cursor: 'pointer', color: '#f87171', fontSize: '0.7rem' }}>
            Retry
          </button>
        </div>
      )}

      {/* Main controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Play/Pause */}
        <button onClick={toggle}
          style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: playing ? '0 0 14px rgba(124,58,237,0.5)' : '0 0 8px rgba(124,58,237,0.25)',
            transition: 'box-shadow 0.2s' }}>
          {loading
            ? <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            : playing
              ? <Pause size={13} color="#fff" />
              : <Play size={13} color="#fff" style={{ marginLeft: 1 }} />
          }
        </button>

        {/* Progress bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div onClick={seek} style={{ height: 5, borderRadius: 3,
            background: 'rgba(255,255,255,0.1)', cursor: 'pointer', position: 'relative' }}>
            <div style={{ height: '100%', width: `${progress}%`,
              background: 'linear-gradient(to right,#7c3aed,#2563eb)',
              borderRadius: 3, transition: 'width 0.1s linear' }} />
            {/* Thumb */}
            <div style={{ position: 'absolute', top: '50%', left: `${progress}%`,
              transform: 'translate(-50%,-50%)', width: 10, height: 10,
              borderRadius: '50%', background: '#a78bfa',
              boxShadow: '0 0 4px rgba(167,139,250,0.8)',
              opacity: playing ? 1 : 0, transition: 'opacity 0.2s' }} />
          </div>
          {/* Time */}
          <div style={{ display: 'flex', justifyContent: 'space-between',
            fontSize: '0.65rem', color: 'var(--text3)' }}>
            <span>{formatTime(currentTime)}</span>
            <span>{totalDuration > 0 ? formatTime(totalDuration) : duration || '--:--'}</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <button onClick={toggleMute}
            style={{ background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text3)', padding: 2 }}>
            {muted || volume === 0 ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
          <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
            onChange={changeVolume}
            onClick={e => e.stopPropagation()}
            style={{ width: 48, height: 3, accentColor: '#7c3aed', cursor: 'pointer' }} />
        </div>

        {/* Download */}
        <a href={fullSrc} download={`${title}.wav`}
          onClick={e => e.stopPropagation()}
          title="Download audio file"
          style={{ width: 30, height: 30, borderRadius: '50%',
            background: 'var(--surface)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            textDecoration: 'none', flexShrink: 0,
            color: 'var(--text2)' }}>
          <Download size={12} />
        </a>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

export default function Alternatives({ alternatives }) {
  if (!alternatives?.length) return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }} className="glass rounded-2xl p-6">

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Lightbulb size={17} color="#fbbf24" />
        <h3 className="text-sm font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text2)' }}>
          YouTube Audio Library Alternatives
        </h3>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: '1.25rem' }}>
        Style-matched royalty-free tracks — play and download directly in the app
      </p>

      <div style={{ display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {alternatives.map((alt, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{ padding: '1rem', borderRadius: '0.875rem',
              background: 'var(--card-bg)', border: '1px solid var(--border)' }}>

            {/* Track header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: '0.625rem',
                flexShrink: 0, background: 'rgba(139,92,246,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Music size={16} color="#a78bfa" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.875rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {alt.title}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text3)', marginTop: 1 }}>
                  {alt.artist}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 5, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999,
                background: 'rgba(139,92,246,0.12)', color: '#a78bfa', fontWeight: 600 }}>
                {alt.genre}
              </span>
              <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999,
                background: `${MOOD_COLOR[alt.mood] || '#94a3b8'}18`,
                color: MOOD_COLOR[alt.mood] || 'var(--text2)', fontWeight: 600 }}>
                {alt.mood}
              </span>
              {alt.bpm && (
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999,
                  background: 'var(--surface)', color: 'var(--text2)',
                  display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Activity size={9} /> {alt.bpm} BPM
                </span>
              )}
              {alt.duration && (
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999,
                  background: 'var(--surface)', color: 'var(--text2)',
                  display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={9} /> {alt.duration}
                </span>
              )}
              {alt.risk_score !== undefined && (
                <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 999,
                  background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontWeight: 700 }}>
                  {alt.risk_score}% risk
                </span>
              )}
            </div>

            {/* Source */}
            <div style={{ marginTop: 8, fontSize: '0.68rem', color: 'var(--text3)',
              display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%',
                background: '#4ade80', display: 'inline-block' }} />
              {alt.source || 'YouTube Audio Library'}
            </div>

            {/* Audio player */}
            {(alt.audio_url || alt.audio_file) && (
              <TrackPlayer
                src={alt.audio_url || alt.audio_file}
                title={alt.title}
                duration={alt.duration}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
