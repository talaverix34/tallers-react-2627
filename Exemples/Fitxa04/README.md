# Fitxa 04 — Experimenta amb el valor del provider

Demostració complementària de l’[annex sobre el provider](../../Annexos/Fitxa04_Annex_Provider_Value_Children.md).
No substitueix el projecte acumulatiu `hola-mon` ni és la solució de les activitats.

## Execució

Requisits: Node.js **22.22.2 o superior**, npm i un navegador actual.
Des de l’arrel del repositori:

```bash
cd Exemples/Fitxa04
npm ci
npm run dev
```

Obre l’adreça que indiqui Vite. Per comprovar la compilació:

```bash
npm run build
```

## Fitxers que cal mirar

- `src/context/TasquesContext.js`: crea el context amb valor per defecte `null`.
- `src/context/TasquesProvider.jsx`: guarda l’únic estat de tasques i passa
  `value={dadesCompartides}`; la variable no es diu `value` expressament.
- `src/main.jsx`: passa `<App />` com a `children` i deixa `ForaDelProvider` fora.
- `src/App.jsx`: resum i llista consumeixen el context; `Panell` no el consumeix
  ni transporta dades per props.

## Resultats a observar

1. Inicialment el resum indica zero tasques i la llista està buida.
2. Prem **Afegeix una tasca** dues vegades: apareixen `Tasca 1` i `Tasca 2`,
   i el resum mostra 2. Dos consumidors llegeixen el mateix estat.
3. El component exterior continua mostrant `null`: no és descendent del provider.
4. Revisa `Panell`: no rep `tasques` ni `afegeixTasca`, però la llista les pot llegir.
5. Reanomena `dadesCompartides` a `value` tant en la declaració com en
   `value={...}`: el comportament no canvia. La propietat de l’esquerra continua
   sent `value`.
6. Treu temporalment `{children}` del retorn del provider: `App` desapareix,
   però el component exterior continua visible. Desfés aquest canvi després.
7. Recarrega la pàgina: les tasques desapareixen. Aquest exemple no utilitza
   `localStorage`.
