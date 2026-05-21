import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QrService, QRHistoryItem } from '../../services/qr.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.scss'
})
export class QrGeneratorComponent implements OnInit {
  inputText: string = '';
  qrCodeDataUrl: string = '';
  isGenerating: boolean = false;
  errorMessage: string = '';
  
  // Customization options
  fgColor: string = '#000000';
  bgColor: string = '#FFFFFF';
  size: number = 256;
  margin: number = 2;
  
  // Available input types
  types: ('url' | 'text' | 'wifi' | 'email' | 'phone')[] = ['text', 'url', 'wifi', 'email', 'phone'];
  
  // Input type detection
  inputType: 'url' | 'text' | 'wifi' | 'email' | 'phone' = 'text';
  
  // WiFi specific fields
  wifiSsid: string = '';
  wifiPassword: string = '';
  wifiEncryption: 'WPA' | 'WEP' | 'nopass' = 'WPA';
  wifiHidden: boolean = false;
  
  // Email specific fields
  emailTo: string = '';
  emailSubject: string = '';
  emailBody: string = '';
  
  // Phone specific fields
  phoneNumber: string = '';
  
  // History
  history: QRHistoryItem[] = [];

  constructor(private qrService: QrService) {}

  ngOnInit(): void {
    this.history = this.qrService.getHistory();
  }

  setInputType(type: 'url' | 'text' | 'wifi' | 'email' | 'phone'): void {
    this.inputType = type;
  }

  detectInputType(): void {
    this.inputType = this.qrService.detectType(this.inputText);
  }

  buildWifiString(): string {
    const type = this.wifiEncryption === 'nopass' ? '' : `T:${this.wifiEncryption};`;
    const hidden = this.wifiHidden ? 'H:true;' : '';
    return `WIFI:${type}S:${this.wifiSsid};P:${this.wifiPassword};${hidden};`;
  }

  buildEmailString(): string {
    const params = new URLSearchParams();
    if (this.emailSubject) params.append('subject', this.emailSubject);
    if (this.emailBody) params.append('body', this.emailBody);
    const queryString = params.toString();
    return `mailto:${this.emailTo}${queryString ? '?' + queryString : ''}`;
  }

  buildPhoneString(): string {
    return `tel:${this.phoneNumber}`;
  }

  getFinalText(): string {
    switch (this.inputType) {
      case 'wifi':
        return this.buildWifiString();
      case 'email':
        return this.buildEmailString();
      case 'phone':
        return this.buildPhoneString();
      default:
        return this.inputText;
    }
  }

  async generateQRCode(): Promise<void> {
    this.errorMessage = '';
    
    const text = this.getFinalText();
    if (!text.trim()) {
      this.errorMessage = 'Please enter some text to generate a QR code';
      return;
    }

    this.isGenerating = true;
    
    try {
      this.qrCodeDataUrl = await this.qrService.generateQRCode(text, {
        width: this.size,
        color: {
          dark: this.fgColor,
          light: this.bgColor
        },
        margin: this.margin
      });
      
      // Save to history
      this.qrService.saveToHistory({
        text: text,
        type: this.inputType,
        color: this.fgColor,
        bgColor: this.bgColor
      });
      
      // Refresh history
      this.history = this.qrService.getHistory();
    } catch (error) {
      this.errorMessage = 'Failed to generate QR code. Please check your input.';
      console.error(error);
    } finally {
      this.isGenerating = false;
    }
  }

  downloadQRCode(): void {
    if (!this.qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `qrcode-${Date.now()}.png`;
    link.href = this.qrCodeDataUrl;
    link.click();
  }

  copyToClipboard(): void {
    if (!this.qrCodeDataUrl) return;
    
    navigator.clipboard.writeText(this.getFinalText()).then(() => {
      // Could show a toast notification here
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }

  deleteHistoryItem(id: string): void {
    this.qrService.deleteFromHistory(id);
    this.history = this.qrService.getHistory();
  }

  loadFromHistory(item: QRHistoryItem): void {
    this.inputText = item.text;
    this.fgColor = item.color;
    this.bgColor = item.bgColor;
    this.inputType = item.type;
    this.generateQRCode();
  }

  clearAllHistory(): void {
    if (confirm('Are you sure you want to clear all history?')) {
      this.qrService.clearHistory();
      this.history = [];
    }
  }
}