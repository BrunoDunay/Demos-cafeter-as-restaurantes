import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MENU } from '../core/content';
import { Order, money } from '../core/order';
import { SceneTrigger } from '../core/scene';
import { Icon } from '../shared/icon';
import { Reveal } from '../shared/reveal';

/** El menú completo como lista: nombre a la izquierda, precio a la derecha y un botón para agregar. */
@Component({
  selector: 'app-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Reveal, SceneTrigger],
  template: `
    <section class="menu" id="menu" scene="barra" aria-labelledby="menu-t">
      <h2 id="menu-t" data-reveal>Menú</h2>
      <p class="intro" data-reveal [revealDelay]="70">Leche de avena sin costo. Todo se puede pedir para llevar: agrégalo y lo mandas por WhatsApp.</p>
      @for (g of menu; track g.id) {
        <div class="group" data-reveal>
          <h3>{{ g.label }}</h3>
          <ul>
            @for (it of g.items; track it.name) {
              <li>
                <span class="n">{{ it.name }}@if (it.desc) {<small>{{ it.desc }}</small>}</span>
                <span class="p">{{ money(it.price) }}</span>
                <button type="button" class="add" [class.has]="order.qty(it.name) > 0" (click)="order.add(it.name, it.price)" [attr.aria-label]="'Agregar ' + it.name">
                  @if (order.qty(it.name) > 0) {
                    <b>{{ order.qty(it.name) }}</b>
                  } @else {
                    <app-icon name="plus" [size]="16" />
                  }
                </button>
              </li>
            }
          </ul>
        </div>
      }
    </section>
  `,
  styles: `
    .menu { padding: var(--section) var(--pad); }
    h2 { font-size: var(--step-head); }
    .intro { max-width: 40ch; margin-top: 16px; }
    .group { margin-top: 56px; }
    h3 { font-size: var(--step-body); font-weight: 400; color: var(--muted); letter-spacing: 0; margin-bottom: 12px; }
    ul { list-style: none; padding: 0; display: grid; gap: 4px; }
    li { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 18px; min-height: 48px; }
    .n { font-weight: 500; }
    .n small { display: block; font-size: var(--step-small); font-weight: 400; color: var(--muted); }
    .p { font-variant-numeric: tabular-nums; }
    .add { display: grid; place-items: center; width: 40px; height: 40px; background: var(--surface); font-weight: 500; transition: background-color 200ms ease, color 200ms ease, scale 140ms var(--ease-out); }
    .add.has { background: var(--accent); color: var(--accent-ink); }
    @media (hover: hover) and (pointer: fine) { .add:not(.has):hover { background: #c9c8c3; } }
    .add:active { scale: 0.9; }
    @media (max-width: 900px) { .menu { padding-inline: 20px; } }
  `,
})
export class Menu {
  protected readonly menu = MENU;
  protected readonly order = inject(Order);
  protected readonly money = money;
}
