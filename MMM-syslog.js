/* global Module */

/* Magic Mirror
 * Module: MMM-syslog
 *
 * By Paul-Vincent Roll http://paulvincentroll.com
 * MIT Licensed.
 */

Module.register('MMM-syslog',{

	messages: [],

	defaults: {
		max: 5,
		format: false,
		types: {
			INFO: "dimmed",
			WARNING: "normal",
			ERROR: "bright"
		},
		icons: {
			INFO: "info",
			WARNING: "exclamation",
			ERROR: "exclamation-triangle"
		},
		shortenMessage: false,
    alert: true
	},

  txtSysLog : "",

	getStyles: function () {
		return ["font-awesome.css"];
	},

	getScripts: function() {
		return ["moment.js"];
	},

	getTranslations: function() {
    return {
      'en': 'translations/en.json',
      'id': 'translations/id.json'
    };
	},

  getCommands: function(commander) {
    commander.add({
      command: 'syslog',
      description: this.translate("TXT_SYSLOG_DESC"),
      callback: 'cmd_syslog'
    })
  },

  cmd_syslog: function(command, handler) {
    handler.reply("TEXT", this.txtSysLog, {parse_mode:'Markdown'});
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
      if (this.config.alert && !payload.silent) {
			  this.sendNotification("SHOW_ALERT", {type: "notification", title: payload.type, message: payload.message});
      }
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
    var tmpTxtSysLog = "*" + this.translate("TXT_SYSLOG") + "*\n";

		for (var i = this.messages.length - 1; i >= 0; i--) {
			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.classList.add("normal");

			var iconCell = document.createElement("td");
			var icon =  document.createElement("i");
			if(this.config.icons.hasOwnProperty(this.messages[i].type)){
				icon.classList.add("fa", "fa-fw", "fa-" + this.config.icons[this.messages[i].type]);
			}
			else {
				icon.classList.add("fa", "fa-fw", "fa-question");
			}
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				icon.classList.add(this.config.types[this.messages[i].type]);
			}
      tmpTxtSysLog += "*" + this.messages[i].type + "* ";

			iconCell.classList.add("small");

			iconCell.appendChild(icon);
			callWrapper.appendChild(iconCell);

			var message = this.messages[i].message;
			if(this.config.shortenMessage && message.length > this.config.shortenMessage){
				message = message.slice(0, this.config.shortenMessage) + "&#8230;";
			}
      tmpTxtSysLog += message.replace(/^\\n+|\\n+$/g, '');
			//Set caller of row
			var caller =  document.createElement("td");
			caller.innerHTML = " " + message;
			caller.classList.add("title", "small", "align-left");
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				caller.classList.add(this.config.types[this.messages[i].type]);
			}
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
      var timeMoment = this.config.format ? moment(this.messages[i].timestamp).format(this.config.format) : moment(this.messages[i].timestamp).fromNow();
			time.innerHTML = timeMoment;
			time.classList.add("time", "light", "xsmall");
			callWrapper.appendChild(time);
      tmpTxtSysLog += " - _" + timeMoment + "_\n";

			//Add to logs
			logs.appendChild(callWrapper);
		}
		wrapper.appendChild(logs);
    this.txtSysLog = tmpTxtSysLog;
		return wrapper;
	}
});
