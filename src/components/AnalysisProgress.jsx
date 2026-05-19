import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

const STEPS = [
  'Uploading file...',
  'Extracting audio features...',
  'Running fingerprint analysis...',
  'Comparing against copyright catalog...',
  'Computing risk scores...',
  'Generating recommendations...',
]

export default function AnalysisProgress({ progress, step }) {
  const stepIndex = Math.min(Math.floor((progress / 100) * STEPS.length), STEPS.length - 1)
  const currentStep = STEPS[stepIndex]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-2xl p-10 text-center"
    >
      {/* Animated shield */}
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-3 rounded-full btn-gradient flex items-center justify-center glow-purple">
          <Shield size={24} className="text-white" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Analyzing Your Content</h3>
      <p className="text-slate-400 text-sm mb-8">AI is scanning for copyright patterns...</p>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-2">
          <span>{currentStep}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full btn-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-6">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i <= stepIndex ? 'bg-purple-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}
