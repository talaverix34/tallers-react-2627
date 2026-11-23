import { useEffect, useState } from 'react'
import { obtePublicacions } from '../../api/publicacions.js'
import Missatge from '../Missatge.jsx'

function LlistaPublicacions() {
  const [publicacions, setPublicacions] = useState([])
  const [carregant, setCarregant] = useState(true)
  const [error, setError] = useState('')
  const [recarregar, setRecarregar] = useState(0)
  const [cerca, setCerca] = useState('')

  useEffect(() => {
    const controlador = new AbortController()

    async function carrega() {
      setCarregant(true)
      setError('')

      try {
        const dades = await obtePublicacions(controlador.signal)
        setPublicacions(dades)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(err.message || 'No s’han pogut carregar les publicacions.')
      } finally {
        if (!controlador.signal.aborted) {
          setCarregant(false)
        }
      }
    }

    carrega()

    return () => controlador.abort()
  }, [recarregar])

  const publicacionsFiltrades = publicacions.filter(
    (pub) =>
      pub.titol.toLowerCase().includes(cerca.toLowerCase()) ||
      pub.cos.toLowerCase().includes(cerca.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
        <input
          type="text"
          value={cerca}
          onChange={(e) => setCerca(e.target.value)}
          placeholder="Filtra publicacions..."
          className="w-full sm:w-64 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Mostrant {publicacionsFiltrades.length} de {publicacions.length}
          </span>
          <button
            type="button"
            disabled={carregant}
            onClick={() => setRecarregar((n) => n + 1)}
            className="px-3 py-1.5 text-sm rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 transition cursor-pointer disabled:cursor-not-allowed"
          >
            {carregant ? 'Carregant...' : 'Tornar a carregar'}
          </button>
        </div>
      </div>

      {carregant && <Missatge text="Carregant publicacions..." />}

      {!carregant && error && <Missatge text={error} tipus="error" />}

      {!carregant && !error && publicacionsFiltrades.length === 0 && (
        <Missatge text="No hi ha publicacions per mostrar." />
      )}

      {!carregant && !error && publicacionsFiltrades.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {publicacionsFiltrades.map((publicacio) => (
            <li
              key={publicacio.id}
              className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex flex-col gap-2"
            >
              <h3 className="font-bold text-slate-800 capitalize leading-snug">
                {publicacio.titol}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {publicacio.cos}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LlistaPublicacions