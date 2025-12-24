import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  Output,
  Input,
  EventEmitter,
} from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeCameraScanConfig } from 'html5-qrcode/esm/html5-qrcode';
import { Html5QrcodeResult } from 'html5-qrcode/esm/core';

@Component({
  selector: 'html5-qrcode',
  template: ` <div #reader id="reader" width="600px"></div> `,
  styles: [],
})
export class NgxHtml5QrcodeComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('reader') reader: ElementRef | undefined;
  html5QrCode!: Html5Qrcode;
  cameraId: string = '';

  @Input() useFrontCamera: boolean = false;
  @Input() config: Html5QrcodeCameraScanConfig = {
    fps: 10,
    qrbox: { width: 200, height: 200 },
  };
  @Output() decodedText: EventEmitter<string> = new EventEmitter<string>();
  @Output() decodedResult: EventEmitter<Html5QrcodeResult> =
    new EventEmitter<Html5QrcodeResult>();

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          // .. use this to start scanning.
          this.cameraId = this.useFrontCamera ? devices[1].id : devices[0].id;
          this.startHtmlQrCode();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  qrCodeSuccessCallback(decodedText: any, decodedResult: Html5QrcodeResult) {
    /* handle success */
    this.decodedText.emit(decodedText);
    this.decodedResult.emit(decodedResult);
  }

  qrCodeErrorCallback(errorMessage: any) {
    /* handle success */
   // console.error(errorMessage);
  }

  startHtmlQrCode() {
    this.html5QrCode = new Html5Qrcode(this.reader?.nativeElement?.id);

    this.html5QrCode
      .start(
        { deviceId: { exact: this.cameraId } },
        this.config,
        this.qrCodeSuccessCallback.bind(this),
        this.qrCodeErrorCallback.bind(this)
      )
      .catch((err) => {
        // Start failed, handle it.
        console.log(err);
      });
  }

  ngOnDestroy() {
    this.html5QrCode
      .stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
      })
      .catch((err) => {
        // Stop failed, handle it.
      });
  }
}
