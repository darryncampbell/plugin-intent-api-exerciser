var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        document.getElementById("btnSendBroadcast").addEventListener("click", sendBroadcastTest);
        document.getElementById("btnStartActivityThis").addEventListener("click", startActivityThis);
        document.getElementById("btnStartActivityMap").addEventListener("click", startActivityMap);
        document.getElementById("btnStartActivityBrowser").addEventListener("click", startActivityBrowser);
        document.getElementById("btnStartActivityInstallApp").addEventListener("click", startActivityInstallApk);
        document.getElementById("btnStartActivitySendImage").addEventListener("click", startActivitySendImage);
        document.getElementById("btnStartActivityPickContact").addEventListener("click", startActivityPickContact);
        document.getElementById("btnStartActivityChooseImage").addEventListener("click", startActivityChooseImage);
        document.getElementById("btnStartActivityExplicit").addEventListener("click", startActivityExplicit);
        document.getElementById("btnStartActivityUnrecognised").addEventListener("click", startActivityUnrecognised);
        document.getElementById("btnStartService").addEventListener("click", startService);
        document.getElementById("btnGetIntent").addEventListener("click", getIntent);
        document.getElementById("btnSendResult").addEventListener("click", sendResultForStartActivity);

        registerBroadcastReceiver();
        //  Handler for new Intents sent to the application
        window.plugins.intentShim.onIntent(function (intent) {
            console.log('Received Intent: ' + JSON.stringify(intent.extras));
            //var decodedBarcode = intent.extras["com.symbol.datawedge.data_string"];
            var parentElement = document.getElementById('newIntentData');
            parentElement.innerHTML = "Received intent: " + JSON.stringify(intent.extras);
        });
    },
    onPause: function()
    {
        console.log('Paused');
        unregisterBroadcastReceiver();
    },
    onResume: function()
    {
        console.log('Resumed');
        registerBroadcastReceiver();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function sendBroadcastTest()
{
    window.plugins.intentShim.sendBroadcast({
            action: 'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION',
            extras: {
                'random.number': Math.floor((Math.random() * 1000) + 1)
                }
            },
            function() {},
            function () {alert('Failed to send Android broadcast intent')}
        );
}

function startActivityThis()
{
        window.plugins.intentShim.startActivity(
                {
                    action: "com.darryncampbell.cordova.plugin.intent.ACTION",
                    package: "com.darryncampbell.cordova.plugin.intent.api.exerciser", //setPackage
                    extras: {
                        'random.number': Math.floor((Math.random() * 1000) + 1)
                    }
                },
                function() {console.log('Start activity success');},
                function() {alert('Failed to open URL via Android Intent')}
            );
}

function startActivityMap()
{
        window.plugins.intentShim.startActivity(
                {
                    action: window.plugins.intentShim.ACTION_VIEW,
                    url: 'geo:0,0?q=London'
                },
                function() {},
                function() {alert('Failed to open URL via Android Intent')}
            );
}

function startActivitySendImage()
{
        window.plugins.intentShim.startActivity(
                {
                    action: window.plugins.intentShim.ACTION_SEND,
                    type: "image/*",
                    extras: {
                        //  Change this URL to a URL of an actual picture on your device
                        'android.intent.extra.STREAM': "file:///storage/emulated/0/Pictures/1480088926980.jpg"
                    }
                },
                function() {},
                function() {alert('Failed to open URL via Android Intent')}
            );
}

function startActivityBrowser()
{
    window.plugins.intentShim.startActivity(
    {
        action: window.plugins.intentShim.ACTION_VIEW,
        url: 'http://www.google.co.uk'
    },
    function() {},
    function() {alert('Failed to open URL via Android Intent')}
    );
}

function startActivityInstallApk()
{
    //  Ensure the device allows installation from unknown sources.
    //  Requires read internal storage to be granted.  The app will request this if it does
    //  not already have it but you will need to call the intent again after it is granted.
    //  file:// is required for the Intent to use a file provider.  Place the specified
    //  file in the desired external storage directory.  It is recommended to use
    //  cordova.file.externalApplicationStorageDirectory or similar, as shown below
    //  (https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/):
    var sdCardRoot = cordova.file.externalRootDirectory;
    var sdCardApplication = cordova.file.externalApplicationStorageDirectory;
    var testFile1 = sdCardRoot + "testapp.apk";
    var testFile2 = sdCardApplication + "downloads/testapp.apk";
    window.plugins.intentShim.startActivity(
        {
            action: window.plugins.intentShim.ACTION_INSTALL_PACKAGE,
            url: testFile1,
            //url: testFile2,
            type: 'application/vnd.android.package-archive'
        },
        function() {},
        function(info)
        {
            //  Check log, enable unknown sources installation and grant read access to storage
            alert('Failed to install application: ' + info)
        }
    );
}

function startActivityPickContact()
{
        window.plugins.intentShim.startActivityForResult(
            {
                action: window.plugins.intentShim.ACTION_PICK,
                url: "content://com.android.contacts/contacts",
                requestCode: 1
            },
            function(intent)
            {
                if (intent.extras.requestCode == 1 && intent.extras.resultCode == window.plugins.intentShim.RESULT_OK)
                {
                    console.log('Picked contact: ' + intent.data);
                    document.getElementById('startActivityResultData').innerHTML = "Picked Contact: " + intent.data;
                }
                else
                {
                    document.getElementById('startActivityResultData').innerHTML = "Picked Contacted Canceled";
                }
            },
            function()
            {
                document.getElementById('startActivityResultData').innerHTML = "StartActivityForResult failure";
            }
        );
}


function startActivityChooseImage()
{
        window.plugins.intentShim.startActivityForResult(
            {
                action: window.plugins.intentShim.ACTION_GET_CONTENT,
                type: "image/*",
                requestCode: 2
            },
            function(intent)
            {
                if (intent.extras.requestCode == 2 && intent.extras.resultCode == window.plugins.intentShim.RESULT_OK)
                {
                    console.log('Picked image: ' + intent.data);
                    document.getElementById('startActivityResultData').innerHTML = "Picked Image: " + intent.data;

                    //  Convert the returned URI to a real path (requires plugin 1.1.0)
                    window.plugins.intentShim.realPathFromUri(
                        {
                            uri: intent.data
                        },
                        function(realPath)
                        {
                            var realPathOutput = "  [" + realPath + "]";
                            document.getElementById('startActivityResultData').innerHTML += realPathOutput;
                        },
                        function()
                        {
                            //  Failed to resolve URI to path
                            console.log('Failed to resolve URI to path');
                        }
                    );
                }
                else
                {
                    document.getElementById('startActivityResultData').innerHTML = "Picked Image Canceled";
                }
            },
            function()
            {
                document.getElementById('startActivityResultData').innerHTML = "Picked Image failure";
            }
        );

}

function startActivityExplicit()
{
        window.plugins.intentShim.startActivity(
            {
                component:
                {
                    "package": "com.darryncampbell.cordova.plugin.intent.api.exerciser",
                    "class": "com.darryncampbell.cordova.plugin.intent.api.exerciser.MainActivity"
                },
                extras:
                {
                    'random.number': Math.floor((Math.random() * 1000) + 1)
                }
            },
            function(intent)
            {
                document.getElementById('startActivityResultData').innerHTML = "StartActivity success";
            },
            function()
            {
                document.getElementById('startActivityResultData').innerHTML = "StartActivity failure";
            }
        );

}

function startActivityUnrecognised()
{
        window.plugins.intentShim.startActivity(
                {
                    action: "com.darryncampbell.unrecognised.ACTION",
                    extras: {
                        'random.number': Math.floor((Math.random() * 1000) + 1)
                    }
                },
                function()
                {
                    document.getElementById('startActivityUnrecognisedResultData').innerHTML = "Success! (Do not expect to see this)";
                },
                function()
                {
                    document.getElementById('startActivityUnrecognisedResultData').innerHTML = "Activity is not recognised (this is a good thing) " + Math.floor((Math.random() * 1000) + 1);
                }
            );
}

function startService()
{
        window.plugins.intentShim.startService(
            {
                action: "Test Start Service",
                component:
                {
                    "package": "com.darryncampbell.pluginintentapiexerciserhelper",
                    "class": "com.darryncampbell.pluginintentapiexerciserhelper.MyIntentService"
                },
                extras:
                {
                    'random.number': Math.floor((Math.random() * 1000) + 1)
                }
            },
            function()
            {
                document.getElementById('startServiceData').innerHTML = "StartService Success";
            },
            function()
            {
                document.getElementById('startServiceData').innerHTML = "StartService Failure";
            }
        );
}

function registerBroadcastReceiver()
{
    window.plugins.intentShim.registerBroadcastReceiver({
        filterActions: [
            'com.darryncampbell.cordova.plugin.broadcastIntent.ACTION'
            ]
        },
        function(intent) {
            //  Broadcast received
            console.log('Received Intent: ' + JSON.stringify(intent.extras));
            var parentElement = document.getElementById('broadcastData');
            parentElement.innerHTML = "Received Broadcast: " + JSON.stringify(intent.extras);
        }
    );
}

function unregisterBroadcastReceiver()
{
    window.plugins.intentShim.unregisterBroadcastReceiver();
}

function getIntent()
{
    window.plugins.intentShim.getIntent(
        function(intent)
        {
            console.log(JSON.stringify(intent));
            var parentElement = document.getElementById('getIntentData');
            parentElement.innerHTML = "Launch Intent Action: " + JSON.stringify(intent.action);
            var intentExtras = intent.extras;
            if (intentExtras == null)
                intentExtras = "No extras in intent";
            parentElement.innerHTML += "<br>Launch Intent Extras: " + JSON.stringify(intentExtras);
        },
        function()
        {
            alert('Error getting launch intent');
        });
}

function sendResultForStartActivity()
{
        window.plugins.intentShim.sendResult(
            {
                extras: {
                    'Test Intent': 'Successfully sent',
                    'Test Intent int': 42,
                    'Test Intent bool': true,
                    'Test Intent double': parseFloat("142.12")
                }
            },
            function()
            {

            }
        );
}