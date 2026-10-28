# Tilde · Café de barrio (paquete Básico)

**URL:** https://demo-cafe-tilde.vercel.app · **Código:** `frontend/projects/cafe-tilde`

## Concepto

Café chiquito en una casa de 1940 del barrio de la Purísima: café tostado los martes, pan desde temprano y desayunos. Lema: "Café de barrio, sin prisa".

Rediseño visual del 28 oct 2026 con la skill `design-taste-frontend`, dirección **"split stage"**. Sustituye al diseño anterior de "fachada ilustrada" (toldo, letrero, pizarrón, vasos y bolsa dibujados), que se sentía caricaturesco. Conserva el movimiento, pero con fotos en lugar de dibujos.

**La idea:** media pantalla es una foto fija que sigue el día del café. Al abrir muestra lo que pasa a esa hora (conchas temprano, latte, desayuno, el salón por la tarde, galletas al final) y cambia con un fundido lento según la sección que se lee.

## Identidad

- **Paleta:** papel de piedra `#dfdedb`, superficie `#d3d2ce`, tinta `#26251e` y el azul añil de las fachadas `#2456d6` solo en los botones de pedir.
- **Tipografía:** Work Sans (una sola familia), títulos ligeros (300).
- **Único adorno:** la franja del toldo (barras de tinta y papel) arriba de la portada y antes del pie.
- **Reglas de la skill:** esquinas rectas, sin líneas, sin sombras, sin degradados.
- **Movimiento (Básico):** CSS + IntersectionObserver, sin GSAP.

## Secciones

1. **Escenario fijo** (`stage.ts` + `core/scene.ts`): la foto fija; cada sección declara su momento con `scene="..."`.
2. **Portada** (`hero.ts`): franja del toldo, "Tilde" grande, el lema, si está abierto ahora y "Pedir para llevar".
3. **Arma tu taza** (`builder.ts`): ingredientes como texto; la receta se ve como barra de proporciones con el nombre y precio de la bebida.
4. **Menú** (`menu.ts`): lista completa con precio y botón para agregar a la bolsa.
5. **Pan del día** (`oven.ts`, a todo lo ancho y en oscuro): "Son las 14:17. Las galletas salen a las 17:00." con la hora real, y los cinco horneados con su estado.
6. **La casa de Fresno 27** (`place.ts`): un marco cuyas fotos cambian solas.
7. **Los de siempre** (`reviews.ts`): reseñas como citas grandes.
8. **Visítanos** (`visit.ts`): frase, foto chica, estado, enlaces y horario con el día de hoy marcado.
9. **Pie** (`footer.ts`): media pantalla de foto y el menú en grande.
10. **La bolsa** (`bag.ts`): panel lateral (se cierra deslizándolo) y comanda final con el botón de WhatsApp.

## Revisión

`lint.mjs` e `inspect.mjs`: 0 errores. Un aviso defendido: no hay video (el único clip libre de café era casero y bajaba la calidad).

## Fotos

24 fotos de Pexels con un toque cálido (`scripts/media-demos.mjs` del workspace de Demos, lista `tilde`).
