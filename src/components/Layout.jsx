import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Shield, LayoutDashboard, Clock, LogOut, User, Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/history', label: 'History', icon: Clock },
]

export default function Layout({ children }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const sidebarStyle = {
    background: 'var(--sidebar-bg)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid var(--border)',
  }

  const ThemeBtn = () => (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        color: dark ? '#fbbf24' : '#7c3aed',
      }}
    >
      <AnimatePresence mode="wait">
        {dark ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Sun size={16} />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
            <Moon size={16} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )

  return (
    <div className="min-h-screen grid-overlay" style={{ background: 'var(--bg)' }}>
      {/* Sidebar – desktop */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-40" style={sidebarStyle}>
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: '1px solid var(--border)' }}>
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center glow-sm">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>COPIRA</div>
              <div className="text-xs text-purple-400 font-medium">AI</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === to ? 'btn-gradient text-white glow-sm' : ''
              }`}
              style={pathname !== to ? { color: 'var(--text2)' } : {}}
              onMouseEnter={e => { if (pathname !== to) e.currentTarget.style.background = 'var(--surface)' }}
              onMouseLeave={e => { if (pathname !== to) e.currentTarget.style.background = '' }}
            >
              <Icon size={17} />{label}
            </Link>
          ))}
        </nav>

        {/* Bottom: theme + user */}
        <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
          {/* Theme toggle */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-3"
            style={{ background: 'var(--surface)' }}>
            <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
              {dark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <ThemeBtn />
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-2"
            style={{ background: 'var(--surface)' }}>
            <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{user?.username || 'Guest'}</div>
              <div className="text-xs truncate" style={{ color: 'var(--text3)' }}>{user?.email || ''}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'var(--text2)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.background = '' }}
          >
            <LogOut size={15} />Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 h-14 flex items-center justify-between"
        style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg btn-gradient flex items-center justify-center">
            <Shield size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>COPPIRA</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeBtn />
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'var(--text2)', padding: 8 }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed top-14 left-0 right-0 z-40 p-4 space-y-1"
            style={{ background: 'var(--sidebar-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}>
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${pathname === to ? 'btn-gradient text-white' : ''}`}
                style={pathname !== to ? { color: 'var(--text2)' } : {}}>
                <Icon size={16} />{label}
              </Link>
            ))}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm" style={{ color: '#f87171' }}>
              <LogOut size={16} />Sign Out
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
