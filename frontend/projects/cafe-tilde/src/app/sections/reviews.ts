import { ChangeDetectionStrategy, Component } from '@angular/core';
import { REVIEWS } from '../core/content';
import { SceneTrigger } from '../core/scene';
import { Reveal } from '../shared/reveal';

/** Lo que dicen los de siempre: citas grandes y ligeras, con lo que piden. */
@Component({
  selector: 'app-reviews',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Reveal, SceneTrigger],
  template: `
    <section class="reviews" id="resenas" scene="amigos" aria-labelledby="resenas-t">
      <h2 id="resenas-t" data-reveal>Los de siempre</h2>
      @for (r of reviews; track r.name; let i = $index) {
        <figure [class.in]="i % 2 === 1" data-reveal>
          <blockquote>{{ r.text }}</blockquote>
          <figcaption>{{ r.name }}, {{ r.order.toLowerCase() }}</figcaption>
        </figure>
      }
    </section>
  `,
  styles: `
    .reviews { padding: var(--section) var(--pad) 0; }
    h2 { font-size: var(--step-head); margin-bottom: 56px; }
    figure + figure { margin-top: 48px; }
    figure.in { padding-left: 14%; }
    blockquote { max-width: 30ch; font-size: var(--step-lead); font-weight: 300; line-height: 1.25; letter-spacing: -0.02em; }
    figcaption { margin-top: 10px; font-size: var(--step-small); color: var(--muted); }
    @media (max-width: 900px) {
      .reviews { padding-inline: 20px; }
      figure.in { padding-left: 10%; }
    }
  `,
})
export class Reviews {
  protected readonly reviews = REVIEWS;
}
