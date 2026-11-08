import { useState } from 'react'

function App() {
  const [comptador, setComptador] = useState(0)

  function incrementa() {
    setComptador((anterior) => anterior + 1)
  }


  return (
    <main>
      <h1>Hola món!</h1>
      <p>Has fet clic {comptador} vegades.</p>
      <button onClick={incrementa}>Incrementa</button>
    </main>
  )
}

export default App