/**
 * Public sample plugin for Spooder.
 * The public-bundle.js file will make sure your viewer is logged into Twitch 
 * and validated in Spooder before accessing.
 * On successful validation. You'll find window.publicData will contain info about your spooder.
 * window.userData will contain the viewer's Twitch profile data.
 * 
 * Integrating osc-bundle.js might be okay, but I wouldn't recommend it.
 * Use the registerApi function on your plugin to register API endpoints.
 */