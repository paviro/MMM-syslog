/* global Module */

/* Magic Mirror
 * Module: MMM-Wunderlist
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
module.exports = NodeHelper.create({
	
	start: function() {
		const self = this
		this.expressApp.get('/syslog', function (req, res) {
			
			var query = require('url').parse(req.url,true).query;
			var message = query.message;
			var title = query.title;
			
			if (message == null && title == null){
				res.send({"status": "failed", "error": "No message and title given."});
			}
			else if (message == null){
				res.send({"status": "failed", "error": "No message given."});
			}
			else if (title == null) {
				res.send({"status": "failed", "error": "No title given."});
			}
			else {
				res.send({"status": "success", "payload": {"title": title, "message": message}});
				self.sendSocketNotification("payload", {"title": title, "message": message});
				console.log(message, title);
			}
	
		});
	},
	
	socketNotificationReceived: function(notification, payload) {
		console.log(notification, payload);
	}
	
});