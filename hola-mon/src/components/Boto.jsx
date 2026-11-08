const ESTILS = {
  primari: 'bg-cyan-500 text-slate-950 hover:bg-slate-600',
  secundari: 'bg-slate-700 text-slate-100 hover:bg-slate-600',
  perill: 'bg-rose-500 text-white hover:bg-rose-400'
}

function Boto({ variant = 'primari', className = '', children, ...props }) {
  const estilVariant = ESTILS[variant] ?? ESTILS.primari

  return (
    <button
      type="button"
      className={`rounded-lg px-4 py-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${estilVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Boto