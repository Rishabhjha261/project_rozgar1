import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import VoiceSearchButton from '../components/VoiceSearchButton'
import { CATEGORIES } from '../data/categories'
import { useT } from '../i18n/useT'

function CategoryCard({ category }) {
  const { t } = useT()

  return (
    <Link
      to={`/jobs?category=${encodeURIComponent(category.key)}`}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
        {category.icon}
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">{t(category.labelKey)}</div>
        <div className="text-xs text-slate-500">{t('home.tapToSee')}</div>
      </div>
      <div className="ml-auto text-slate-300 transition group-hover:text-slate-400">›</div>
    </Link>
  )
}

export default function Home() {
  const { t, language } = useT()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter((c) => t(c.labelKey).toLowerCase().includes(q))
  }, [query, t])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-5 text-white shadow-sm md:p-7">
        <h1 className="text-2xl font-extrabold leading-snug md:text-3xl">{t('home.heroTitle')}</h1>
        <p className="mt-2 max-w-2xl text-sm text-emerald-50 md:text-base">{t('home.heroSubtitle')}</p>

        <div className="mt-5 flex flex-col gap-2 md:max-w-xl md:flex-row">
          <label className="sr-only" htmlFor="search">
            Search categories
          </label>
          <div className="flex w-full gap-2">
            <input
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder')}
              className="w-full rounded-2xl border border-white/30 bg-white/95 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none ring-emerald-100 focus:ring-4"
            />
            <div className="shrink-0">
              <VoiceSearchButton language={language} onText={(text) => setQuery(text)} />
            </div>
          </div>
          <button
            type="button"
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
            onClick={() => {
              const el = document.getElementById('categories')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {t('common.explore')}
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-white/15 px-3 py-1">📍 Nearby jobs</span>
          <span className="rounded-full bg-white/15 px-3 py-1">✅ Verified employers</span>
          <span className="rounded-full bg-white/15 px-3 py-1">📞 Call / WhatsApp</span>
        </div>
      </section>

      <section id="categories" className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{t('home.categories')}</h2>
          <div className="text-xs text-slate-500">{filtered.length} shown</div>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CategoryCard key={c.key} category={c} />
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            No categories match “{query}”. Try a simpler search.
          </div>
        ) : null}
      </section>

      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
        <h3 className="text-base font-bold text-slate-900">{t('home.aboutTitle')}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{t('home.aboutText')}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Fast</div>
            <div className="mt-1 text-xs text-slate-600">Find work in a few taps.</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Nearby</div>
            <div className="mt-1 text-xs text-slate-600">Sort by distance using location.</div>
          </div>
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-900">Trusted</div>
            <div className="mt-1 text-xs text-slate-600">Verification + reporting flow.</div>
          </div>
        </div>
      </section>
    </div>
  )
}
