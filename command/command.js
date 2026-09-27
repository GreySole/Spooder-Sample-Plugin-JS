/**
 * Sample Plugin
 *
 * Export a class and implement only the hooks you need. Spooder injects everything else onto
 * the instance at load time (this.settings, this.osc, this.store, this.modules...); see the
 * README for the full list. For type hints, import the types in JSDoc:
 *   @typedef {import('@spooder/plugin-sdk').StreamMessage} StreamMessage
 */
class SamplePlugin {
  /** Address prefix your overlay listens on. Overlay addresses start with the plugin's name. */
  static OSC_PREFIX = '/sample_plugin';

  onLoad() {
    // Declare the collections you use. Records live in a SQLite file in the plugin folder,
    // so unlike a JSON side file they survive a crash mid-write. Keep config in settings.json.
    this.initStorage('counters');

    // Local routes are for your utility page and the Web UI; public routes are for the
    // public page, where getActiveViewer(req) returns the logged-in Twitch viewer.
    this.registerPluginApi('local', 'get', '/count', (req, res) => {
      res.json({ count: this.getData('counters', 'events') ?? 0 });
    });
  }

  /** Called with the plugin's settings on load and every time the user saves them. */
  onSettings(settings) {}

  onChat(message) {}

  onOSC(message) {}

  onCommunityChat(type, event) {}

  /**
   * Called when one of this plugin's nodes fires in the event graph. `type` is the event id
   * from events-form.json. The values typed into (or wired into) the node arrive in
   * `message.pluginEventData`, and `message` also carries who triggered the graph.
   */
  onEvent(type, message) {
    if (type !== 'show_alert') {
      return;
    }

    const values = message.pluginEventData ?? {};
    const count = (this.getData('counters', 'events') ?? 0) + 1;
    this.setData('counters', 'events', count);

    // Send to the overlay. Objects are stringified for you; parse them with
    // JSON.parse(message.args[0]) on the overlay side.
    this.osc.sendToTCP(`${SamplePlugin.OSC_PREFIX}/alert`, JSON.stringify({ ...values, count }));
    this.pluginLog(`show_alert fired (${count} total)`);
  }

  onDestroy() {}
}

module.exports = SamplePlugin;
