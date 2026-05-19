import { motion } from 'framer-motion'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Youtube } from 'lucide-react'

export default function PlatformScores({ scores }) {
  // Filter for YouTube only and prepare data for the chart
  const ytValue = scores?.YouTube || 0
  const data = [{ name: 'YouTube', value: ytValue }]

  const riskColor = (val) => {
    if (val > 70) return '#ef4444' // Red for High Risk
    if (val > 40) return '#fb923c' // Orange for Medium
    return '#4ade80'               // Green for Low
  }

  const riskLabel = (val) => {
    if (val > 70) return 'Very High'
    if (val > 40) return 'Medium'
    return 'Low'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
        YouTube Content ID Analysis
      </h3>

      {/* Main YouTube Risk Card */}
      <div className="mb-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/4 rounded-xl p-6 border border-white/6"
          style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" 
                   style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
                <Youtube className="text-red-500" size={24} />
              </div>
              <div>
                <span className="block text-lg font-bold text-white">YouTube</span>
                <span className="text-xs text-slate-400">Content ID Algorithm Detection</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ color: riskColor(ytValue), backgroundColor: `${riskColor(ytValue)}18` }}>
              {riskLabel(ytValue)} Risk
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <div className="text-5xl font-black text-white">{ytValue}%</div>
            <div className="text-sm text-slate-500 font-medium">Match Probability</div>
          </div>

          <div className="h-3 bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${ytValue}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full" 
              style={{ backgroundColor: riskColor(ytValue) }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Simplified Single-Bar Visualization */}
      <div className="h-28 opacity-60">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={60}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 border border-white/10 p-2 rounded-lg text-xs text-white">
                      YouTube Risk: {payload[0].value}%
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              <Cell fill={riskColor(ytValue)} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <p className="text-[10px] text-slate-500 mt-4 text-center italic">
        Stats specifically generated based on YouTube Global Rights Management guidelines.
      </p>
    </motion.div>
  )
}