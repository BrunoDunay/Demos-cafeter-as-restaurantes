import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { CONTACT } from '../core/content';
import { openStatus, whatsappLink } from '../core/order';
import { SceneTrigger } from '../core/scene';
import { Reveal } from '../shared/reveal';

/** Cómo llegar: una frase, una foto chica y los datos; el horario con el día de hoy marcado. */
@Component({
  selector: 'app-visit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, SceneTrigger],
  template: `
    <section class="visit" id="visita" scene="mesas" aria-labelledby="visita-t">
      <h2 class="visually-hidden" id="visita-t">Visítanos</h2>
      <p class="say" data-reveal>Fresno 27, a media cuadra del jardín de la Purísima. Ven a quedarte, o pide por WhatsApp y pasa por él.</p>
      <div class="row" data-reveal [revealDelay]="80">
        <img src="media/barista-sm.webp" alt="Barista de Tilde sonriendo con un capuchino en la mano" width="720" height="1080" loading="lazy" />
        <div>
          <p class="q">¿Vienes hoy?</p>
          <p class="state" [class.closed]="!status().open">{{ status().open ? 'Abierto ahora.' : 'Cerrado ahora.' }} {{ status().line }}.</p>
          <p class="links">
            <a class="link" [href]="maps" target="_blank" rel="noopener">Cómo llegar</a>
            <a class="link" [href]="wa" target="_blank" rel="noopener">WhatsApp</a>
            <a class="link" [href]="'https://www.instagram.com/' + c.instagram" target="_blank" rel="noopener">Instagram</a>
          </p>
          <p class="where">{{ c.address }}, {{ c.city }}. {{ c.phone }}</p>
        </div>
      </div>
      <dl class="hours" data-reveal [revealDelay]="140">
        @for (h of c.hours; track h.days; let i = $index) {
          <div [class.today]="today() === i"><dt>{{ h.days }}{{ today() === i ? ', hoy' : '' }}</dt><dd>{{ h.time }}</dd></div>
        }
      </dl>
      <p class="how" data-reveal [revealDelay]="180">Si vienes del centro, camina por Madero hacia el jardín y da vuelta en Fresno. Hay lugar para bicis en la entrada y estacionamiento en la calle después de las siete de la noche.</p>
    </section>
  `,
  styles: `
    .visit { padding: var(--section) var(--pad); }
    .say { max-width: 26ch; font-size: clamp(1.6rem, 2.3vw, 2.25rem); font-weight: 300; line-height: 1.15; letter-spacing: -0.03em; }
    .row { display: grid; grid-template-columns: 150px 1fr; gap: 28px; align-items: start; margin-top: 56px; }
    .row img { width: 150px; aspect-ratio: 1; object-fit: cover; }
    .q { font-size: var(--step-lead); font-weight: 500; letter-spacing: -0.02em; }
    .state { margin-top: 4px; }
    .state::before { content: ''; display: inline-block; width: 9px; height: 9px; margin-right: 10px; border-radius: 50%; background: #2f8a4c; vertical-align: 0.1em; }
    .state.closed::before { background: var(--muted); }
    .links { display: flex; flex-wrap: wrap; gap: 8px 22px; margin-top: 14px; }
    .where { margin-top: 14px; font-size: var(--step-small); color: var(--muted); }
    .hours { display: grid; gap: 2px; max-width: 420px; margin-top: 56px; }
    .hours div { display: flex; justify-content: space-between; gap: 20px; min-height: 40px; align-items: center; padding-inline: 14px; }
    .hours .today { background: var(--surface); font-weight: 500; }
    dd { font-variant-numeric: tabular-nums; }
    .how { max-width: 46ch; margin-top: 32px; font-size: var(--step-small); }
    @media (max-width: 900px) {
      .visit { padding-inline: 20px; }
      .say { font-size: 1.5rem; }
      .row { grid-template-columns: 96px 1fr; gap: 18px; }
      .row img { width: 96px; }
    }
  `,
})
export class Visit {
  protected readonly c = CONTACT;
  protected readonly maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Jardín de la Purísima, Aguascalientes')}`;
  protected readonly wa = whatsappLink('¡Hola, Tilde! Quiero hacer un pedido para llevar.');
  protected readonly status = signal({ open: true, line: 'Abrimos los siete días' });
  protected readonly today = signal(-1);

  constructor() {
    afterNextRender(() => {
      this.status.set(openStatus());
      const d = new Date().getDay();
      this.today.set(CONTACT.hours.findIndex((h) => h.from.includes(d)));
    });
  }
}
