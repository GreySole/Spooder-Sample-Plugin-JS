# Spooder-Sample-Plugin-JS
Use this template to make JavaScript plugins for Spooder 0.6.

# Getting Started
In your Spooder's WebUI, go to the Plugin tab. Click the Create Plugin button at the bottom and fill in what you need. This repo will be cloned and installed to get you started on making a plugin.

# Plugin Dev Guide
View the Plugin Dev Guide <a href="https://github.com/GreySole/Spooder/wiki/Plugin-Dev-Guide">here</a>

# Layout
```
command/     the plugin itself: package.json, source, settings-form.json, events-form.json
overlay/     optional OBS overlay page
utility/     optional utility page (created for you from overlay/ when you pick it in the creator)
public/      optional page for viewers, behind Twitch login
settings/    optional custom settings page
assets/      optional bundled assets (not included in exports)
icon.png     optional 120x120 plugin icon
```
The plugin's directory name in every web folder is the `name` in `command/package.json`.

# Installing by hand
Zip the folders and use Install New Plugin under the Plugins tab. Spooder can also install and update a plugin straight from a Git repo, see the [plugin-sdk README](https://github.com/GreySole/Spooder/tree/0.5.0-beta/plugin-sdk).

# Exporting
Under Plugins in Spooder's Web UI, click the download button. Your plugin will be packaged and zipped for distribution. Note: /assets is not included.

# Metadata
Fill out your plugin's package.json to give it a proper name, display name, version, author, and description. `spooder-version` is the Spooder version the plugin was written for.

# Writing the plugin
TypeScript plugins import from the shared SDK, so there's no local copy of the types to keep up to date:

```ts
import { PluginBase } from '@spooder/plugin-sdk';
export default class MyPlugin extends PluginBase { ... }
```
JavaScript plugins export a plain class (`module.exports = MyPlugin`). Spooder injects the same properties and methods into both.

Hooks (override what you need): `onLoad`, `onSettings(settings)`, `onChat(message)`, `onCommunityChat(type, data)`, `onOSC(message)`, `onEvent(type, message)`, `onDestroy`.

## Injected state
* `this.settings`: your settings.json, kept current when the user saves.
* `this.osc.sendToTCP(address, value)`: send to your overlays. Numbers, bools and strings; objects are stringified for you. `this.osc.sendToUDP(address, value)` talks to OSC software.
* `this.chat.sayInChat(message, platform?, channel?)`
* `this.modules.stream / community / control`: the integration modules (Twitch, Discord, OBS...) and their functions.
* `this.spooderConfig`, `this.spooderTheme`, `this.public`, `this.activePlugins`
* `this.pluginLog(...)`: log to the Web UI's log for this plugin.

## Storage
Use the store for anything that grows at runtime (per-viewer saves, counters, history). It's a SQLite file in your plugin's folder, so a crash mid-write can't corrupt it the way a half-written JSON file can.
* `this.initStorage('collection', ...)` in `onLoad`, then `this.getData(collection, key)` and `this.setData(collection, key, value)`.
* `this.store` has the rest: `setMany`, `all`, `keys`, `has`, `count`, `delete`, `clear`.

Config still belongs in settings.json: small, hand-editable, and shipped with the plugin.

## API routes
`this.registerPluginApi('local' | 'public', 'get' | 'post' | 'put' | 'delete', '/address', (req, res) => {})`. Local routes are for your utility page and the Web UI. Public routes serve the public page, where `this.getActiveViewer(req)` returns the logged-in viewer.

## Assets and URLs
`getAssetPath`, `getAssetUrl`, `getLocalFilePath`, `getOverlayUrl`, `getUtilityUrl`.

# Settings
Settings forms are JSON. `settings-form.json` has a `form` (the inputs) and `defaults`. Read them with `this.settings` on the plugin side, and `window.pluginSettings` on the overlay once it has connected.

# Events (nodes)
Each entry in `events-form.json` becomes a node in the event graph editor, under Plugins. `label` names the node, `nodeWidth` optionally sets its starting width, and `form`/`defaults` describe its fields. Every field is also a wireable input socket, so values typed on the node can be replaced by other nodes' outputs. When the node runs, your `onEvent(type, message)` is called with the entry's id as `type` and the field values in `message.pluginEventData`.

Field types: `text`, `textarea`, `number`, `range`, `boolean`, `select`, `color`, `code`, `asset`, `port` (wire-only input). Use `showif` to show a field conditionally.

# Overlays and utilities
Pages load `/shared/osc-bundle.js`, which Spooder serves, so it always matches the install (nothing to copy or update). It connects to Spooder and reconnects automatically. Add `?debug=1` to the URL to show connection status. Utilities work the same and are accessible to mods in the Mod UI.

Overlay pipeline functions:
* `getOSCMessage(message)`: required to receive data from your plugin. Contains `address`, `types`, and `args`. For stringified JSON, use `JSON.parse(message.args[0])`.
* `sendOSC(address, value)`: send data back to your plugin (`onOSC`). Use the plugin's internal name first in the address.
* `onConnect()`: called when the overlay receives a connect success message.
* `onOSCOpen()`: called as soon as the OSC connection is up.
* `getAssetPath(filepath)`: full URL to an asset.

Errors on overlays are emitted to Spooder; check the Web UI's OSC monitor and filter by plugin.

# Public pages
Load `/shared/public-bundle.js` and it puts the viewer through Twitch login and validates them in Spooder. Afterwards `window.publicData` holds info about your Spooder, `window.userData` the viewer's Twitch profile, and `getApiUrl('/endpoint')` builds the URL of a route you registered with `registerPluginApi('public', ...)`. Framework (React etc.) pages should do the same work inside their own component tree instead, since the login screen replaces `document.body`.

# Icons
Make a 120x120px png named after your plugin's directory to show it in the Web UI.
