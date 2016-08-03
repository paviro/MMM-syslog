/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const url = require("url");
const fs = require("fs");
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
				var log = {"type": type, "message": message, "timestamp": new Date()};
				res.send({"status": "success", "payload": log});
				this.sendSocketNotification("NEW_MESSAGE", log);
				this.storeLog(log);
			}
		});
	},
	
	socketNotificationReceived: function(notification, payload) {
		if(notification === "CONNECT"){
			this.logFile = payload.logFile;
			this.loadLogs();
			this.max = payload.max;
		}
	},

	storeLog: function(log){
		this.logs.push(log);
		while(this.logs.length > this.max){
			this.logs.shift();
		}
		fs.writeFileSync(this.logFile, JSON.stringify({"messages": this.logs}), 'utf8');
	},

	loadLogs: function(){
		if(this.fileExists(this.logFile)){
			this.logs = JSON.parse(fs.readFileSync(this.logFile, 'utf8')).messages;
			for(var i = 0; i < this.logs.length; i++){
				this.sendSocketNotification("NEW_MESSAGE", this.logs[i]);
			}
		} else {
			this.logs = [];
		}
	},

	fileExists: function(path){
		try {
			return fs.statSync(path).isFile();
		} catch(e) {
			console.log("No log file found.");
			return false;
		}
	}
	
});