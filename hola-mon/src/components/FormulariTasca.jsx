import Boto from './Boto.jsx'
import Missatge from './Missatge.jsx'
import { useState, useContext } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'

function FormulariTasca() {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  // Leemos también 'enviant' para bloquear el formulario durante la petición POST
  const { afegeixTasca, enviant } = useContext(TasquesContext)

  // La función pasa a ser 'async' porque afegeixTasca ahora hace una petición de red
  async function envia(e) {
    e.preventDefault()

    const net = text.trim()
    if (!net) {
      setError('La tasca no pot estar buida!!')
      return
    }

    setError('')
    // Esperamos a saber si json-server ha guardado bien la tarea (true o false)
    const ok = await afegeixTasca(net)

    // Solo vaciamos el campo si la creación ha funcionado en el servidor
    if (ok) {
      setText('')
    }
  }

  function gestionarCanvi(e) {
    setText(e.target.value)
    if (error) setError('')
  }

  return (
    <form onSubmit={envia} noValidate>
      <label htmlFor="tasca">Nova tasca</label>
      <input
        id="tasca"
        type="text"
        value={text}
        onChange={gestionarCanvi}
        disabled={enviant}
        placeholder="Escriu una tasca..."
        autoComplete="off"
        className="border border-slate-300 rounded-lg px-4 py-2 my-4 mx-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-slate-100 disabled:text-slate-400"
      />
      <p className="text-right text-sm text-slate-500 mb-2">
        {text.length}/80
      </p>

      {error && (
        <div id="error-tasca" className="mb-4 text-red-600">
          <Missatge text={error} tipus="error" />
        </div>
      )}

      <div className="flex justify-center mt-2">
        <Boto type="submit" disabled={enviant}>
          {enviant ? 'Afegint...' : 'Afegeix'}
        </Boto>
      </div>
    </form>
  )
}

export default FormulariTasca