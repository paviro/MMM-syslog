/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const url = require("url");
module.exports = NodeHelper.create({
	
	start: function() {
		this.expressApp.get('/syslog', (req, res) => {
			
			var query = url.parse(req.url, true).query;
			var message = query.message;
			var type = query.type;
			
			if (message == null && type == null){
				res.send({"status": "failed", "error": "No message and type given."});
			}
			else if (message == null){
				res.send({"status": "failed", "error": "No message given."});
			}
			else if (type == null) {
				res.send({"status": "failed", "error": "No type given."});
			}
			else {
				res.send({"status": "success", "payload": {"type": type, "message": message}});
				this.sendSocketNotification("NEW_MESSAGE", {"type": type, "message": message});
			}
		});
	},
	
	socketNotificationReceived: function(notification, payload) {
		if(notification === "CONNECT"){
			this.max = payload.max;
		}
	}
	
});