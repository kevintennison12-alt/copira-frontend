import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle, Music, Shield, Play, Pause, Download, ExternalLink } from 'lucide-react'
import { useState, useRef } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001'

/** Prepend backend origin to a relative /media/… path */
const getMediaUrl = (path) => `${BASE_URL}${path}`

// ─────────────────────────────────────────────────────────────────────────────
// Sub-component: royalty-free alternatives list
// Defined at module level so it can call getMediaUrl (now in module scope)
// ─────────────────────────────────────────────────────────────────────────────
function AlternativesList({ alternatives, playingTrack, onToggle }) {
  if (!alternatives?.length) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Shield size={16} className="text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Safe Music Library
        </h3>
        <span className="ml-auto text-xs text-slate-500">{alternatives.length} tracks</span>
      </div>

      <div className="space-y-3">
        {alternatives.map((track, i) => (
          <motion.div
            key={track.filename || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            {/* Play button + info */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => onToggle(track)}
                className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all"
                aria-label={playingTrack?.audio_url === track.audio_url ? 'Pause' : 'Play'}
              >
                {playingTrack?.audio_url === track.audio_url
                  ? <Pause size={16} fill="currentColor" />
                  : <Play  size={16} fill="currentColor" className="ml-0.5" />}
              </button>

              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{track.title}</p>
                <p className="text-xs text-slate-400 truncate">
                  {track.artist}
                  {track.genre && track.genre !== 'Various' ? ` • ${track.genre}` : ''}
                </p>
              </div>
            </div>

            {/* Download button */}
            <a
              href={getMediaUrl(track.download_url)}
              download
              className="flex-shrink-0 p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all ml-2"
              title="Download track"
            >
              <Download size={16} />
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function MatchDetails({ matches, alternatives = [] }) {
  const [playingTrack, setPlayingTrack] = useState(null)
  const audioRef = useRef(null)

  const togglePlay = (track) => {
    if (!audioRef.current) return

    if (playingTrack?.audio_url === track.audio_url) {
      audioRef.current.pause()
      setPlayingTrack(null)
    } else {
      setPlayingTrack(track)
      audioRef.current.src = getMediaUrl(track.audio_url)
      audioRef.current.play().catch(console.error)
    }
  }

  const handleEnded = () => setPlayingTrack(null)

  // ── No matches → green safe banner + music library ──────────────────────
  if (!matches?.length) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Copyright Check
          </h3>
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border:     '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-green-300">No Copyright Matches Found</p>
              <p className="text-xs text-slate-400 mt-0.5">Your audio is safe to use.</p>
            </div>
          </div>
        </motion.div>

        <AlternativesList
          alternatives={alternatives}
          playingTrack={playingTrack}
          onToggle={togglePlay}
        />
        <audio ref={audioRef} onEnded={handleEnded} />
      </div>
    )
  }

  // ── Matches found → red warning cards + music library below ────────────
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-red-400" />
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Copyright Matches
          </h3>
          <span className="ml-auto text-xs text-red-400 font-medium">
            {matches.length} match{matches.length > 1 ? 'es' : ''} found
          </span>
        </div>

        <div className="space-y-4">
          {matches.map((match, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl overflow-hidden"
              style={{
                border:     '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.06)',
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center gap-3 p-4 border-b"
                style={{ borderColor: 'rgba(239,68,68,0.15)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.15)' }}
                >
                  <Music size={16} className="text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{match.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{match.artist}</p>
                </div>
                {/* Similarity badge */}
                <div
                  className="flex-shrink-0 px-2 py-1 rounded-lg text-xs font-bold text-red-300"
                  style={{ background: 'rgba(239,68,68,0.15)' }}
                >
                  {Math.round((match.similarity ?? 0) * 100)}% match
                </div>
              </div>

              {/* Detail rows */}
              <div className="grid grid-cols-2 gap-px p-4 text-xs">
                {match.copyright_owner && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Rights Holder</p>
                    <p className="text-slate-300 font-medium">{match.copyright_owner}</p>
                  </div>
                )}
                {match.label && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Label</p>
                    <p className="text-slate-300 font-medium">{match.label}</p>
                  </div>
                )}
                {match.confidence != null && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Confidence</p>
                    <p className="text-slate-300 font-medium">
                      {Math.round(match.confidence * 100)}%
                    </p>
                  </div>
                )}
                {match.language && (
                  <div>
                    <p className="text-slate-500 mb-0.5">Language</p>
                    <p className="text-slate-300 font-medium">{match.language}</p>
                  </div>
                )}
              </div>

              {/* Platform detection */}
              {match.platform_detection?.YouTube != null && (
                <div
                  className="px-4 pb-4 pt-0 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-500">YouTube Content ID risk</span>
                  <span
                    className="font-bold"
                    style={{ color: match.platform_detection.YouTube > 70 ? '#f87171' : '#fb923c' }}
                  >
                    {match.platform_detection.YouTube}%
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Royalty-free suggestions shown even when copyright was found */}
      <AlternativesList
        alternatives={alternatives}
        playingTrack={playingTrack}
        onToggle={togglePlay}
      />

      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  )
}