# Fitxa 04 — `useContext` i estat compartit

> **Objectiu general:** continuar el projecte `hola-mon` de la Fitxa 03, compartir les tasques amb un únic context i eliminar el prop drilling consumint-lo directament amb `useContext`.

- **Temps estimat total:** 2 hores i 15 minuts (15 min de lectura prèvia i 2 h a classe).
- **Requisits previs:** haver completat la [Fitxa 03](Fitxa03.md) o tenir un projecte equivalent amb tasques, formulari, filtres i comptadors.
- **Projecte:** **no en crees un de nou**. Treballes dins de `hola-mon`.
- **Abans de classe (15 min):** llegeix els apartats 1.1–1.3.
- **Versions utilitzades:** React 19.3.1, Vite 8.3.4 i Tailwind CSS 4.3.3.

> En aquesta fitxa no crearem cap hook personalitzat ni un segon context. Primer aprendrem les tres peces essencials: `createContext`, el provider i `useContext`.

## Continguts

1. Teoria
2. Activitat 1 — Crear `TasquesContext` i el provider
3. Activitat 2 — Eliminar el prop drilling dels callbacks
4. Activitat 3 — Compartir la llista de tasques
5. Criteris de comprovació
6. Continua el projecte
7. Recursos

---

## 1. Teoria

### 1.1 On som i quin problema resoldrem

A la Fitxa 03, `App` guarda les tasques i passa dades i funcions als descendents:

```text
App
├── FormulariTasca        ← onAfegir
└── LlistaTasques         ← tasques, onToggle, onElimina
    └── Tasca             ← tasca, onToggle, onElimina
```

`LlistaTasques` no utilitza `onToggle` ni `onElimina`: només els transporta fins a `Tasca`. Això s'anomena **prop drilling**.

Amb el context, que veurem encabat, l’estat i les accions viuran a `TasquesProvider`. Els components que els necessitin els podran llegir directament:

```text
main.jsx
└── TasquesProvider
    └── App
        ├── FormulariTasca  ← context
        └── LlistaTasques   ← context
            └── Tasca       ← context + prop tasca
```


El filtre, en aquesta fitxa, continuarà sent estat local d’`App` i es passarà per props. No hi ha prop drilling: només viatja un nivell fins a `FiltreTasques` i `LlistaTasques`.

### 1.2 Les tres peces del context

Aquest punt és força abstracte: fes una primera lectura de les tres peces. A l’activitat 1 les connectaràs construint el codi complet.

#### 1. Crear-lo

```js
import { createContext } from 'react'

export const TasquesContext = createContext(null)
```

`createContext(null)` crea un context. El valor inicial és `null` quan no hi ha cap provider per sobre.

#### 2. Proporcionar un valor

```jsx
<TasquesContext.Provider value={value}>
  {children}
</TasquesContext.Provider>
```

El provider ofereix dades als components que hi ha dins seu, encara que estiguin diversos nivells més avall. A `value={value}`, el primer `value` és el nom fix de la propietat del provider; el segon és una variable nostra amb les dades i funcions que compartim. Podríem anomenar aquesta variable `dadesCompartides` i escriure `value={dadesCompartides}`.

`children` és la prop que rep el contingut escrit entre les etiquetes de `TasquesProvider`. Si escrivim `<TasquesProvider><App /></TasquesProvider>`, `{children}` representa `<App />` i el col·loca dins de `TasquesContext.Provider`.

Les dades **no es converteixen automàticament en props**: cada descendent que les necessita les llegeix amb `useContext`, com veurem tot seguit.

Amplia-ho a l’[annex sobre `value`, `children` i els descendents](Annexos/Fitxa04_Annex_Provider_Value_Children.md), amb un exemple executable.

#### 3. Consumir-lo

```jsx
import { useContext } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'

const { afegeixTasca } = useContext(TasquesContext)
```

`useContext(TasquesContext)` retorna el valor del provider més proper.

> `useContext` és un hook: crida’l sempre al nivell superior del component, mai dins d’un `if`, un bucle o una funció d’esdeveniment.

### 1.3 El provider ha d’estar per sobre

A `main.jsx`, el provider embolcalla tota l’aplicació:

```jsx
<TasquesProvider>
  <App />
</TasquesProvider>
```

Si un component consumeix `TasquesContext` però no té cap provider a sobre, rebrà el valor inicial `null`. Per això és important comprovar l’arbre de components.

### 1.4 Què conté `TasquesContext`?

El context exposarà la llista i accions amb noms del domini:

```jsx
const value = {
  tasques,
  afegeixTasca,
  toggleTasca,
  eliminaTasca,
}
```

No exposarem `setTasques`. Els consumidors demanen què volen fer i el provider decideix com actualitzar l’estat.

### 1.5 Què no posarem al context?

| Dada | On viu | Motiu |
| --- | --- | --- |
| Tasques i accions | `TasquesProvider` | Les necessiten diversos descendents. |
| Text i error del formulari | `FormulariTasca` | Només els utilitza el formulari. |
| Filtre seleccionat | `App` | Només baixa un nivell; les props ja són clares. |
| Una `tasca` concreta | Prop de `Tasca` | Cada fila necessita un element diferent. |
| Comptador | `App` i props | No hi ha prop drilling. |

> **Regla pràctica:** no utilitzis context per eliminar totes les props. Fes-lo servir quan diversos descendents necessiten una dada o quan components intermedis només transporten props.

### 1.6 Estructura final

```text
src/
├── context/
│   ├── TasquesContext.js
│   └── TasquesProvider.jsx
├── components/
│   ├── FiltreTasques.jsx
│   ├── FormulariTasca.jsx
│   ├── LlistaTasques.jsx
│   └── Tasca.jsx
├── App.jsx
└── main.jsx
```

| Component | Props principals | Context |
| --- | --- | --- |
| `App` | — | Llegeix `tasques` per calcular comptadors. |
| `FormulariTasca` | — | Llegeix `afegeixTasca`. |
| `FiltreTasques` | `filtre`, `onCanviaFiltre` | — |
| `LlistaTasques` | `filtre` | Llegeix `tasques` i calcula la llista visible. |
| `Tasca` | `tasca` | Llegeix `toggleTasca` i `eliminaTasca`. |

---

## 2. Activitat 1 — Crear `TasquesContext` i el provider

**Objectiu:** moure l’estat de tasques a un provider i consumir-lo directament des d’`App` i `FormulariTasca`.

**Temps estimat:** 55 minuts.

### Esglaó 1 — Crear el context

1. Crea la carpeta `src/context/`.
2. Crea `src/context/TasquesContext.js`.
3. Importa `createContext` i exporta el context:

```js
import { createContext } from 'react'

export const TasquesContext = createContext(null)
```

**Comprovació:** el fitxer només crea i exporta el context. No cal comprovar res.

### Esglaó 2 — Crear el provider

1. Crea `src/context/TasquesProvider.jsx`.
2. Mou-hi l’estat `tasques` i les funcions `afegeixTasca`, `toggleTasca` i `eliminaTasca` que ara tens a `App`.
3. Crea l’objecte `value` amb les tasques i les tres accions.
4. Retorna el provider amb `{children}` a dins.

```jsx
import { useState } from 'react'
import { TasquesContext } from './TasquesContext.js'

function TasquesProvider({ children }) {
  const [tasques, setTasques] = useState([])

  function afegeixTasca(text) {
    const novaTasca = {
      id: crypto.randomUUID(),
      text,
      feta: false,
    }

    setTasques((anteriors) => [...anteriors, novaTasca])
  }

  function toggleTasca(id) {
    setTasques((anteriors) =>
      anteriors.map((tasca) =>
        tasca.id === id ? { ...tasca, feta: !tasca.feta } : tasca,
      ),
    )
  }

  function eliminaTasca(id) {
    setTasques((anteriors) => anteriors.filter((tasca) => tasca.id !== id))
  }

  const value = { tasques, afegeixTasca, toggleTasca, eliminaTasca } // Tot el que tenim dins

  return (
    <TasquesContext.Provider value={value}>
      {children}
    </TasquesContext.Provider>
  )
}

export default TasquesProvider
```

### Esglaó 3 — Col·locar el provider

A `main.jsx`, importa’l i embolcalla `<App />`:

```jsx
<StrictMode>
  <TasquesProvider>
    <App />
  </TasquesProvider>
</StrictMode>
```

### Esglaó 4 — Consumir el context directament

A `App.jsx`:

```jsx
import { useContext, useState } from 'react'
import { TasquesContext } from './context/TasquesContext.js'

const { tasques, toggleTasca, eliminaTasca } = useContext(TasquesContext)
```

Elimina d’`App` l’estat i les funcions que has mogut al provider. Mantén-hi el filtre i els càlculs derivats.

A `FormulariTasca.jsx`:

```jsx
import { useContext, useState } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'

const { afegeixTasca } = useContext(TasquesContext)
```

Elimina el prop `onAfegir` i renderitza `<FormulariTasca />` sense props.

**Comprovació:** es poden afegir tasques i la resta de l’aplicació continua funcionant. `LlistaTasques` encara rep els callbacks; els eliminarem a l’activitat següent.

---

## 3. Activitat 2 — Eliminar el prop drilling dels callbacks

**Objectiu:** fer que `Tasca` consumeixi les accions i deixar de transportar callbacks per `LlistaTasques`.

**Temps estimat:** 35 minuts.

### Esglaó 1 — Consumir les accions a `Tasca`

1. Importa `useContext` i `TasquesContext`.
2. Canvia la signatura a `function Tasca({ tasca })`.
3. Llegeix les accions:

```jsx
const { toggleTasca, eliminaTasca } = useContext(TasquesContext)
```

4. Crida-les amb `tasca.id` des del checkbox i el botó.

### Esglaó 2 — Netejar `LlistaTasques`

Elimina `onToggle` i `onElimina` de les props i passa només cada tasca:

```jsx
{tasques.map((tasca) => (
  <Tasca key={tasca.id} tasca={tasca} />
))}
```

### Esglaó 3 — Netejar `App`

`App` ja no necessita llegir les accions. Consumeix només les tasques:

```jsx
const { tasques } = useContext(TasquesContext)
```

I deixa la llista així:

```jsx
<LlistaTasques
  tasques={tasquesFiltrades}
  missatgeBuit={missatgeBuit}
/>
```

**Comprovació:** afegir, completar i eliminar funciona; `LlistaTasques` ja no transporta callbacks i `Tasca` només rep `tasca`.

---

## 4. Activitat 3 — Compartir la llista de tasques

**Objectiu:** fer que `LlistaTasques` llegeixi les tasques del context, mantenint el filtre local a `App`.

**Temps estimat:** 30 minuts.

### Esglaó 1 — Passar només el filtre

A `App`, elimina el càlcul de `tasquesFiltrades` i `missatgeBuit`. Renderitza:

```jsx
<LlistaTasques filtre={filtre} />
```

Mantén aquests props perquè són directes i expressen clarament qui controla el filtre:

```jsx
<FiltreTasques filtre={filtre} onCanviaFiltre={setFiltre} />
```

### Esglaó 2 — Llegir les tasques a `LlistaTasques`

```jsx
import { useContext } from 'react'
import { TasquesContext } from '../context/TasquesContext.js'

function LlistaTasques({ filtre }) {
  const { tasques } = useContext(TasquesContext)

  const tasquesFiltrades = tasques.filter((tasca) => {
    if (filtre === 'pendents') return !tasca.feta
    if (filtre === 'fetes') return tasca.feta
    return true
  })

  // Calcula també missatgeBuit i renderitza la llista.
}
```

`tasquesFiltrades` continua sent estat derivat: no creïs un altre `useState`.

### Esglaó 3 — Revisar els límits del context

Comprova amb React DevTools:

- `Tasca` només rep `tasca`;
- `LlistaTasques` només rep `filtre`;
- `FiltreTasques` rep `filtre` i `onCanviaFiltre`;
- no existeix cap `FiltreTasquesContext`;
- el comptador continua funcionant amb props.

> **Ampliació opcional:** quan dominis aquest esquema, pots provar de crear un segon context per al filtre. No és un requisit de la fitxa.

---

## 5. Criteris de comprovació

- [ ] Has continuat dins de `hola-mon`.
- [ ] Existeixen `TasquesContext.js` i `TasquesProvider.jsx`.
- [ ] `TasquesContext.js` no defineix cap hook personalitzat.
- [ ] `main.jsx` embolcalla `App` amb `TasquesProvider`.
- [ ] Els consumidors fan servir `useContext(TasquesContext)` directament.
- [ ] El provider conté `tasques` i les tres accions.
- [ ] `FormulariTasca` no rep `onAfegir`.
- [ ] `Tasca` només rep `tasca` i consumeix les accions.
- [ ] `LlistaTasques` no transporta callbacks.
- [ ] A l’activitat final, `LlistaTasques` rep només `filtre` i llegeix `tasques` del context.
- [ ] `filtre` continua sent estat local d’`App`.
- [ ] `FiltreTasques` continua fent servir props.
- [ ] El text i l’error del formulari són estat local.
- [ ] Els comptadors i la llista filtrada són estat derivat.
- [ ] No hi ha cap context per al comptador ni per al filtre.
- [ ] La consola no mostra errors ni avisos.

---

## 6. Continua el projecte

Guarda `hola-mon`. A la [Fitxa 05](Fitxa05.md) aprendrem a conservar les tasques i el filtre a `localStorage`. La persistència s’adaptarà a aquesta estructura: les tasques viuen al provider i el filtre continua a `App`.

---

## 7. Recursos

- Context: <https://react.dev/learn/passing-data-deeply-with-context>
- `createContext`: <https://react.dev/reference/react/createContext>
- `useContext`: <https://react.dev/reference/react/useContext>
- Regles dels hooks: <https://react.dev/reference/rules/rules-of-hooks>
