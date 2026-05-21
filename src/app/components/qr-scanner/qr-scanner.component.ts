import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrService, QRHistoryItem } from '../../services/qr.service';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.scss'
})
export class QrScannerComponent implements OnInit, OnDestroy {
  @ViewChild('reader') readerContainerRef!: ElementRef;
  
  html5QrCode: Html5Qrcode | null = null;
  isScanning: boolean = false;
  hasPermission: boolean = false;
  scannedResult: string = '';
  errorMessage: string = '';
  cameraId: string = '';
  cameras: { id: string; label: string }[] = [];
  selectedCamera: string = '';

  constructor(private qrService: QrService) {}

  ngOnInit(): void {
    this.checkCameraPermission();
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

  async checkCameraPermission(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      this.hasPermission = true;
      this.getCameras();
    } catch (error) {
      this.hasPermission = false;
      this.errorMessage = 'Camera permission denied. Please allow camera access to scan QR codes.';
    }
  }

  async getCameras(): Promise<void> {
    try {
      const cameras = await Html5Qrcode.getCameras();
      this.cameras = cameras.map(cam => ({
        id: cam.id,
        label: cam.label || `Camera ${cameras.indexOf(cam) + 1}`
      }));
      
      // Select rear camera by default on mobile
      const rearCamera = this.cameras.find(cam => 
        cam.label.toLowerCase().includes('back') || 
        cam.label.toLowerCase().includes('rear') ||
        cam.label.toLowerCase().includes('environment')
      );
      
      if (rearCamera) {
        this.selectedCamera = rearCamera.id;
      } else if (this.cameras.length > 0) {
        this.selectedCamera = this.cameras[0].id;
      }
    } catch (error) {
      console.error('Error getting cameras:', error);
    }
  }

  async startScanning(): Promise<void> {
    if (!this.selectedCamera) {
      this.errorMessage = 'No camera selected';
      return;
    }

    this.errorMessage = '';
    this.scannedResult = '';

    try {
      this.html5QrCode = new Html5Qrcode('reader');
      
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await this.html5QrCode.start(
        this.selectedCamera,
        config,
        this.onScanSuccess.bind(this),
        this.onScanFailure.bind(this)
      );

      this.isScanning = true;
    } catch (error) {
      console.error('Error starting scanner:', error);
      this.errorMessage = 'Failed to start camera. Please try again.';
    }
  }

  onScanSuccess(decodedText: string, decodedResult: any): void {
    this.scannedResult = decodedText;
    this.stopScanning();

    // Save to history
    this.qrService.saveToHistory({
      text: decodedText,
      type: this.qrService.detectType(decodedText),
      color: '#000000',
      bgColor: '#FFFFFF'
    });

    // Open URL if it's a URL
    if (this.qrService.detectType(decodedText) === 'url') {
      if (confirm(`Open this link?\n\n${decodedText}`)) {
        window.open(decodedText, '_blank');
      }
    }
  }

  onScanFailure(error: any): void {
    // Scan failures are normal when no QR code is detected
    // Only log if it's a real error
    if (error !== 'QR code parse error' && error !== 'No code found') {
      console.warn('Scan failure:', error);
    }
  }

  stopScanning(): void {
    if (this.html5QrCode && this.isScanning) {
      this.html5QrCode.stop().then(() => {
        this.isScanning = false;
        this.html5QrCode = null;
      }).catch((error) => {
        console.error('Failed to stop scanning:', error);
        this.isScanning = false;
      });
    } else {
      this.isScanning = false;
    }
  }

  copyToClipboard(): void {
    if (!this.scannedResult) return;
    
    navigator.clipboard.writeText(this.scannedResult).then(() => {
      // Could show a toast notification
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  scanAgain(): void {
    this.scannedResult = '';
    this.startScanning();
  }

  getResultType(): string {
    if (!this.scannedResult) return 'Unknown';
    const type = this.qrService.detectType(this.scannedResult);
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  isUrl(): boolean {
    return this.qrService.detectType(this.scannedResult) === 'url';
  }

  openLink(): void {
    if (this.scannedResult) {
      window.open(this.scannedResult, '_blank');
    }
  }
}