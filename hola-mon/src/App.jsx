import { Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import PaginaInici from './pages/PaginaInici.jsx'
import PaginaTasques from './pages/PaginaTasques.jsx'
import PaginaDetallTasca from './pages/PaginaDetallTasca.jsx'
import PaginaNoTrobada from './pages/PaginaNoTrobada.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PaginaInici />} />
        <Route path="tasques" element={<PaginaTasques />} />
        <Route path="tasques/:id" element={<PaginaDetallTasca />} />
        <Route path="*" element={<PaginaNoTrobada />} />
      </Route>
    </Routes>
  )
}

export default App