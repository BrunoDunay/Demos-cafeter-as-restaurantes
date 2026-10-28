import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SceneTrigger } from '../core/scene';
import { Reveal } from '../shared/reveal';

const SHOTS = [
  { img: 'tostador', caption: 'El tostador del patio, los martes desde las seis', w: 1200, h: 1778 },
  { img: 'barista', caption: 'La barra, antes de abrir', w: 1000, h: 1500 },
  { img: 'costal', caption: 'El costal de Chiapas de esta semana', w: 1000, h: 1500 },
  { img: 'conchas-torre', caption: 'Las conchas de vainilla, en la vitrina', w: 1000, h: 1500 },
  { img: 'mesa-brunch', caption: 'La mesa de la ventana, a la hora del desayuno', w: 1200, h: 1500 },
];

/** El lugar: un solo marco cuyo contenido cambia solo, con un fundido lento (CSS). */
@Component({
  selector: 'app-place',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, SceneTrigger],
  template: `
    <section class="place" id="lugar" scene="interior" aria-labelledby="lugar-t">
      <h2 id="lugar-t" data-reveal>La casa de Fresno 27</h2>
      <p class="intro" data-reveal [revealDelay]="70">Una casa de 1940 con piso de pasta y techo alto. Tostamos atrás, en el patio, y el olor llega hasta el jardín. Hay enchufes en la banca, wifi que sí sirve y agua para los perros.</p>
      <figure class="frame" data-reveal [revealDelay]="140">
        <div class="pics">
          @for (s of shots; track s.img; let i = $index) {
            <img [src]="'media/' + s.img + '-sm.webp'" [alt]="s.caption" [attr.width]="s.w" [attr.height]="s.h" loading="lazy" [style.--i]="i" />
          }
        </div>
        <figcaption>
          @for (s of shots; track s.img; let i = $index) {
            <span [style.--i]="i">{{ s.caption }}</span>
          }
        </figcaption>
      </figure>
    </section>
  `,
  styles: `
    .place { padding: var(--section) var(--pad) 0; }
    h2 { font-size: var(--step-head); }
    .intro { max-width: 44ch; margin-top: 16px; }
    .frame { width: min(360px, 100%); margin-top: 56px; }
    .pics { position: relative; aspect-ratio: 4 / 5; overflow: hidden; background: var(--surface); }
    .pics img, figcaption span { animation: cycle 15s linear infinite both; animation-delay: calc(var(--i) * 3s); }
    .pics img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; }
    figcaption { position: relative; height: 3em; margin-top: 14px; font-size: var(--step-small); }
    figcaption span { position: absolute; inset: 0; opacity: 0; }
    /* Cada foto: entra en 0.6 s, se queda 2.4 s y se va */
    @keyframes cycle {
      0% { opacity: 0; }
      4% { opacity: 1; }
      20% { opacity: 1; }
      24% { opacity: 0; }
      100% { opacity: 0; }
    }
    :host-context(.reduce-motion) .pics img:first-child,
    :host-context(.reduce-motion) figcaption span:first-child { animation: none; opacity: 1; }
    @media (max-width: 900px) {
      .place { padding-inline: 20px; }
      .frame { width: 72vw; margin-inline: auto; }
    }
  `,
})
export class Place {
  protected readonly shots = SHOTS;
}
