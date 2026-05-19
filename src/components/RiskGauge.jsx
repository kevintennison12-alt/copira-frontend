import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const RISK_META = {
  'Safe':          { color: '#22c55e', bg: 'from-green-500/15 to-green-600/5',   border: 'border-green-500/20' },
  'Low Risk':      { color: '#84cc16', bg: 'from-lime-500/15 to-lime-600/5',     border: 'border-lime-500/20' },
  'Medium Risk':   { color: '#f59e0b', bg: 'from-amber-500/15 to-amber-600/5',   border: 'border-amber-500/20' },
  'High Risk':     { color: '#f97316', bg: 'from-orange-500/15 to-orange-600/5', border: 'border-orange-500/20' },
  'Very High Risk':{ color: '#ef4444', bg: 'from-red-500/15 to-red-600/5',       border: 'border-red-500/20' },
}

export default function RiskGauge({ riskScore, riskLabel, confidence, explanation }) {
  const meta = RISK_META[riskLabel] || RISK_META['Medium Risk']
  const gaugeData = [{ value: riskScore }, { value: 100 - riskScore }]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-2xl p-6 bg-gradient-to-br ${meta.bg} border ${meta.border}`}
      style={{ color: 'var(--text)' }}
    >
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">Copyright Risk Score</h3>

      <div className="flex items-center gap-6">
        {/* Circular gauge */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={gaugeData} cx="50%" cy="50%" innerRadius={48} outerRadius={64}
                startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                <Cell fill={meta.color} />
                <Cell fill="rgba(255,255,255,0.04)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-black text-white"
            >
              {riskScore}
            </motion.span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mb-3"
            style={{ backgroundColor: `${meta.color}20`, color: meta.color }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: meta.color }} />
            {riskLabel}
          </div>
          <div className="text-sm text-slate-400 mb-3">
            Confidence: <span className="text-white font-semibold">{Math.round(confidence * 100)}%</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{explanation}</p>
        </div>
      </div>

      {/* Gradient bar */}
      <div className="mt-5">
        <div className="flex justify-between text-xs text-slate-600 mb-1.5">
          <span>Safe</span><span>Low</span><span>Medium</span><span>High</span><span>Very High</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(to right, #22c55e, #f59e0b, #ef4444)` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
