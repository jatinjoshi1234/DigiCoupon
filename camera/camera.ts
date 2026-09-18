import { Component, ElementRef, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CustomerQuotationsApiService } from '../../features/customer-panel/customer-quotations-api.service';

@Component({
  selector: 'app-camera',
  imports: [TranslatePipe],
  templateUrl: './camera.html',
  styleUrl: './camera.scss',
})
export class Camera {
  stream: MediaStream | null = null;
  currentFacingMode: 'environment' | 'user' = 'environment';
  @Output() onCapture = new EventEmitter<any>();
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvas!: ElementRef<HTMLCanvasElement>;
  service = inject(CustomerQuotationsApiService);
  capturedImage: string | null = null;
  hasCamera = false;
  videoDevices: MediaDeviceInfo[] = [];
  currentDeviceIndex = 0;

  async ngOnInit() {
    await this.checkCameraDevices();
    // if (this.hasCamera) {
    //   this.openCamera();
    // }
  }

  async checkCameraDevices() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      this.videoDevices = devices.filter((d) => d.kind === 'videoinput');

      this.hasCamera = this.videoDevices.length > 0;
    } catch (err) {
      console.error('Device check failed', err);
      this.hasCamera = false;
    }
  }

  async openCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: {
            ideal: this.currentFacingMode,
          },
        },
        audio: false,
      });

      this.video.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error(err);
      this.handleCameraError(err);
    }
  }

  handleCameraError(err: any) {
    let message = 'Camera not available';

    if (err.name === 'NotAllowedError') {
      message = 'Camera permission denied. Please allow camera access.';
    }

    if (err.name === 'NotFoundError') {
      message = 'No camera device found on this device.';
    }

    if (err.name === 'NotReadableError') {
      message = 'Camera is already in use by another application.';
    }
    alert(message);
  }
  async switchCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';

    await this.openCamera();
  }

  capture() {
    const video = this.video.nativeElement;
    const canvas = this.canvas.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);

    this.capturedImage = canvas.toDataURL('image/png');
    // Stop camera
    this.stream?.getTracks().forEach((track) => track.stop());
    //this.stream = null;
    let savedFile;
    video.srcObject = null;
    canvas.toBlob((blob) => {
      if (!blob) return;

      const uploadedFile = new File([blob], 'capture.png', {
        type: 'image/png',
      });

      this.service.uploadTempDocuments([uploadedFile]).subscribe({
        next: (res) => {
          if (res && res.tempFilenames && Array.isArray(res.tempFilenames)) {
            // Add temp filenames to state so they can be saved later
            savedFile = res.tempFilenames[0];
            // Clear uploading states
          }
        },
        error: (err) => {
          const message = err?.error?.message || err?.message || 'unknow error';
          alert(`Failed to upload images ${message}`);
          // Remove failed uploads from preview
        },
      });
      this.onCapture.emit({ url: this.capturedImage, file: uploadedFile });
    }, 'image/png');
  }

  upload() {
    if (!this.capturedImage) return;

    const blob = this.dataURLtoBlob(this.capturedImage);

    const formData = new FormData();
    formData.append('file', blob, 'photo.png');
  }

  dataURLtoBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  }
}
