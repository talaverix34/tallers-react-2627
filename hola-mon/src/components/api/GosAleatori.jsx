import { useEffect, useState } from 'react'
import { obteGosAleatori } from '../../api/gossos.js'
import Missatge from '../Missatge.jsx'

function extreuRaca(url) {
  const parts = url.split('/breeds/')
  if (parts.length < 2) return 'Desconeguda'
  const raca = parts[1].split('/')[0]
  return raca.replace('-', ' ')
}

function GosAleatori() {
  const [gos, setGos] = useState('')
  const [carregant, setCarregant] = useState(true)
  const [error, setError] = useState('')
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()

    async function carrega() {
      setCarregant(true)
      setError('')

      try {
        const imatge = await obteGosAleatori(controlador.signal)
        setGos(imatge)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'No s’ha pogut carregar la imatge del gos.')
      } finally {
        if (!controlador.signal.aborted) {
          setCarregant(false)
        }
      }
    }

    carrega()

    return () => controlador.abort()
  }, [recarregar])

  return (
    <div className="flex flex-col items-center gap-4">
      {carregant && <Missatge text="Carregant gos aleatori..." />}

      {!carregant && error && <Missatge text={error} tipus="error" />}

      {!carregant && !error && gos && (
        <div className="flex flex-col items-center gap-2">
          <img
            src={gos}
            alt={`Fotografia d'un gos de raça ${extreuRaca(gos)}`}
            className="w-full max-w-sm h-64 object-cover rounded-lg shadow-md border border-slate-200"
          />
          <p className="text-sm text-slate-600 capitalize">
            Raça: <strong>{extreuRaca(gos)}</strong>
          </p>
        </div>
      )}

      <button
        type="button"
        disabled={carregant}
        onClick={() => setRecarregar((n) => n + 1)}
        className="px-4 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition cursor-pointer disabled:cursor-not-allowed"
      >
        {carregant ? 'Carregant...' : 'Un altre gos'}
      </button>
    </div>
  )
}

export default GosAleatori