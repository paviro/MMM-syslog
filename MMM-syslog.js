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
		
		this.messages = []
	 },
	
	socketNotificationReceived: function(notification, payload) {
		this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.title, message: payload.message}); 
		this.messages.push({title: payload.title, message: payload.message});
		this.updateDom(3000);
	 },
	
	getDom: function() {
		var array = this.messages;

		var arrayLength = array.length;
		var theTable = document.createElement('table');
		var wrapper = document.createElement("div");

		// Note, don't forget the var keyword!
		for (var i = 0, tr, td; i < arrayLength; i++) {
			tr = document.createElement('tr');
			td = document.createElement('td');
			td.appendChild(document.createTextNode(array[i].title + " - " + array[i].message));
			tr.appendChild(td);
			theTable.appendChild(tr);
		}

		wrapper.appendChild(theTable);
		
		
		
		wrapper.className = "normal small light";


		return wrapper;
	 }
	
});