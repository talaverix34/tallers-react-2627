import { useEffect, useState } from 'react'
import { obtePersonatges } from '../../api/personatges.js'
import Missatge from '../Missatge.jsx'

function LlistaPersonatges() {
  // Tres estados separados para representar exactamente en qué punto está la petición
  const [personatges, setPersonatges] = useState([])
  const [carregant, setCarregant] = useState(true)
  const [error, setError] = useState('')
  // Contador que usamos como disparador para repetir la petición al pulsar el botón
  const [recarregar, setRecarregar] = useState(0)

  useEffect(() => {
    // Creamos un controlador para poder abortar esta petición específica
    const controlador = new AbortController()

    async function carrega() {
      // Reiniciamos estados antes de empezar una carga nueva
      setCarregant(true)
      setError('')

      try {
        // Llamamos a nuestra función de API pasándole la señal de cancelación
        const dades = await obtePersonatges(controlador.signal)
        setPersonatges(dades)
      } catch (err) {
        // Si el error es porque nosotros mismos cancelamos la petición, no hacemos nada
        if (err.name === 'AbortError') return
        // Si es un error real (sin red, servidor caído...), lo guardamos para mostrarlo
        setError(err.message || 'No s’han pogut carregar els personatges.')
      } finally {
        // Solo quitamos el estado de carga si esta petición NO ha sido cancelada
        if (!controlador.signal.aborted) {
          setCarregant(false)
        }
      }
    }

    carrega()

    // Función de limpieza (cleanup): React la ejecuta si el componente se desmonta
    // o antes de volver a lanzar el efecto al pulsar "Tornar a carregar"
    return () => controlador.abort()
  }, [recarregar])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        {/* No desactivamos el botón durante la carga para poder probar 
            que varios clics seguidos cancelan las peticiones anteriores */}
        <button
          type="button"
          onClick={() => setRecarregar((n) => n + 1)}
          className="px-4 py-2 text-sm rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
        >
          {error ? 'Reintentar' : 'Tornar a carregar'}
        </button>
      </div>

      {/* Renderizado condicional según el estado actual */}
      {carregant && <Missatge text="Carregant personatges..." />}

      {!carregant && error && <Missatge text={error} tipus="error" />}

      {!carregant && !error && personatges.length === 0 && (
        <Missatge text="No hi ha personatges per mostrar." />
      )}

      {!carregant && !error && personatges.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {personatges.map((personatge) => (
            // 'key' estable con el ID único para que React identifique cada tarjeta
            <li
              key={personatge.id}
              className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-sm flex flex-col"
            >
              <img
                src={personatge.imatge}
                alt={personatge.nom}
                className="w-full h-48 object-cover"
              />
              <div className="p-3 flex flex-col gap-1 text-sm">
                <h3 className="font-bold text-slate-800 text-base">
                  {personatge.nom}
                </h3>
                <p className="text-slate-600">
                  <strong>Estat:</strong> {personatge.estat}
                </p>
                <p className="text-slate-600">
                  <strong>Espècie:</strong> {personatge.especie}
                </p>
                <p className="text-slate-600">
                  <strong>Origen:</strong> {personatge.origen}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LlistaPersonatges