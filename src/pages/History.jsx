import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, RefreshCw, TrendingUp, AlertTriangle, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Layout from '../components/Layout'
import { predictAPI } from '../services/api'

const RISK_STYLE = {
  'Safe':           'text-green-400 bg-green-400/10 border-green-400/20',
  'Low Risk':       'text-lime-400 bg-lime-400/10 border-lime-400/20',
  'Medium Risk':    'text-amber-400 bg-amber-400/10 border-amber-400/20',
  'High Risk':      'text-orange-400 bg-orange-400/10 border-orange-400/20',
  'Very High Risk': 'text-red-400 bg-red-400/10 border-red-400/20',
}

function riskColor(s) {
  if (s < 20) return '#22c55e'
  if (s < 40) return '#84cc16'
  if (s < 60) return '#f59e0b'
  if (s < 80) return '#f97316'
  return '#ef4444'
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await predictAPI.history(50)
      setHistory(data)
    } catch {
      setError('Could not load history. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const avg = history.length ? Math.round(history.reduce((s, h) => s + h.risk_score, 0) / history.length) : 0
  const highRisk = history.filter(h => h.risk_score >= 70).length
  const chartData = [...history].reverse().slice(-20).map((h, i) => ({
    i: i + 1, score: h.risk_score, name: h.filename,
  }))

  return (
    <Layout>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Clock size={26} className="text-purple-400" /> Scan History
            </h1>
            <p className="text-slate-400 mt-1 text-sm">All your previous copyright analyses</p>
          </div>
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-slate-300 hover:text-white hover:bg-white/8 transition-all text-sm disabled:opacity-50">
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats */}
        {history.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Scans', value: history.length, icon: TrendingUp, color: 'text-purple-400' },
              { label: 'Average Risk', value: `${avg}%`, icon: Clock, color: 'text-amber-400' },
              { label: 'High Risk', value: highRisk, icon: AlertTriangle, color: 'text-red-400' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Icon size={18} className={color} />
                </div>
                <div>
                  <div className="text-2xl font-black text-white">{value}</div>
                  <div className="text-xs text-slate-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Trend chart */}
        {chartData.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Risk Score Trend</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="i" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f0f1f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(val, _, p) => [`${val}%`, p.payload.name]}
                  />
                  <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={2}
                    dot={{ fill: '#8b5cf6', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}

        {error && (
          <div className="glass rounded-2xl p-5 border border-red-500/20 bg-red-500/8 text-red-300 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="w-10 h-10 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin mx-auto" />
          </div>
        ) : history.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Clock size={40} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">No scans yet. Upload a file to get started.</p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-semibold text-white text-sm">{history.length} Scans</h3>
            </div>
            <div className="divide-y divide-white/4">
              {history.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}>
                  <div
                    className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{item.filename}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${item.risk_score}%`, backgroundColor: riskColor(item.risk_score) }} />
                        </div>
                        <span className="text-sm font-bold text-white w-10 text-right">{item.risk_score}%</span>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${RISK_STYLE[item.risk_label] || ''}`}>
                        {item.risk_label}
                      </span>
                      {expanded === item.id ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
                    </div>
                  </div>

                  {expanded === item.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="px-5 pb-4 bg-white/2">
                      <p className="text-sm text-slate-300 mb-3">{item.explanation}</p>
                      {item.platform_scores && (
                        <div className="grid grid-cols-4 gap-2">
                          {Object.entries(item.platform_scores).map(([p, s]) => (
                            <div key={p} className="bg-white/4 rounded-lg p-2 text-center">
                              <div className="text-xs text-slate-500">{p}</div>
                              <div className="text-sm font-bold text-white">{s}%</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
