/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
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
        document.getElementById("btnStartActivityPickContact").addEventListener("click", startActivityPickContact);
        document.getElementById("btnStartActivityChooseImage").addEventListener("click", startActivityChooseImage);




        //document.getElementById("testButton").addEventListener("click", testFunctionality);
        /*window.plugins.intent.setNewIntentHandler(function (intent) {
            console.log('Received Intent: ' + JSON.stringify(intent.extras));
            var decodedBarcode = intent.extras["com.symbol.datawedge.data_string"];
            var parentElement = document.getElementById('barcodeData');
            if (parentElement && decodedBarcode)
            {
                parentElement.innerHTML = "Barcode: " + decodedBarcode;
                parentElement.setAttribute('style', 'background-color:#0077A0;color:#FFFFFF;');
            }
        });
        */

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
            function () {}
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
    function() {}
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
                if (intent.extras.requestCode == 1)
                {
                    console.log('Picked contact: ' + intent.data);
                    document.getElementById('startActivityResultData').innerHTML = "Picked Contact: " + intent.data;
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
                if (intent.extras.requestCode == 2)
                {
                    console.log('Picked image: ' + intent.data);
                    document.getElementById('startActivityResultData').innerHTML = "Picked Image: " + intent.data;
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
            //var decodedBarcode = intent.extras["com.symbol.datawedge.data_string"];
            var parentElement = document.getElementById('broadcastData');
            parentElement.innerHTML = "Received Broadcast: " + JSON.stringify(intent.extras);
        }
    );
}

function unregisterBroadcastReceiver()
{
    window.plugins.intentShim.unregisterBroadcastReceiver();
}