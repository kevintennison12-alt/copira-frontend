import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle } from 'lucide-react'

const ACCEPTED = ['.mp3', '.wav', '.mp4', '.ogg', '.flac', '.m4a']

function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function DropZone({ onFile, disabled }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const inputRef = useRef(null)

  const handleFile = useCallback((f) => {
    if (!f) return
    setFile(f)
    onFile(f)
  }, [onFile])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  const clearFile = (e) => {
    e.stopPropagation()
    setFile(null)
    onFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onClick={() => !disabled && !file && inputRef.current?.click()}
      style={{ borderRadius: '1rem', border: '2px dashed', borderColor: dragging ? '#8b5cf6' : 'rgba(255,255,255,0.2)', cursor: file || disabled ? 'default' : 'pointer', transition: 'all 0.3s' }}
    >
      <input ref={inputRef} type="file" accept={ACCEPTED.join(',')} style={{ display: 'none' }}
        onChange={(e) => handleFile(e.target.files[0])} disabled={disabled} />
      <div style={{ padding: '2.5rem', textAlign: 'center' }}>
        {file ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '1rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={28} color="#4ade80" />
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#fff' }}>{file.name}</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: 4 }}>{formatSize(file.size)}</p>
            </div>
            <button onClick={clearFile} style={{ fontSize: '0.75rem', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              <X size={13} /> Remove file
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: 80, height: 80, borderRadius: '1rem', background: dragging ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Upload size={32} color={dragging ? '#a78bfa' : '#64748b'} />
            </div>
            <div>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff', marginBottom: 4 }}>{dragging ? 'Drop it here' : 'Drop your audio file'}</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>or <span style={{ color: '#a78bfa', fontWeight: 500 }}>click to browse</span></p>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              {ACCEPTED.map(ext => (
                <span key={ext} style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 999, background: 'rgba(255,255,255,0.05)', color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}>{ext}</span>
              ))}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#334155' }}>Max file size: 50MB</p>
          </div>
        )}
      </div>
    </div>
  )
}
