/**
 * Public sample plugin for Spooder.
 * /shared/public-bundle.js (served by Spooder) will make sure your viewer is logged into Twitch 
 * and validated in Spooder before accessing.
 * On successful validation. You'll find window.publicData will contain info about your spooder.
 * window.userData will contain the viewer's Twitch profile data.
 * 
 * Use getApiUrl('/endpoint') to call the routes your plugin registered with
 * registerPluginApi('public', ...).
 */