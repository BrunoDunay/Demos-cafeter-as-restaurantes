import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CONTACT } from '../core/content';
import { MotionToggle } from '../shared/motion-toggle';

/** Pie: media pantalla de foto muy de cerca y el menú del sitio en grande; arriba, la franja del toldo. */
@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MotionToggle],
  template: `
    <div class="stripe thin" aria-hidden="true">@for (b of bars; track $index) {<i></i>}</div>
    <footer class="foot">
      <img src="media/conchas.webp" srcset="media/conchas-sm.webp 720w, media/conchas.webp 1200w" sizes="(max-width: 900px) 100vw, 50vw" alt="Conchas de vainilla recién horneadas, muy de cerca" width="1200" height="1680" loading="lazy" />
      <div class="side">
        <p class="name">Tilde</p>
        <nav aria-label="Pie de página">
          <a href="#taza">Arma tu taza</a>
          <a href="#menu">Menú</a>
          <a href="#horno">Pan del día</a>
          <a href="#lugar">El lugar</a>
          <a href="#visita">Visítanos</a>
        </nav>
        <div class="blocks">
          <p>{{ c.address }}<br />{{ c.city }}<br />{{ c.phone }}</p>
          <p><a class="link" [href]="'https://www.instagram.com/' + c.instagram" target="_blank" rel="noopener">Instagram</a><br /><app-motion-toggle /></p>
        </div>
        <p class="legal">Sitio demo con marca ficticia. Fotos de Pexels. Diseño y desarrollo: <a class="link" href="https://portafolio-web-chi-ten.vercel.app" target="_blank" rel="noopener">Bruno Dunay</a></p>
      </div>
    </footer>
  `,
  styles: `
    .thin { height: 8px; }
    .foot { display: grid; grid-template-columns: 1fr 1fr; min-height: 100svh; background: var(--bg); }
    img { width: 100%; height: 100%; object-fit: cover; object-position: center 70%; }
    .side { display: flex; flex-direction: column; padding: 80px var(--pad) 28px; }
    .name { font-size: var(--step-lead); font-weight: 500; letter-spacing: -0.03em; margin-bottom: 40px; }
    nav { display: grid; gap: 14px; }
    nav a { width: fit-content; font-size: clamp(1.75rem, 2.6vw, 2.6rem); font-weight: 500; letter-spacing: -0.03em; line-height: 1.1; transition: translate 300ms var(--ease-out), color 200ms ease; }
    @media (hover: hover) and (pointer: fine) {
      nav:hover a { color: var(--muted); }
      nav a:hover { color: var(--ink); translate: 12px 0; }
    }
    nav a:active { opacity: 0.6; }
    .blocks { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 64px; font-size: var(--step-small); }
    .legal { margin-top: auto; padding-top: 48px; font-size: var(--step-small); color: var(--muted); }
    @media (max-width: 900px) {
      .foot { grid-template-columns: 1fr; min-height: auto; }
      img { height: 50svh; }
      .side { padding: 40px 20px 28px; }
      nav a { font-size: 8vw; }
      .blocks { grid-template-columns: 1fr; }
    }
  `,
})
export class Footer {
  protected readonly c = CONTACT;
  protected readonly bars = Array.from({ length: 80 });
}
