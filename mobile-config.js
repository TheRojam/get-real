//Info extraction
//Extract strings: i18next-conv -l en -s ~/repositories/getreal/src/getreal/i18n/en/core.po -t ~/repositories/getreal/src/getreal/i18n/en/core.json
App.info({
  id: 'com.getreal',
  name: 'getreal',
  description: 'get:real - real dates for real people',
  version: '1.0.10',
  buildNumber: 1010,
  author: 'Dr. Luis Prill Sempere',
  email: 'info@getreal.app',
  website: 'https://www.getreal.app'
});

App.accessRule("*");

App.icons({
  //iOS
  'app_store': 'resources/icon/ios/AppIcon.appiconset/1024.png',
  'iphone_2x': 'resources/icon/ios/AppIcon.appiconset/120.png',
  'iphone_3x': 'resources/icon/ios/AppIcon.appiconset/180.png',
  'ipad_2x': 'resources/icon/ios/AppIcon.appiconset/152.png',
  'ipad_pro': 'resources/icon/ios/AppIcon.appiconset/167.png',
  'ios_settings_2x': 'resources/icon/ios/AppIcon.appiconset/58.png',
  'ios_settings_3x': 'resources/icon/ios/AppIcon.appiconset/87.png',
  'ios_spotlight_2x': 'resources/icon/ios/AppIcon.appiconset/80.png',
  'ios_spotlight_3x': 'resources/icon/ios/AppIcon.appiconset/120.png',
  'ios_notification_2x': 'resources/icon/ios/AppIcon.appiconset/40.png',
  'ios_notification_3x': 'resources/icon/ios/AppIcon.appiconset/60.png',
  'ipad': 'resources/icon/ios/AppIcon.appiconset/76.png',
  'ios_settings': 'resources/icon/ios/AppIcon.appiconset/29.png',
  'ios_spotlight': 'resources/icon/ios/AppIcon.appiconset/40.png',
  'ios_notification': 'resources/icon/ios/AppIcon.appiconset/20.png',
  'iphone_legacy': 'resources/icon/ios/AppIcon.appiconset/58.png',
  'iphone_legacy_2x': 'resources/icon/ios/AppIcon.appiconset/114.png',
  'ipad_spotlight_legacy': 'resources/icon/ios/AppIcon.appiconset/50.png',
  'ipad_spotlight_legacy_2x': 'resources/icon/ios/AppIcon.appiconset/100.png',
  'ipad_app_legacy': 'resources/icon/ios/AppIcon.appiconset/72.png',
  'ipad_app_legacy_2x': 'resources/icon/ios/AppIcon.appiconset/144.png',

  //Android
  'android_mdpi': 'resources/icon/android/mipmap-mdpi/ic_launcher.png',
  'android_hdpi': 'resources/icon/android/mipmap-hdpi/ic_launcher.png',
  'android_xhdpi': 'resources/icon/android/mipmap-xhdpi/ic_launcher.png',
  'android_xxhdpi': 'resources/icon/android/mipmap-xxhdpi/ic_launcher.png',
  'android_xxxhdpi': 'resources/icon/android/mipmap-xxxhdpi/ic_launcher.png'
});

//  made with https://makeappicon.com/
// could also try https://romannurik.github.io/AndroidAssetStudio/icons-notification.html#source.type=text&source.space.trim=1&source.space.pad=0&source.text.text=app&source.text.font=Arial&name=ic_stat_app

// app_store (1024x1024) // Apple App Store
// iphone_2x (120x120) // iPhone 5, SE, 6, 6s, 7, 8
// iphone_3x (180x180) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
// ipad_2x (152x152) // iPad, iPad mini
// ipad_pro (167x167) // iPad Pro
// ios_settings_2x (58x58) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
// ios_settings_3x (87x87) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
// ios_spotlight_2x (80x80) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
// ios_spotlight_3x (120x120) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
// ios_notification_2x (40x40) // iPhone 5, SE, 6, 6s, 7, 8, iPad, mini, Pro
// ios_notification_3x (60x60 // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus, X
// ipad (76x76) // Legacy
// ios_settings (29x29) // Legacy
// ios_spotlight (40x40) // Legacy
// ios_notification (20x20) // Legacy
// iphone_legacy (57x57) // Legacy
// iphone_legacy_2x (114x114) // Legacy
// ipad_spotlight_legacy (50x50) // Legacy
// ipad_spotlight_legacy_2x (100x100) // Legacy
// ipad_app_legacy (72x72) // Legacy
// ipad_app_legacy_2x (144x144) // Legacy
// android_mdpi (48x48)
// android_hdpi (72x72)
// android_xhdpi (96x96)
// android_xxhdpi (144x144)
// android_xxxhdpi (192x192)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

App.launchScreens({
  //iOS

  'iphone_2x': 'resources/splash/ios/Default@2x~iphone.png',
  'iphone5': 'resources/splash/ios/Default-568h@2x~iphone.png',
  "iphone6": 'resources/splash/ios/Default-667h.png',
  "iphone6p_portrait": 'resources/splash/ios/Default-736h.png',
  "iphoneX_portrait": 'resources/splash/ios/Default-736h.png',
  "ipad_portrait_2x": 'resources/splash/ios/Default-Portrait@2x~ipad.png',
  "iphone": 'resources/splash/ios/Default~iphone.png',
  "ipad_portrait": 'resources/splash/ios/Default-Portrait~ipad.png',


  //Android
  'android_ldpi_portrait': 'resources/splash/android/drawable-port-ldpi-screen.png',
  'android_mdpi_portrait': 'resources/splash/android/drawable-port-mdpi-screen.png',
  'android_hdpi_portrait': 'resources/splash/android/drawable-port-hdpi-screen.png',
  'android_xhdpi_portrait': 'resources/splash/android/drawable-port-hdpi-screen.png',
  'android_xxhdpi_portrait': 'resources/splash/android/drawable-port-xhdpi-screen.png',
  'android_xxxhdpi_portrait': 'resources/splash/android/drawable-port-xxxhdpi-screen.png'
});


// made with https://www.resource-generator.com/


// iphone5 (640x1136) // iPhone 5, SE
// iphone6 (750x1334) // iPhone 6, 6s, 7, 8
// iphone6p_portrait (1242x2208) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
// iphone6p_landscape (2208x1242) // iPhone 6 Plus, 6s Plus, 7 Plus, 8 Plus
// iphoneX_portrait (1125x2436) // iPhone X
// iphoneX_landscape (2436x1125) // iPhone X
// ipad_portrait_2x (1536x2048) // iPad, iPad mini
// ipad_landscape_2x (2048x1536) // iPad, iPad mini
// iphone (320x480) // Legacy
// iphone_2x (640x960) // Legacy
// ipad_portrait (768x1024) // Legacy
// ipad_landscape (1024x768) // Legacy
// android_mdpi_portrait (320x480)
// android_mdpi_landscape (480x320)
// android_hdpi_portrait (480x800)
// android_hdpi_landscape (800x480)
// android_xhdpi_portrait (720x1280)
// android_xhdpi_landscape (1280x720)
// android_xxhdpi_portrait (960x1600)
// android_xxhdpi_landscape (1600x960)
// android_xxxhdpi_portrait (1280x1920)
// android_xxxhdpi_landscape (1920x1280)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


App.setPreference('StatusBarOverlaysWebView', '2000');
App.setPreference('StatusBarBackgroundColor', '#000000');

App.setPreference('StatusBarOverlaysWebView', 'true');
App.setPreference('StatusBarBackgroundColor', '#000000');

App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'portrait');
App.setPreference('Orientation', 'portrait', 'ios');

/*App.accessRule('https://t.me/getreal_support');
App.accessRule('https://wa.me/4915114383978');*/

App.accessRule( 'mailto:*', { launchExternal: true } );

App.configurePlugin('phonegap-plugin-push', {
  SENDER_ID: 343760448637
});

// Add custom tags for a particular PhoneGap/Cordova plugin to the end of the
// generated config.xml. 'Universal Links' is shown as an example here.
App.appendToConfig(`
  <platform name="android">
      <hook src="hooks/copy-build-extras-gradle.js" type="before_build" />
  </platform>
`);

App.appendToConfig(`
  <edit-config target="NSContactsUsageDescription" file="*-Info.plist" mode="merge">
    <string>This app requires contacts access to function properly.</string>
  </edit-config>
`);