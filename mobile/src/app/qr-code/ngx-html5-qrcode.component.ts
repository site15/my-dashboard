import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { CameraDevice, Html5Qrcode } from 'html5-qrcode';
import { Html5QrcodeResult } from 'html5-qrcode/esm/core';
import { Html5QrcodeCameraScanConfig } from 'html5-qrcode/esm/html5-qrcode';

@Component({
  selector: 'html5-qrcode',
  template: ` <div #reader id="reader" width="600px"></div> `,
  styles: [],
})
export class NgxHtml5QrcodeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('reader') reader: ElementRef | undefined;
  html5QrCode!: Html5Qrcode;
  cameraId: string = '';
  cameraIndex = 0;
  cameras: CameraDevice[] = [];

  @Input() useFrontCamera: boolean = false;
  @Input() config: Html5QrcodeCameraScanConfig = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
  };
  @Output() decodedText: EventEmitter<string> = new EventEmitter<string>();
  @Output() decodedResult: EventEmitter<Html5QrcodeResult> =
    new EventEmitter<Html5QrcodeResult>();

  ngAfterViewInit() {
    // This method will trigger user permissions
    Html5Qrcode.getCameras()
      .then((devices) => {
        this.cameras = devices || [];
        this.switchCamera(0);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  switchCamera(cameraIndex?: number) {
    if (this.cameras && this.cameras.length) {
      if (cameraIndex === undefined) {
        this.cameraIndex = this.cameraIndex + 1;
        if (this.cameraIndex > this.cameras.length - 1) {
          this.cameraIndex = 0;
        }
      } else {
        this.cameraIndex = cameraIndex;
      }
      this.cameraId = this.cameras[this.cameraIndex].id;
      this.stopHtmlQrCode();
      this.startHtmlQrCode();
    }
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

  private startHtmlQrCode() {
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
    this.stopHtmlQrCode();
  }

  stopHtmlQrCode() {
    this.html5QrCode
      ?.stop()
      .then((ignore) => {
        // QR Code scanning is stopped.
      })
      .catch((err) => {});
  }
}
