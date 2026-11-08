const TIPUS_ESTIL = {
    info: 'text-slate-600',
    exit: 'text-green-600',
    error: 'text-rose-600 font-bold',
}

function Missatge({ text, tipus="info" }) {
    const estil = TIPUS_ESTIL[tipus] ?? TIPUS_ESTIL.info
  return (
    <p className="{`text-lg mb-8 ${estil}`}">
        {text}
    </p>
  )
}

export default Missatge