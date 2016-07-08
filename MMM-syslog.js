/* global Module */

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-syslog',{
	start: function() {
		this.sendSocketNotification("CONNECT");
		Log.info("Starting module: " + this.name);
	 },
	
	socketNotificationReceived: function(notification, payload) {
		this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.title, message: payload.message}); 
	 },
	
});