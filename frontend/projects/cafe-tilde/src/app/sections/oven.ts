import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import { OVEN } from '../core/content';
import { Order, money, nowHours } from '../core/order';
import { Reveal } from '../shared/reveal';

const clock = (h: number) => `${Math.floor(h)}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

/**
 * Lo único que rompe la media pantalla: el pan del día a todo lo ancho, comparado con la hora real
 * de quien visita ("Son las 10:06. El rol de canela sale en 54 minutos").
 */
@Component({
  selector: 'app-oven',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal],
  template: `
    <section class="oven" id="horno" aria-labelledby="horno-t">
      <h2 id="horno-t" class="now" data-reveal aria-live="polite">{{ sentence() }}</h2>
      <ol class="bakes">
        @for (o of oven; track o.name; let i = $index) {
          <li [class]="state(i)" data-reveal [revealDelay]="i * 70">
            <p class="t">{{ o.label }}</p>
            <img [src]="'media/' + o.img + '-sm.webp'" [alt]="o.name" width="720" height="720" loading="lazy" />
            <h3>{{ o.name }}</h3>
            <p class="d">{{ o.detail }}</p>
            <p class="s">{{ badge(i) }}</p>
            <button type="button" class="link grab" (click)="order.add(o.name, o.price)">Apartar uno, {{ money(o.price) }}</button>
          </li>
        }
      </ol>
    </section>
  `,
  styles: `
    .oven { padding: var(--section) var(--pad); background: var(--night); color: var(--on-night); }
    .now { max-width: 34ch; font-size: clamp(2rem, 3.4vw, 3.4rem); font-weight: 300; line-height: 1.05; letter-spacing: -0.035em; }
    .bakes { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(5, 1fr); gap: 28px; margin-top: 88px; }
    li { display: flex; flex-direction: column; }
    .t { font-size: var(--step-lead); font-weight: 500; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
    img { width: 100%; aspect-ratio: 1; object-fit: cover; margin-top: 14px; transition: filter 400ms ease; }
    .later img { filter: grayscale(1) brightness(0.8); }
    h3 { margin-top: 16px; font-size: var(--step-lead); font-weight: 400; letter-spacing: -0.02em; }
    .d { margin-top: 6px; font-size: var(--step-small); color: var(--on-night-muted); }
    .s { margin-top: 12px; font-size: var(--step-small); font-weight: 500; }
    .next .s { color: #8fb0ff; }
    .grab { align-self: flex-start; margin-top: 10px; font-size: var(--step-small); }
    @media (max-width: 980px) {
      .oven { padding-inline: 20px; }
      .now { font-size: 7vw; }
      .bakes { grid-template-columns: 1fr 1fr; gap: 40px 16px; margin-top: 56px; }
    }
  `,
})
export class Oven {
  protected readonly oven = OVEN;
  protected readonly order = inject(Order);
  protected readonly money = money;
  /** Hora del visitante en horas decimales. Antes de que cargue el navegador, se asume media mañana. */
  protected readonly now = signal(10.5);
  private readonly ready = signal(false);

  protected readonly nextIndex = computed(() => {
    const i = OVEN.findIndex((o) => o.at > this.now());
    return i === -1 ? OVEN.length : i;
  });

  protected readonly sentence = computed(() => {
    if (!this.ready()) return 'Desde las 7:30 sale algo del horno cada par de horas.';
    const h = this.now();
    const next = OVEN[this.nextIndex()];
    if (h < OVEN[0].at) return `Son las ${clock(h)}. Las conchas salen a las 7:30; el café ya está listo antes.`;
    if (!next) return `Son las ${clock(h)}. Ya salió todo lo de hoy; lo que quede va con descuento después de las 19:00.`;
    const mins = Math.round((next.at - h) * 60);
    const wait = mins >= 60 ? `a las ${next.label}` : `en ${mins} minutos`;
    return `Son las ${clock(h)}. ${next.name === 'Galletas de avena' ? 'Las galletas salen' : `El ${next.name.toLowerCase()} sale`} ${wait}.`;
  });

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.now.set(nowHours());
      this.ready.set(true);
      const t = setInterval(() => this.now.set(nowHours()), 60_000);
      destroyRef.onDestroy(() => clearInterval(t));
    });
  }

  protected state(i: number) {
    const n = this.nextIndex();
    return i < n ? 'out' : i === n ? 'next' : 'later';
  }

  protected badge(i: number) {
    const s = this.state(i);
    if (!this.ready()) return `Sale a las ${OVEN[i].label}`;
    if (s === 'out') return i === this.nextIndex() - 1 ? 'Recién salido' : 'Ya salió';
    if (s === 'next') return 'Es lo que sigue';
    return `Sale a las ${OVEN[i].label}`;
  }
}
