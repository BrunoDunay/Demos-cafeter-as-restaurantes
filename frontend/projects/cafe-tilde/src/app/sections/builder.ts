import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { INGREDIENTS, INVENTED, Ingredient, RECIPES, Recipe } from '../core/content';
import { Order, money } from '../core/order';
import { SceneTrigger } from '../core/scene';
import { Reveal } from '../shared/reveal';

const LAYER: Record<string, { label: string; color: string; ink: string }> = {
  chocolate: { label: 'Cacao', color: '#5b3a2b', ink: '#f1e8e0' },
  espresso: { label: 'Espresso', color: '#2e211a', ink: '#f1e8e0' },
  agua: { label: 'Agua', color: '#9fb0b8', ink: '#1d2326' },
  leche: { label: 'Leche', color: '#efe8dc', ink: '#26251e' },
  espuma: { label: 'Espuma', color: '#faf7f1', ink: '#26251e' },
};

/**
 * Arma tu taza: eliges qué le pones al espresso y la receta se dibuja como una barra de proporciones
 * (como se anota en la barra), con el nombre de la bebida y su precio. Se agrega a la bolsa.
 */
@Component({
  selector: 'app-builder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, SceneTrigger],
  template: `
    <section class="builder" id="taza" scene="latte-oscuro" aria-labelledby="taza-t">
      <h2 id="taza-t" data-reveal>Arma tu taza</h2>
      <p class="intro" data-reveal [revealDelay]="70">Todo empieza con un espresso doble. Elige qué más le pones y te decimos cómo se llama.</p>

      <div class="picks" role="group" aria-label="Ingredientes" data-reveal [revealDelay]="140">
        @for (i of ingredients; track i.id) {
          <button type="button" [attr.aria-pressed]="has(i.id)" [class.on]="has(i.id)" (click)="toggle(i.id)">{{ i.label }}</button>
        }
      </div>

      <div class="result" aria-live="polite">
        <p class="drink">{{ recipe().name }}</p>
        <p class="note">{{ recipe().note }}@if (has('hielo')) { Servido con hielo, en vaso de 16 oz.}</p>
      </div>

      <div class="ratio" aria-hidden="true" data-reveal [revealDelay]="200">
        @for (l of stack(); track l.id) {
          <span [class.off]="!l.size" [style.flex-grow]="l.size" [style.background]="l.color" [style.color]="l.ink">{{ l.label }}</span>
        }
      </div>

      <div class="actions">
        <button type="button" class="cell add" (click)="add()">Agregar · {{ money(recipe().price) }}</button>
        <button type="button" class="cell reset" (click)="picked.set(['leche'])">Empezar de nuevo</button>
      </div>
    </section>
  `,
  styles: `
    .builder { padding: var(--section) var(--pad) 0; }
    h2 { font-size: var(--step-head); }
    .intro { max-width: 40ch; margin-top: 16px; }
    .picks { display: flex; flex-wrap: wrap; gap: 6px 26px; margin-top: 40px; }
    .picks button { min-height: 44px; font-size: var(--step-lead); font-weight: 300; color: var(--muted); transition: color 200ms ease, scale 160ms var(--ease-out); }
    .picks button.on { color: var(--ink); font-weight: 500; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 7px; }
    @media (hover: hover) and (pointer: fine) { .picks button:hover { color: var(--ink); } }
    .picks button:active { scale: 0.96; }
    /* La receta como barra de proporciones */
    .ratio { display: flex; height: 64px; margin-top: 32px; }
    .ratio span { flex-basis: 0; display: flex; align-items: flex-end; padding: 0 10px 8px; min-width: 0; overflow: hidden; font-size: var(--step-small); font-weight: 500; white-space: nowrap; transition: flex-grow 600ms var(--ease-out), background-color 300ms ease; }
    .ratio span.off { padding-inline: 0; }
    .result { margin-top: 32px; }
    .drink { font-size: var(--step-head); font-weight: 300; line-height: 1; letter-spacing: -0.035em; }
    .note { max-width: 38ch; margin-top: 12px; }
    .actions { display: grid; grid-template-columns: 1fr 1fr; margin-top: 36px; }
    .cell { min-height: 72px; padding: 0 20px; text-align: left; font-weight: 500; transition: background-color 200ms ease, scale 160ms var(--ease-out); }
    .add { background: var(--accent); color: var(--accent-ink); }
    .reset { background: var(--surface); }
    @media (hover: hover) and (pointer: fine) {
      .add:hover { background: #1b47b8; }
      .reset:hover { background: #c9c8c3; }
    }
    .cell:active { scale: 0.98; }
    @media (max-width: 900px) {
      .builder { padding-inline: 20px; }
      .actions { grid-template-columns: 1fr; }
      .cell { min-height: 60px; }
    }
  `,
})
export class Builder {
  private readonly order = inject(Order);
  protected readonly money = money;
  protected readonly ingredients = INGREDIENTS;
  protected readonly picked = signal<Ingredient[]>(['leche']);

  protected readonly recipe = computed<Recipe>(() => {
    const key = [...this.picked()].sort().join('+');
    return RECIPES[key] ?? INVENTED;
  });

  /** Proporción de cada capa según lo elegido (el espresso siempre va). */
  protected readonly stack = computed(() => {
    const p = this.picked();
    const both = p.includes('agua') && p.includes('leche');
    const sizes: Record<string, number> = {
      chocolate: p.includes('chocolate') ? 12 : 0,
      espresso: 20,
      agua: p.includes('agua') ? (both ? 24 : 44) : 0,
      leche: p.includes('leche') ? (both ? 24 : p.includes('espuma') ? 32 : 46) : 0,
      espuma: p.includes('espuma') ? 16 : 0,
    };
    return ['chocolate', 'espresso', 'agua', 'leche', 'espuma'].map((id) => ({ id, size: sizes[id], ...LAYER[id] }));
  });

  protected has(i: Ingredient) {
    return this.picked().includes(i);
  }

  protected toggle(i: Ingredient) {
    this.picked.update((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  }

  protected add() {
    const r = this.recipe();
    this.order.add(r.name, r.price);
  }
}
