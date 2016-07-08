/* global Module */

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-syslog',{
	getScripts: function() {
		return ["moment.js"];
	},
	
	start: function() {
		this.sendSocketNotification("CONNECT");
		Log.info("Starting module: " + this.name);
		
		this.messages = []
		
		//Update doom every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(function() {
			self.updateDom();
		}, 60000);
		
	 },
	
	socketNotificationReceived: function(notification, payload) {
		this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.title, message: payload.message}); 
		this.messages.push({title: payload.title, message: payload.message, "time": moment()});
		this.updateDom(3000);
	 },
	
	getDom: function() {
		
		var wrapper = document.createElement("table");

		for (var i = 0; i < this.messages.length; i++) {

			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.className = "normal";

			//Set caller of row
			var caller =  document.createElement("td");
			caller.innerHTML = this.messages[i].message;
			caller.className = "title bright";
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
			time.innerHTML = moment(this.messages[i].time).fromNow();
			time.className = "time light xsmall";
			callWrapper.appendChild(time);

			//Add to wrapper
			wrapper.appendChild(callWrapper);

		}
		return wrapper;
	 
	}
});