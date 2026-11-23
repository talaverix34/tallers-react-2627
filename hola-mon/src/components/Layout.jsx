import { NavLink, Outlet } from 'react-router'

function classeEnllac({ isActive }) {
  return isActive ? 'text-blue-600 font-bold' : 'text-gray-600 hover:text-blue-500'
}

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="p-4 bg-white shadow-md border-b">
        <h1 className="text-2xl font-bold mb-2 text-center text-blue-600">El meu projecte</h1>
        <nav aria-label="Navegació principal" className="flex justify-center gap-6">
          <NavLink to="/" end className={classeEnllac}>
            Inici
          </NavLink>
          <NavLink to="/tasques" className={classeEnllac}>
            Tasques
          </NavLink>
          <NavLink to="/descobreix">
            Descobreix
          </NavLink>
        </nav>
      </header>

      <main className="grow p-4">
        <Outlet /> 
      </main>
    </div>
  )
}

export default Layout