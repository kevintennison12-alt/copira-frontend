import { motion } from 'framer-motion'
import { BarChart2 } from 'lucide-react'

export default function FeatureImportance({ features, audioFeatures }) {
  if (!features) return null

  const sorted = Object.entries(features).sort(([, a], [, b]) => b - a)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <BarChart2 size={16} className="text-purple-400" />
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Risk Factor Analysis</h3>
      </div>

      <div className="space-y-3 mb-6">
        {sorted.map(([key, val]) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{key}</span>
              <span className="text-white font-semibold">{Math.round(val * 100)}%</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${val * 100}%` }}
                transition={{ duration: 0.7 }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #7c3aed, #2563eb)' }} />
            </div>
          </div>
        ))}
      </div>

      {audioFeatures && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
          {Object.entries(audioFeatures).map(([key, val]) => (
            <div key={key} className="bg-white/3 rounded-xl p-3">
              <div className="text-xs text-slate-500 capitalize mb-1">{key.replace(/_/g, ' ')}</div>
              <div className="text-sm font-semibold text-white">{typeof val === 'number' ? val.toFixed(1) : val}</div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
