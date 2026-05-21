import { Injectable } from '@angular/core';
import QRCode from 'qrcode';

export interface QRHistoryItem {
  id: string;
  text: string;
  type: 'url' | 'text' | 'wifi' | 'email' | 'phone';
  timestamp: number;
  color: string;
  bgColor: string;
}

@Injectable({
  providedIn: 'root'
})
export class QrService {
  private readonly STORAGE_KEY = 'qr_history';

  async generateQRCode(text: string, options?: {
    width?: number;
    color?: { dark: string; light: string };
    margin?: number;
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  }): Promise<string> {
    try {
      const qrOptions = {
        width: options?.width || 256,
        margin: options?.margin || 2,
        errorCorrectionLevel: options?.errorCorrectionLevel || 'M',
        color: {
          dark: options?.color?.dark || '#000000',
          light: options?.color?.light || '#FFFFFF'
        }
      };
      
      const dataUrl = await QRCode.toDataURL(text, qrOptions);
      return dataUrl;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }

  detectType(text: string): QRHistoryItem['type'] {
    if (/^https?:\/\//.test(text) || /^www\./.test(text)) return 'url';
    if (/^WIFI:/.test(text)) return 'wifi';
    if (/^mailto:/.test(text)) return 'email';
    if (/^tel:/.test(text)) return 'phone';
    return 'text';
  }

  saveToHistory(item: Omit<QRHistoryItem, 'id' | 'timestamp'>): QRHistoryItem {
    const history = this.getHistory();
    const newItem: QRHistoryItem = {
      ...item,
      id: this.generateId(),
      timestamp: Date.now()
    };
    
    // Add to beginning and keep only last 50 items
    history.unshift(newItem);
    if (history.length > 50) {
      history.pop();
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    return newItem;
  }

  getHistory(): QRHistoryItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  deleteFromHistory(id: string): void {
    let history = this.getHistory();
    history = history.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}