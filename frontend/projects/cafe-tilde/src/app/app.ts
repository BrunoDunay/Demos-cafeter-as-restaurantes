import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Bag } from './sections/bag';
import { Footer } from './sections/footer';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Bag, Footer],
  template: `
    <a class="skip" href="#contenido">Saltar al contenido</a>
    <main id="contenido"><router-outlet /></main>
    <app-footer />
    <app-bag />
  `,
  styles: `
    .skip { position: fixed; left: 16px; top: -80px; z-index: 100; padding: 12px 18px; background: var(--ink); color: var(--on-night); font-weight: 500; transition: top 200ms ease; }
    .skip:focus { top: 16px; }
  `,
})
export class App {}
