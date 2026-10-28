import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Order, money, whatsappLink } from '../core/order';
import { Icon } from '../shared/icon';
import { SwipeDismiss } from '../shared/swipe-dismiss';

/**
 * La bolsa: panel lateral con el pedido para llevar. Primero se arma (cantidades, nombre, hora);
 * al enviar se ve el pedido como comanda con tu nombre y el botón para abrir WhatsApp.
 * También incluye el botón fijo que aparece cuando ya hay algo en la bolsa.
 */
@Component({
  selector: 'app-bag',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, SwipeDismiss],
  template: `
    @if (order.count() > 0 && !order.open()) {
      <button type="button" class="fab" [class.bump]="bumping()" (click)="order.open.set(true)">
        <span>Tu pedido · {{ money(order.total()) }}</span>
        <b>{{ order.count() }}</b>
      </button>
    }
    <p class="toast" [class.on]="toast()" aria-live="polite">{{ toast() ? 'Agregado: ' + order.last() : '' }}</p>

    <div class="scrim" [class.on]="order.open()" (click)="close()" aria-hidden="true"></div>
    <aside class="panel" swipeDismiss="x" (dismiss)="close()" [class.on]="order.open()" role="dialog" aria-modal="true" aria-labelledby="bag-title" tabindex="-1" #panel [attr.aria-hidden]="!order.open()" [attr.inert]="order.open() ? null : ''">
      <header>
        <h2 id="bag-title">{{ sent() ? 'Listo para mandar' : 'Tu pedido' }}</h2>
        <button type="button" class="x" (click)="close()" aria-label="Cerrar el pedido"><app-icon name="close" [size]="20" /></button>
      </header>

      @if (!sent()) {
        @if (order.lines().length) {
          <ul class="lines">
            @for (l of order.lines(); track l.name) {
              <li>
                <span class="ln">{{ l.name }}</span>
                <div class="qty" role="group" [attr.aria-label]="'Cantidad de ' + l.name">
                  <button type="button" (click)="order.change(l.name, -1)" [attr.aria-label]="'Quitar un ' + l.name"><app-icon name="minus" [size]="14" /></button>
                  <b>{{ l.qty }}</b>
                  <button type="button" (click)="order.add(l.name, l.price)" [attr.aria-label]="'Agregar otro ' + l.name"><app-icon name="plus" [size]="14" /></button>
                </div>
                <span class="lp">{{ money(l.qty * l.price) }}</span>
              </li>
            }
          </ul>
          <p class="total"><span>Total</span><b>{{ money(order.total()) }}</b></p>

          <form (submit)="submit($event)" novalidate>
            <label class="field">
              <span>¿A nombre de quién?</span>
              <input name="nombre" autocomplete="given-name" placeholder="Lo escribimos en el vaso" [value]="name()" (input)="name.set(val($event))" [attr.aria-invalid]="tried() && !nameOk()" />
              @if (tried() && !nameOk()) { <em>Escribe tu nombre para el vaso.</em> }
            </label>
            <fieldset class="field">
              <legend>¿Cuándo pasas?</legend>
              <div class="times">
                @for (t of times; track t) {
                  <button type="button" [class.on]="time() === t" [attr.aria-pressed]="time() === t" (click)="time.set(t)">{{ t }}</button>
                }
              </div>
            </fieldset>
            <label class="field">
              <span>Algo más (opcional)</span>
              <input name="notas" placeholder="Leche de avena, extra caliente…" [value]="notes()" (input)="notes.set(val($event))" />
            </label>
            <button class="btn send" type="submit">Mandar pedido</button>
            <p class="pay">Pagas al recoger, en efectivo o con tarjeta.</p>
          </form>
        } @else {
          <div class="empty">
            <p class="big">Todavía no hay nada.</p>
            <p>Arma una taza o elige algo del menú.</p>
            <a class="btn" href="#menu" (click)="close()">Ver el menú</a>
          </div>
        }
      } @else {
        <div class="ticket">
          <p class="for">{{ name().trim() }}</p>
          <ul>
            @for (l of order.lines(); track l.name) {
              <li><span>{{ l.qty }} × {{ l.name }}</span><span>{{ money(l.qty * l.price) }}</span></li>
            }
          </ul>
          <p class="when">Pasa {{ time().toLowerCase() }} · Total {{ money(order.total()) }}</p>
        </div>
        <p class="ready">Tu mensaje ya está escrito. Ábrelo en WhatsApp y mándalo; te confirmamos en unos minutos.</p>
        <a class="btn send" [href]="link()" target="_blank" rel="noopener">Abrir WhatsApp</a>
        <button type="button" class="link back" (click)="sent.set(false)">Cambiar algo</button>
      }
    </aside>
  `,
  styles: `
    .fab {
      position: fixed; right: 16px; bottom: 16px; z-index: 45; display: inline-flex; align-items: center; gap: 14px; min-height: 56px; padding: 0 8px 0 20px;
      background: var(--accent); color: var(--accent-ink); font-weight: 500;
      animation: fab-in 300ms var(--ease-out); transition: scale 160ms var(--ease-out), background-color 200ms ease;
    }
    @media (hover: hover) and (pointer: fine) { .fab:hover { background: #1b47b8; } }
    .fab:active { scale: 0.97; }
    .fab b { display: grid; place-items: center; min-width: 40px; height: 40px; background: var(--accent-ink); color: var(--accent); }
    .fab.bump { animation: bump 420ms var(--ease-out); }
    @keyframes fab-in { from { opacity: 0; translate: 0 16px; } }
    @keyframes bump { 35% { translate: 0 -6px; } }
    .toast { position: fixed; right: 16px; bottom: 84px; z-index: 45; padding: 10px 16px; background: var(--ink); color: var(--on-night); font-size: var(--step-small); opacity: 0; translate: 0 6px; pointer-events: none; transition: opacity 200ms ease, translate 200ms var(--ease-out); }
    .toast.on { opacity: 1; translate: none; }

    .scrim { position: fixed; inset: 0; z-index: 60; background: rgb(38 37 30 / 45%); opacity: 0; visibility: hidden; pointer-events: none; transition: opacity 220ms ease, visibility 0s 220ms; }
    .scrim.on { opacity: 1; visibility: visible; pointer-events: auto; transition: opacity 320ms ease; }
    .panel {
      position: fixed; top: 0; right: 0; bottom: 0; z-index: 61; width: min(460px, 100%); padding: 24px 28px 32px; overflow-y: auto; background: var(--bg);
      transform: translateX(100%); visibility: hidden; transition: transform 280ms var(--ease-drawer), visibility 0s 280ms; outline: none; display: flex; flex-direction: column;
    }
    .panel.on { transform: none; visibility: visible; transition: transform 420ms var(--ease-drawer); }
    header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; }
    h2 { font-size: var(--step-head); }
    .x { display: grid; place-items: center; width: 44px; height: 44px; background: var(--surface); transition: scale 140ms var(--ease-out); }
    .x:active { scale: 0.92; }
    .lines { list-style: none; padding: 0; display: grid; gap: 8px; }
    .lines li { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: 14px; }
    .ln { font-weight: 500; }
    .qty { display: flex; align-items: center; background: var(--surface); }
    .qty button { display: grid; place-items: center; width: 36px; height: 36px; transition: background-color 200ms ease, scale 140ms var(--ease-out); }
    @media (hover: hover) and (pointer: fine) { .qty button:hover { background: #c9c8c3; } }
    .qty button:active { scale: 0.9; }
    .qty b { min-width: 22px; text-align: center; font-weight: 500; }
    .lp { min-width: 56px; text-align: right; font-variant-numeric: tabular-nums; }
    .total { display: flex; justify-content: space-between; align-items: baseline; margin-top: 28px; font-weight: 500; }
    .total b { font-size: var(--step-lead); font-weight: 500; }
    form { margin-top: 24px; }
    .field { display: flex; flex-direction: column; gap: 8px; margin: 0 0 18px; padding: 0; border: 0; }
    .field > span, legend { font-weight: 500; font-size: var(--step-small); padding: 0; }
    input { min-height: 52px; padding: 0 14px; border: 0; border-radius: 0; background: var(--surface); font-size: 1rem; outline: 2px solid transparent; transition: outline-color 200ms ease; }
    input:focus { outline-color: var(--accent); }
    input[aria-invalid='true'] { outline-color: #b3261e; }
    em { font-style: normal; font-weight: 500; font-size: var(--step-small); color: #b3261e; }
    .times { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .times button { min-height: 42px; padding: 0 14px; background: var(--surface); font-size: var(--step-small); font-weight: 500; transition: background-color 200ms ease, color 200ms ease, scale 140ms var(--ease-out); }
    .times button:active { scale: 0.96; }
    .times button.on { background: var(--ink); color: var(--on-night); }
    .send { width: 100%; margin-top: 6px; }
    .pay { margin-top: 10px; text-align: center; font-size: var(--step-small); color: var(--muted); }
    .empty { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; margin: auto 0; padding: 40px 0; }
    .big { font-size: var(--step-head); font-weight: 300; letter-spacing: -0.035em; line-height: 1; }
    .empty .btn { margin-top: 14px; }

    /* La comanda: el pedido escrito, como lo verá la barra */
    .ticket { margin-top: 8px; padding: 28px 24px; background: var(--surface); animation: drop 450ms var(--ease-out); }
    @keyframes drop { from { opacity: 0; translate: 0 -12px; } }
    .for { font-size: var(--step-head); font-weight: 300; letter-spacing: -0.035em; line-height: 1; }
    .ticket ul { list-style: none; padding: 0; margin-top: 18px; display: grid; gap: 6px; }
    .ticket li { display: flex; justify-content: space-between; gap: 16px; }
    .when { margin-top: 18px; font-weight: 500; }
    .ready { margin: 22px 0 16px; }
    .back { margin-top: 14px; align-self: center; }
  `,
})
export class Bag {
  protected readonly order = inject(Order);
  protected readonly money = money;
  protected readonly times = ['En 15 min', 'En 30 min', 'En 1 hora', 'Más tarde'];
  protected readonly name = signal('');
  protected readonly time = signal('En 30 min');
  protected readonly notes = signal('');
  protected readonly tried = signal(false);
  protected readonly sent = signal(false);
  protected readonly toast = signal(false);
  protected readonly bumping = signal(false);
  protected readonly nameOk = computed(() => this.name().trim().length >= 2);
  private readonly panel = viewChild.required<ElementRef<HTMLElement>>('panel');
  private lastFocus: HTMLElement | null = null;

  protected readonly message = computed(() => {
    const lines = this.order.lines().map((l) => `• ${l.qty} × ${l.name}`);
    const notes = this.notes().trim() ? `\nNotas: ${this.notes().trim()}` : '';
    return `¡Hola, Tilde! Soy ${this.name().trim()} y quiero pedir para llevar:\n${lines.join('\n')}\nTotal: ${money(this.order.total())}\nPaso ${this.time().toLowerCase()}.${notes}`;
  });
  protected readonly link = computed(() => whatsappLink(this.message()));

  constructor() {
    const destroyRef = inject(DestroyRef);
    let toastTimer: ReturnType<typeof setTimeout> | undefined;
    let bumpTimer: ReturnType<typeof setTimeout> | undefined;
    // Aviso breve y salto del botón cada vez que se agrega algo.
    effect(() => {
      if (!this.order.bump()) return;
      this.toast.set(true);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => this.toast.set(false), 1600);
      this.bumping.set(false);
      requestAnimationFrame(() => this.bumping.set(true));
      clearTimeout(bumpTimer);
      bumpTimer = setTimeout(() => this.bumping.set(false), 450);
    });
    // Al abrir: bloquea el scroll de fondo y lleva el foco al panel; al cerrar lo regresa.
    effect(() => {
      const open = this.order.open();
      if (typeof document === 'undefined') return;
      document.body.classList.toggle('no-scroll', open);
      if (open) {
        this.lastFocus = document.activeElement as HTMLElement;
        requestAnimationFrame(() => this.panel().nativeElement.focus());
      } else {
        this.lastFocus?.focus?.();
        this.lastFocus = null;
      }
    });
    afterNextRender(() => {
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && this.order.open() && this.close();
      window.addEventListener('keydown', onKey);
      destroyRef.onDestroy(() => window.removeEventListener('keydown', onKey));
    });
  }

  protected close() {
    this.order.open.set(false);
  }

  protected val(e: Event) {
    return (e.target as HTMLInputElement).value;
  }

  protected submit(e: Event) {
    e.preventDefault();
    this.tried.set(true);
    if (this.nameOk() && this.order.lines().length) this.sent.set(true);
  }
}
