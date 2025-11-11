import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { WINDOW } from '../../utils/window';

export const NgxTelegramWidgetCallback = 'NgxTelegramWidgetCallback';

@Component({
  selector: 'ngx-telegram-widget',
  standalone: true,
  template: ` <span ngSkipHydration #button></span> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxTelegramWidgetComponent implements AfterViewInit {
  @Input({ required: true }) botName = 'SampleBot';

  @Input() buttonSize: string = 'large';
  @Input() showUserPhoto: boolean = false;
  @Input() useCustomCorners: boolean = false;
  @Input() cornerRadius: number = 20;
  @Input() requestMessageAccess: boolean = false;
  @Input() redirectURL: string = '';
  onAuth = output<unknown>();

  @ViewChild('button', { static: true })
  button!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    const s = this.renderer.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://telegram.org/js/telegram-widget.js?122';
    s.setAttribute('data-telegram-login', this.botName);
    if (this.buttonSize) {
      s.setAttribute('data-size', this.buttonSize);
    }

    if (this.showUserPhoto) {
      s.setAttribute('data-userpic', this.showUserPhoto);
    }

    if (this.redirectURL) {
      s.setAttribute('data-auth-url', this.redirectURL);
    }

    s.setAttribute(
      'data-request-access',
      this.requestMessageAccess ? 'write' : null
    );

    s.setAttribute(
      'data-radius',
      this.useCustomCorners ? this.cornerRadius : 20
    );

    if (this.onAuth !== undefined) {
      if (WINDOW) {
        WINDOW[NgxTelegramWidgetCallback] = (params: unknown) =>
          this.onAuth && this.onAuth.emit(params);

        s.setAttribute('data-onauth', 'NgxTelegramWidgetCallback(user)');
      }
    }

    this.button.nativeElement.parentElement.replaceChild(
      s,
      this.button.nativeElement
    );

    this.changeDetectorRef.markForCheck();
  }
}
