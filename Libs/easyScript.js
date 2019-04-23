window.FFLib = {
	'location': {
		'isTopic': function() {
			return document.body.id === 'topic' ? true : false;
		},
		'isFullEditor': function() {
			return document.body.id === 'send' ? true : false;
		},
		'isHome': function() {
			return document.body.id === 'board' ? true : false;
		},
		'isForum': function() {
			return document.body.id === 'forum' ? true : false;
		},

		'getSectionId': function() {
			let bodyClass = document.body.className.match(/(?:\s|^)(f([0-9]+))(?:(\s|$))/i);
				let navUrl = document.querySelector(".nav a[href*='?f=']");
				let locationmatch = location.href.match(/[?&]f=([0-9]+)/i);
				
				
				if(locationmatch){
					//In caso si trovi nell'url
					return locationmatch[1];
				}
				else if(bodyClass){
					bodyClass = bodyClass[2];
					//In caso sia già stata trovata nel body fa il ritorno;
					return parseInt(bodyClass); 
				}
				else if(navUrl){
					//In caso ci sia l'url nel nav
					return parseInt(navUrl.href.match(/[?&]f=([0-9]+)/i)[1]);
				}
			return 0;
		},
		'getTopicId': function() {
			try {
				var topic_id = null;

				if (topic_id === null && document.body.getAttribute("class") != null) {
					topic_id = document.body.getAttribute("class").match(/t([0-9]+)/);
					if (topic_id !== null) {
						topic_id = topic_id[1];
					}
				}

				if (section_id === null && window.FFLib.utilities.getUrlParameter("t") !== "") {
					section_id = window.FFLib.utilities.getUrlParameter("t");
				}

				topic_id = Number(topic_id);

				if (isNaN(topic_id)) {
					return 0;
				} else {
					return topic_id;
				}
			} catch (e) {
				return 0;
			}
		}
	},

	'isMobile': function() {
		return typeof ff_layout === 'undefined' ? true : false
	},

	'getUserId': function() {
		if (typeof ff_mid !== 'undefined') return ff_mid;
		if (this.isMobile()) return Number(document.querySelector('aside#Left .nickname').href.split('Profile&MID=')[1]);
		return Number(document.querySelector('.menuwrap > ul:nth-of-type(1) .menu > a').href.split('Profile&MID=')[1]);
	},
	'isUserInGroup': function(groupId) {
		return document.body.classList.contains('g' + groupId) ? true : false;
	},
	'getUserGroup': function() {
		for (var value of document.body.classList.values()) {
			if (value.indexOf('g') === 0 && !isNaN(Number(value.replace('g', '')))) return value.replace('g', '');
		}
		return 0;
	},

	'isAdmin': function() {
		return document.body.classList.contains('admin') ? true : false;
	},
	'isScriptAdmin': function() {
		return (typeof scripts_admin !== 'undefined' && scripts_admin.indexOf(this.getUserId()) > -1) ? true : false;
	},

	'utilities': {
		'uniqueItems': function(array, key) {
			var flags = [],
				output = [];
			for (i = 0; i < array.length; i++) {
				if (flags[array[i][key]]) continue;
				flags[array[i][key]] = true;
				output.push(array[i]);
			}
			return output;
		},
		'getUrlParameter': function(name) {
			name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
			var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
			var results = regex.exec(location.search);
			return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
		}
	}
}
