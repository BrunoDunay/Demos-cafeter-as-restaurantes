import { ChangeDetectionStrategy, Component, afterNextRender, inject, signal } from '@angular/core';
import { Order, openStatus } from '../core/order';
import { Scene, SceneTrigger, sceneForNow } from '../core/scene';

/** Portada: una tarjeta impresa con la franja del toldo, junto a la foto fija del café. */
@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SceneTrigger],
  template: `
    <section class="card" id="inicio" [scene]="now()">
      <div class="stripe" aria-hidden="true">@for (b of bars; track $index) {<i></i>}</div>
      <div class="body">
        <p class="name" aria-label="Tilde">Tilde</p>
        <h1>Café de barrio,<br />sin prisa.</h1>
        <p class="lede">Tostamos los martes, el pan sale desde las 7:30 y los desayunos van hasta la una. En una casa de 1940 en la Purísima.</p>
        <p class="state" [class.closed]="!status().open">{{ status().open ? 'Abierto ahora.' : 'Cerrado ahora.' }} {{ status().line }}.</p>
        <button type="button" class="btn" (click)="start()">Pedir para llevar</button>
      </div>
      <nav class="links" aria-label="Secciones">
        <a href="#menu">Menú</a>
        <a href="#horno">Pan del día</a>
        <a href="#visita">Visítanos</a>
      </nav>
    </section>
  `,
  styles: `
    .card { display: flex; flex-direction: column; min-height: calc(100svh - 2 * var(--margin)); }
    .stripe { flex: none; }
    .body { flex: 1; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 48px var(--pad); }
    .name { font-size: clamp(4.5rem, 10vw, 10rem); font-weight: 500; line-height: 0.85; letter-spacing: -0.06em; margin: 0 0 48px -0.04em; }
    h1 { font-size: clamp(2.5rem, 3.6vw, 3.5rem); line-height: 1.02; }
    .lede { max-width: 36ch; margin-top: 24px; }
    .state { margin: 18px 0 32px; font-weight: 500; }
    .state::before { content: ''; display: inline-block; width: 9px; height: 9px; margin-right: 10px; border-radius: 50%; background: #2f8a4c; vertical-align: 0.1em; }
    .state.closed::before { background: var(--muted); }
    .links { display: flex; gap: 28px; padding: 0 var(--pad) 28px; font-size: var(--step-small); font-weight: 500; }
    .links a { padding-block: 8px; transition: opacity 200ms ease; }
    @media (hover: hover) and (pointer: fine) { .links a:hover { opacity: 0.6; } }
    .links a:active { opacity: 0.5; }
    @media (max-width: 900px) {
      .card { min-height: auto; margin-top: -24px; position: relative; background: var(--bg); }
      .stripe { height: 40px; }
      .body { padding: 40px 20px 32px; }
      .name { margin-bottom: 28px; font-size: 24vw; }
      h1 { font-size: 8.6vw; }
      .btn { align-self: stretch; }
      .links { padding: 0 20px 28px; flex-wrap: wrap; }
    }
  `,
})
export class Hero {
  private readonly order = inject(Order);
  private readonly scene = inject(Scene);
  protected readonly bars = Array.from({ length: 40 });
  // En el prerender no se sabe la hora del visitante; se calcula ya en el navegador.
  protected readonly status = signal({ open: true, line: 'Abrimos los siete días' });
  protected readonly now = signal('latte');

  constructor() {
    afterNextRender(() => {
      this.status.set(openStatus());
      const s = sceneForNow();
      this.now.set(s);
      this.scene.img.set(s);
    });
  }

  /** Abre la bolsa si ya hay algo; si no, lleva al menú. */
  protected start() {
    if (this.order.count() > 0) this.order.open.set(true);
    else document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  }
}
