
import Boto from './Boto.jsx'

import { useState } from 'react'

function FormulariTasca({ onAfegir }) {
  const [text, setText] = useState('')

  function envia(e) {
    e.preventDefault()

    const net = text.trim()
    if (!net) return
    onAfegir(net)
    setText('')
  }

  return (
    <form onSubmit={envia}>
        <label htmlFor='tasca'>Nova tasca</label>
        <input id='tasca' type='text' value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="Escriu una tasca..."
          autoComplete="off"
          className="border border-slate-300 rounded-lg px-4 py-2 my-4 mx-2
          focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
        <Boto type='submit'>Afegeix</Boto>

    </form>
    
  )
}

export default FormulariTasca