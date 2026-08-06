# Spooder-Sample-Plugin
Use this template to make plugins for Spooder

# Installation
Download this code and add both folders to a zip. Then click Install New Plugin under the Plugins tab in Spooder's Web UI. Watch the name of your zip. That'll be the name used for all directories associated with the plugin. Same names will be given a number in front automatically to avoid conflict.

# Exporting
Under Plugins in Spooder's Web UI, click the download button. Your plugin will be packaged and zipped for distribution. Note: /assets is not included.

# Utilities
Utilities are web pages that communicate with your plugin, just like overlays. These are made so you can interface with your plugin directly. Mods can also access utilitiies in the Mod UI. To add a utility, add a folder to this code called 'utility'. It will install along with everything else. You can also add a utility to an installed plugin by adding a folder with the plugin's name in `/backend/web/utility`

# Settings
On the plugin side, settings are loaded into the module itself, so it can be accessed with this.settings.
On the overlay side, settings are loaded when onConnect is triggered. It can be accessed with window.pluginSettings

Making settings forms are pretty easy. A lot easier with JSON based forms! The sample JSON shows every kind of input Spooder is capable of

# Icons
Icons are stored in the web folder along with overlays and utilities. Make a 120x120px png and name it the same as your plugin's directories to make it show in the Web UI.

# Metadata
Fill out your plugin's package.json file to give it a proper capitalized name, version, author, and description.

# Global Functions
Spooder comes with many global functions your plugins can use:
## OSC
### sendToTCP(address:string, content:any): Use this to talk to your overlays. You can send numbers, bools, and strings (like stringified JSON objects)
### sendToUDP(dest:string, address:string, content:any): Use this to talk to OSC software. Be sure to make a <select> field with the udpselect attribute in your settings form to let the user define which machine to send the messages to.
## Chat
### chatisFirstMessage(message:obj): Returns true or false whether the message is the user’s first message to your channel
### chatIsReturningChatter(message:obs): Returns true or false whether the message is from a returning chatter.
### chatIsMod(message:obj): Returns true or false whether the user who sent this message is a moderator.
### chatIsSubscriber(message:obj): Returns true or false whether the user who sent this message is a subscriber.
### chatIsBroadcaster(message:obj): Returns true or false whether the user who sent this message is the broadcaster
### getChatters(type:string): Returns an array of usernames for a specific type. Available types are: mod, vip, all
## Moderation
### blacklistUser(viewername:string, duration:number (millis): Locks a user from using chat commands for the duration.
### lockEvent(moduser:string, modCommand:string, target:string): Locks an event from use in chat. moduser is to tell which mod is calling, and modCommand is a boolean
### lockPlugin(moduser:string, modCommand:string, target:string): Locks an plugin from use in chat. moduser is to tell which mod is calling, and modCommand is a boolean
### setSpamguard(isOn:boolean): Turns on Spamguard which will lock out individual users for 60 seconds when spamming 6 commands each less than 2 seconds apart.
## OBS
### callOBS(name:string, data:any): Make calls to the OBS websocket module to get data and send commands.
  
# Overlay Pipeline Functions
## getOSCMessage(message:obj): You'll need this for your overlay to talk to your plugin. Receives data from TCP OSC. Contains address, types, and args (data). So if you send a stringified JSON file, you can parse it on the overlay with JSON.parse(message.args[0]).
  
These functions aren't necessary, but could come in handy
## onConnect(): Called when the overlay receives a connect success message from Spooder
## onOSCOpen(): Called as soon as the OSC module is up and running.
