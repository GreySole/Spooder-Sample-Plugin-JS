/*
    /shared/osc-bundle.js (served by Spooder) contains all the mechanisms needed to run an overlay.
    It connects to your Spooder and reconnects automatically. Add ?debug=1 to the page URL to
    show its connection status.

    Global vars:
    oscIP
    oscPort
    pluginSettings
*/

/*
    Call sendToTCP('/sample_plugin/anything', value:any) on the Spooder side to send data to this overlay.
    To send data back, use sendOSC(address:string, value:any). Objects are automatically stringified as well as on the Spooder side.
    Be sure to use the plugin's internal name first for the address, unless your plugin has the isAlertBox flag.
    You can send whole json objects through this. Just make a variable using JSON.parse(message.args[0]) to make it usable.
    If you're using assets, use getAssetPath(filepath:string) to get a full url to the asset.
    Errors on overlays are also emitted to Spooder. You can check for errors on the Web UI's OSC monitor and filter by plugin.
*/
function getOSCMessage(message){
    if(message.address == "/sample_plugin/alert"){
        const alert = JSON.parse(message.args[0]);
        document.querySelector("#alert").textContent = alert.message + " (#" + alert.count + ")";
    }
}

function onOSCOpen(){
    console.log("OSC CONNECTED!");
    document.querySelector("#oscInfo").innerHTML = "OSC Connected!<br>Here's the info:<br>IP: "+oscIP+"<br>Port: "+oscPort+"<br>Settings: "+JSON.stringify(pluginSettings);
}