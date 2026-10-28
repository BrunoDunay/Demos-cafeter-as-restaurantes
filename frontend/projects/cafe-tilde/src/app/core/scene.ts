import { DestroyRef, Directive, ElementRef, Injectable, afterNextRender, inject, input, signal } from '@angular/core';

/** Fotos del escenario fijo, con su descripción. */
export const STAGE: Record<string, string> = {
  latte: 'Barista sirviendo leche en un latte, sobre la barra de madera',
  conchas: 'Conchas de vainilla recién horneadas en la charola',
  desayuno: 'Pan con huevo pochado y jugo de naranja en una mesa junto a la ventana',
  interior: 'El salón de Tilde: banca tapizada, mesas de madera y lámparas en la pared',
  galletas: 'Galletas de avena con chispas de chocolate junto a una taza verde',
  'latte-oscuro': 'Leche vertida en un espresso, sobre fondo oscuro',
  barra: 'La barra de Tilde con la máquina de espresso y las plantas',
  amigos: 'Dos amigos riendo con un café para llevar en la mano',
  mesas: 'Mesas redondas junto a la pared blanca, con lámparas colgantes',
};

/** El momento del día del café, según la hora real: así la portada muestra lo que pasa ahorita. */
export function sceneForNow(h = new Date().getHours() + new Date().getMinutes() / 60): string {
  if (h < 9) return 'conchas';
  if (h < 11) return 'latte';
  if (h < 13.5) return 'desayuno';
  if (h < 17) return 'interior';
  return 'galletas';
}

/** Qué foto muestra el escenario fijo. La cambia la sección que está a media pantalla. */
@Injectable({ providedIn: 'root' })
export class Scene {
  readonly img = signal('latte');
}

/**
 * Uso: <section [scene]="'barra'">. Cuando la sección cruza la mitad de la pantalla,
 * el escenario fijo cambia a esa foto (con un fundido lento).
 */
@Directive({ selector: '[scene]' })
export class SceneTrigger {
  readonly scene = input.required<string>();

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const state = inject(Scene);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.isIntersecting && state.img.set(this.scene())),
        { rootMargin: '-48% 0px -48% 0px' },
      );
      io.observe(el);
      destroyRef.onDestroy(() => io.disconnect());
    });
  }
}
