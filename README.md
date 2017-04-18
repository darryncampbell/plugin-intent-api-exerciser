# plugin-intent-api-exerciser
A small application to demonstrate the API exposed by the cordova plugin: com.darryncampbell.cordova.plugin.intent which provides a shim layer on top of Android's intent mechanism.

The com.darryncampbell.cordova.plugin.intent plugin can be found at the following locations
* [NPM](https://www.npmjs.com/package/com-darryncampbell-cordova-plugin-intent)
* [GitHub](https://github.com/darryncampbell/darryncampbell-cordova-plugin-intent)

### Installation
```bash
git clone https://github.com/darryncampbell/plugin-intent-api-exerciser.git
cd plugin-intent-api-exerciser
cordova platform add android
cordova run android
```

### Usage
The UI is self-explanatory:
- Buttons are provided for each way to send intents (broadcast, startActivity, startActivityForResult).  
- The application automatically registers for broadcast intents onResume() and unregisters in onPause().  
- One button demonstrates how the application can use startActivity to launch itself and receive the intent associated with that launch; to achieve this the plugin automatically registers an intent-filter for `com.darryncampbell.cordova.plugin.intent.ACTION`
- Buttons are yellow, the results received are coloured blue.

![The application UI](https://raw.githubusercontent.com/darryncampbell/plugin-intent-api-exerciser/master/screens/screen_001.png)