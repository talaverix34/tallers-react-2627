# Fitxa 04 — Provider: `value`, `children` i descendents

[Torna a la Fitxa 04](../Fitxa04.md)

## 1. Dos `value` amb papers diferents

En aquest fragment:

```jsx
<TasquesContext.Provider value={value}>
  {children}
</TasquesContext.Provider>
```

el primer `value` és **el nom de la propietat que espera React**. El segon,
entre claus, és **una variable del nostre codi**. No és cap paraula especial.
Per evitar la coincidència de noms, podem escriure:

```jsx
const dadesCompartides = { tasques, afegeixTasca }

// Dins del return del provider:
<TasquesContext.Provider value={dadesCompartides}>
  {children}
</TasquesContext.Provider>
```

Les claus de `value={dadesCompartides}` permeten fer servir una expressió
JavaScript dins de JSX. Aquí passem un objecte amb una llista i una funció,
no el text literal «dadesCompartides».

## 2. Dos noms de component que no són el mateix

- `TasquesProvider` és el component que **escrivim nosaltres**: guarda l’estat,
  defineix les accions i retorna el provider del context.
- `TasquesContext.Provider` és el provider que **ofereix React per a aquest
  context**: rep el valor que volem posar a disposició dels descendents.

Crear el context amb `createContext(null)` no crea l’estat de les tasques.
L’estat el creem amb `useState` dins de `TasquesProvider`.

## 3. Què és `children`?

Quan escrivim:

```jsx
<TasquesProvider>
  <App />
</TasquesProvider>
```

React passa `<App />` a la prop `children` de `TasquesProvider`.
El nostre component la rep amb `function TasquesProvider({ children })`
i la col·loca dins de `TasquesContext.Provider` amb `{children}`.
Si oblidem renderitzar-la, `App` no apareix.

## 4. Quins components són descendents?

```text
TasquesProvider
└── TasquesContext.Provider
    └── App                  ← children en aquest ús
        ├── ResumTasques     ← llegeix tasques amb useContext
        └── Panell           ← no llegeix ni passa tasques
            └── LlistaTasques ← llegeix tasques i afegeixTasca amb useContext
```

`LlistaTasques` també és descendent, tot i que no és un fill directe.
`Panell` no ha de transportar les dades per props.

Dins d’un component consumidor, al nivell superior de la seva funció:

```jsx
const { tasques, afegeixTasca } = useContext(TasquesContext)
```

`useContext` retorna el valor del provider del **mateix context** més proper
per sobre del consumidor. En aquest exemple retorna l’objecte `dadesCompartides`.
Les dades no s’afegeixen automàticament a les props del component.

## 5. Què passa quan canvien les tasques?

Quan un consumidor crida `afegeixTasca`, aquesta funció actualitza l’estat del
provider. React torna a renderitzar el provider, que ofereix el valor actualitzat,
i actualitza els consumidors d’aquest context. Per això el resum i la llista
mostren les mateixes tasques: **l’estat viu en un sol lloc**.

Un component fora del provider no rep aquest valor: si no té cap altre provider
del mateix context per sobre, `useContext(TasquesContext)` retorna el valor
per defecte de `createContext(null)`, és a dir, `null`.

## 6. Prova-ho

El [projecte executable](../Exemples/Fitxa04/README.md) conté el codi complet,
les instruccions i les comprovacions. És una demostració complementària;
no substitueix `hola-mon` ni afegeix requisits a les activitats.

**Idea clau:** el provider ofereix les dades; `useContext` les llegeix;
`children` determina quin contingut col·loquem dins del provider.
