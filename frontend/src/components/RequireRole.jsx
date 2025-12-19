import { Navigate, useLocation } from 'react-router-dom'
import { usePrefsStore } from '../store/prefsStore'

export default function RequireRole({ allow, children }) {
  const role = usePrefsStore((s) => s.role)
  const location = useLocation()

  if (!allow.includes(role)) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}
