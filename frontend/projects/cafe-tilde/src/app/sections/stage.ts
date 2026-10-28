import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { STAGE, Scene } from '../core/scene';

/**
 * La mitad fija de la pantalla: una foto que no se mueve mientras se lee la otra mitad
 * y que cambia, con un fundido lento, según el momento del día de la sección que se está leyendo.
 */
@Component({
  selector: 'app-stage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="frame">
      @for (k of keys; track k) {
        <img
          [src]="'media/' + k + '.webp'"
          [attr.srcset]="'media/' + k + '-sm.webp 720w, media/' + k + '.webp 1400w'"
          sizes="(max-width: 900px) 100vw, 45vw"
          [alt]="stage[k]"
          [attr.aria-hidden]="scene.img() === k ? null : 'true'"
          width="1200"
          height="1800"
          [class.on]="scene.img() === k"
          [attr.loading]="k === first() ? 'eager' : 'lazy'"
        />
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .frame { position: sticky; top: var(--margin); height: calc(100svh - 2 * var(--margin)); overflow: hidden; background: var(--surface); }
    img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      opacity: 0; scale: 1.04; transition: opacity 1600ms ease, scale 6s ease-out;
    }
    img.on { opacity: 1; scale: 1; }
    @media (max-width: 900px) {
      .frame { position: relative; top: 0; height: 52svh; }
    }
  `,
})
export class Stage {
  protected readonly scene = inject(Scene);
  protected readonly stage = STAGE;
  /** Fotos que este escenario puede mostrar, en orden */
  readonly only = input<string[]>(Object.keys(STAGE));
  protected get keys() {
    return this.only();
  }
  protected first() {
    return this.only()[0];
  }
}
