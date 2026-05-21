import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrGeneratorComponent } from './components/qr-generator/qr-generator.component';
import { QrScannerComponent } from './components/qr-scanner/qr-scanner.component';
import { AdmobService } from './services/admob.service';

type Tab = 'generate' | 'scan';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, QrGeneratorComponent, QrScannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Cubey Scans';
  activeTab: Tab = 'generate';

  constructor(private admobService: AdmobService) {}

  async ngOnInit(): Promise<void> {
    // Initialize AdMob
    await this.admobService.initialize();
    // Show banner ad
    await this.admobService.showBannerAd();
    // Prepare interstitial ad
    await this.admobService.prepareInterstitial();
  }

  switchTab(tab: Tab): void {
    this.activeTab = tab;
  }

  // Show interstitial ad (call this after scanning a QR code, for example)
  async showAdAfterAction(): Promise<void> {
    await this.admobService.showInterstitial();
  }
}