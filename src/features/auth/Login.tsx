import { useState } from 'react'
import { login } from '@/services/authService'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [form, setForm] = useState({ login: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await login(form)
      navigate('/') // volta pra Home
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Falha ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-semibold">Entrar</h1>
        {error && <div className="p-3 text-sm bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}
        <div className="space-y-1">
          <label className="text-sm font-medium">Login</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={form.login}
            onChange={e => setForm({ ...form, login: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Senha</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        <p className="text-xs text-gray-500">Use as credenciais fornecidas pela PJC/edital.</p>
      </form>
    </div>
  )
}
