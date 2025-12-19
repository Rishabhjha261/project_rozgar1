import { useMemo, useState } from 'react'
import { NavLink } from 'react-router-dom'
import PrefsControls from './PrefsControls'
import { useT } from '../i18n/useT'
import { usePrefsStore } from '../store/prefsStore'

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        [
          'rounded-xl px-3 py-2 text-sm font-medium',
          isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const { t } = useT()
  const role = usePrefsStore((s) => s.role)

  const [open, setOpen] = useState(false)

  const navItems = useMemo(() => {
    const base = [
      { to: '/', label: t('nav.home') },
      { to: '/jobs', label: t('nav.jobs') },
      { to: '/about', label: t('nav.about') },
      { to: '/contact', label: t('nav.contact') },
      { to: '/login', label: t('nav.login') },
      { to: '/signup', label: t('nav.signup') },
    ]

    if (role === 'employer') {
      base.splice(2, 0, { to: '/employer/post-job', label: t('nav.postJob') })
      base.splice(3, 0, { to: '/employer/my-jobs', label: t('nav.myJobs') })
    }

    if (role === 'admin') {
      base.splice(2, 0, { to: '/admin/reports', label: t('nav.adminReports') })
    }

    return base
  }, [role, t])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white">
            R
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-slate-900">Rozgar</div>
            <div className="text-xs text-slate-500">Blue-collar jobs nearby</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} label={item.label} />
          ))}
        </nav>

        <div className="hidden md:block">
          <PrefsControls />
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto grid max-w-5xl gap-1 px-4 py-3">
            {navItems.map((item) => (
              <NavItem key={item.to} to={item.to} label={item.label} onClick={() => setOpen(false)} />
            ))}

            <div className="mt-3">
              <PrefsControls variant="card" />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
