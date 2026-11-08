function Targeta({ titol, children }) {
  return (
    <section className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-lg mx-auto border border-slate-200">
      <h2 className="text-2xl font-bold text-blue-600 mb-6 text-center">{titol}</h2>
      <div className="flex flex-col items-center">
        {children}
      </div>
    </section>
  )
}

export default Targeta