import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Builder } from './sections/builder';
import { Hero } from './sections/hero';
import { Menu } from './sections/menu';
import { Oven } from './sections/oven';
import { Place } from './sections/place';
import { Reviews } from './sections/reviews';
import { Stage } from './sections/stage';
import { Visit } from './sections/visit';

/**
 * Media pantalla de foto fija y media de lectura. El pan del día rompe la división a todo lo ancho
 * y luego vuelve la media pantalla para el lugar, las reseñas y cómo llegar.
 */
@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Builder, Menu, Oven, Place, Reviews, Visit, Stage],
  template: `
    <div class="split">
      <app-stage class="stage" [only]="['latte', 'conchas', 'desayuno', 'interior', 'galletas', 'latte-oscuro', 'barra']" />
      <div class="col">
        <app-hero />
        <app-builder />
        <app-menu />
      </div>
    </div>
    <app-oven />
    <div class="split">
      <app-stage class="stage" [only]="['interior', 'amigos', 'mesas']" />
      <div class="col">
        <app-place />
        <app-reviews />
        <app-visit />
      </div>
    </div>
  `,
  styles: `
    .split { display: grid; grid-template-columns: 55fr 45fr; gap: var(--margin); padding: var(--margin); }
    .col { grid-column: 1; grid-row: 1; min-width: 0; }
    .stage { grid-column: 2; grid-row: 1; }
    @media (max-width: 900px) {
      .split { grid-template-columns: 1fr; padding: 0; gap: 0; }
      .col, .stage { grid-column: 1; grid-row: auto; }
      .stage { padding: var(--margin) var(--margin) 0; }
    }
  `,
})
export default class Home {}
