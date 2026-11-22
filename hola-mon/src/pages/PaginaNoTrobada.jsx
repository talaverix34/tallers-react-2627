import { Link } from 'react-router'

function PaginaNoTrobada() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-10 gap-4">
      <h2 className="text-3xl font-bold text-red-600">Error 404</h2>
      <p className="text-slate-600">La pàgina que busques no existeix.</p>
      <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold underline">
        Torna a l'inici
      </Link>
    </div>
  )
}

export default PaginaNoTrobada