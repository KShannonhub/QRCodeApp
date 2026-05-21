import { Injectable } from '@angular/core';
import { AdMob, BannerAdOptions, BannerAdPosition } from '@capacitor-community/admob';

@Injectable({
  providedIn: 'root'
})
export class AdmobService {
  // Replace these with your actual AdMob IDs from Google AdMob console
  private adMobConfig = {
    android: {
      // Test IDs (Google provides these for testing)
      banner: 'ca-app-pub-3940256099942544/6300978111',
      interstitial: 'ca-app-pub-3940256099942544/1033173712',
      // When ready for production, replace with your real IDs:
      // banner: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
      // interstitial: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
    }
  };

  constructor() {}

  /**
   * Initialize AdMob (call this in app.component.ngOnInit)
   */
  async initialize(): Promise<void> {
    try {
      await AdMob.initialize({
        initializeForTesting: true,
      });
      console.log('AdMob initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AdMob:', error);
    }
  }

  /**
   * Show Banner Ad at bottom of screen
   */
  async showBannerAd(): Promise<void> {
    try {
      const options: BannerAdOptions = {
        adId: this.adMobConfig.android.banner,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 0,
        isTesting: true,
      };

      await AdMob.showBanner(options);
      console.log('Banner ad shown');
    } catch (error) {
      console.error('Failed to show banner ad:', error);
    }
  }

  /**
   * Remove Banner Ad
   */
  async removeBannerAd(): Promise<void> {
    try {
      await AdMob.removeBanner();
      console.log('Banner ad removed');
    } catch (error) {
      console.error('Failed to remove banner ad:', error);
    }
  }

  /**
   * Prepare Interstitial Ad (load it in advance)
   */
  async prepareInterstitial(): Promise<void> {
    try {
      await AdMob.prepareInterstitial({
        adId: this.adMobConfig.android.interstitial,
        isTesting: true,
      });
      console.log('Interstitial ad prepared');
    } catch (error) {
      console.error('Failed to prepare interstitial ad:', error);
    }
  }

  /**
   * Show Interstitial Ad (must call prepareInterstitial first)
   */
  async showInterstitial(): Promise<void> {
    try {
      await AdMob.showInterstitial();
      console.log('Interstitial ad shown');
      // Prepare next interstitial
      setTimeout(() => this.prepareInterstitial(), 1000);
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
    }
  }
}