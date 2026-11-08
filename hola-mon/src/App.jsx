import { useState } from 'react'

function App() {
  const [comptador, setComptador] = useState(0)

  function incrementa() {
    setComptador((anterior) => anterior + 1)
  }

  function decrementar() {
    setComptador((anterior) => anterior -1)
  }

  function reiniciar() {
    setComptador(0)
  }


  return (
    <main>
      <h1>Hola món!</h1>
      <p>Has fet clic {comptador} vegades.</p>
      <button onClick={incrementa}>Incrementa</button>
      <button onClick={decrementar}>Decrementa</button>
      <button onClick={reiniciar}>Reiniciar</button>
    </main>
  )
}

export default App