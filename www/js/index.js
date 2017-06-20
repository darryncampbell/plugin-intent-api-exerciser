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
        document.getElementById("btnStartActivityPickContact").addEventListener("click", startActivityPickContact);
        document.getElementById("btnStartActivityChooseImage").addEventListener("click", startActivityChooseImage);
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
                    extras: {
                        'random.number': Math.floor((Math.random() * 1000) + 1)
                    }
                },
                function() {},
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
    window.plugins.intentShim.startActivity(
        {
            //  Ensure the device allows installation from unknown sources
            //  Requires read internal storage to be granted
			//  file:// is required for the Intent to use a file provider.  Place the specified
			//  file (in this case testapp.apk) in the root of the external storage directory 
			//  (getExternalStorageDirectory())
            action: window.plugins.intentShim.ACTION_INSTALL_PACKAGE,
            url: 'file:///testapp.apk',
            type: 'application/vnd.android.package-archive'
        },
        function() {},
        function() {alert('Failed to install application.  Enable unknown sources installation and grant read access to storage')}
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
                }
                else
                {
                    document.getElementById('startActivityResultData').innerHTML = "Picked Image Canceled";
                }
            },
            function()
            {
                document.getElementById('startActivityResultData').innerHTML = "StartActivityForResult failure";
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
                    'Test Intent': 'Successfully sent'
                }
            },
            function()
            {

            }
        );
}