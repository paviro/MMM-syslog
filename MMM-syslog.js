/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-syslog',{
	messages: [],

	types: {
		INFO: "dimmed",
		WARNING: "normal",
		ERROR: "bright"
	},

	defaults: {
		max: 5,
		format: false
	},

	getScripts: function() {
		return ["moment.js"];
	},
	
	start: function() {
		this.sendSocketNotification("CONNECT", {max: this.config.max, logFile: this.file('logs.json')});
		Log.info("Starting module: " + this.name);
		moment.locale(config.language);
		
		//Update DOM every minute so that the time of the call updates and calls get removed after a certain time
		setInterval(() => {
			this.updateDom();
		}, 60000);
	 },
	
	socketNotificationReceived: function(notification, payload) {
		if(notification === "NEW_MESSAGE"){
			this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.type, message: payload.message});
			this.messages.push(payload);
			while(this.messages.length > this.config.max){
				this.messages.shift();
			}
			this.updateDom(3000);
		}
	 },
	
	getDom: function() {
		
		var wrapper = document.createElement("div");
		if(this.config.title !== false){
			var title = document.createElement("header");
			title.innerHTML = this.config.title || this.name;
			wrapper.appendChild(title);
		}
		var logs = document.createElement("table");

		for (var i = this.messages.length - 1; i >= 0; i--) {
			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.classList.add("normal");

			//Set caller of row
			var caller =  document.createElement("td");
			caller.innerHTML = "[" + this.messages[i].type + "] " + this.messages[i].message;
			caller.classList.add("title", "small", "align-left");
			if(this.types.hasOwnProperty(this.messages[i].type)){
				caller.classList.add(this.types[this.messages[i].type]);
			}
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
			time.innerHTML = this.config.format ? moment(this.messages[i].timestamp).format(this.config.format) : moment(this.messages[i].timestamp).fromNow();
			time.classList.add("time", "light", "xsmall");
			callWrapper.appendChild(time);

			//Add to logs
			logs.appendChild(callWrapper);
		}
		wrapper.appendChild(logs);
		return wrapper;
	}
});
