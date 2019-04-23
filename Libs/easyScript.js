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
			let locationmatch = window.FFLib.utilities.getUrlParameter("f");
			if (locationmatch) {
				//In caso si trovi nell'url
				return locationmatch;
			} else if (bodyClass) {
				bodyClass = bodyClass[2];
				//In caso sia già stata trovata nel body fa il ritorno;
				return parseInt(bodyClass);
			} else if (navUrl) {
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
	'info': {
		'forum': {
			'id': ff_cid,
			'layout': (typeof ff_layout === "undefined" ? 3 : ff_layout),
			'domain': document.domain,
			'isTopic': /^((?!act=Post).)*[&?]t=[0-9]/g.test(location.href) ? true : false,
			'isSection': /^((?!act=Post).)*[&?]f=[0-9]/g.test(location.href) ? true : false,
			'home': {
				'getUserSection': function() {
					let arr = [];
					let a = document.querySelectorAll("body#board .board .big_list .zz .wbo a,.board  .zz  a[href*='MID=']");
					if (a.length > 0) {
						for (var i = 0; i < a.length; i++) {
							let match = a[i].href.match(/[&?]MID=([0-9]+)/i);
							if (match) arr.push(match[1]);
						}
					}
					return arr;

				}
			}
		},
		'user': {
			get id() {
				ff_mid
			},
			get avatar() {
				if (ff_mid) {
					let avatar = document.querySelector("aside#Left.sidebar .user_details .avatar img,.menuwrap li:first-child .avatar img");
					if (avatar) return avatar.src
				}
				return null;
			},
			get nickname() {
				if (ff_mid) {
					let nicname = document.querySelector("aside#Left.sidebar .user_details .nickname,.menuwrap li:first-child .nick");
					if (nicname) return nicname.innerText
				}
				return null;

			},
			get authSession() {
				return window.FFLib.utilities.getCookie("auth_session");
			}
		},
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
		},
		'getCookie': function(name, all) {
			try {
				let cookie = document.cookie;
				let match, parse, obj = {};
				if (typeof all === "undefined") {
					parse = new RegExp(name + "=([^;]+)", "i");
					match = cookie.match(parse);
				} else {
					match = cookie.match(/[^ ;]+=[^;]+/gi);
					for (var i = 0; i < match.length; i++) {
						let explode = match[i].split("=");
						obj[explode[0]] = explode[1]
					}
				}
				return (typeof all === "undefined" && match !== null && match.length > 1 ? match[1] : (typeof all !== "undefined" ? obj : null));
			} catch (e) {
				return false;
			}
		},
		'setCookie': function(name, value, seconds, circuits) {
			try {
				if (!(name && value)) return false;
				let expires = "",
					domain = "";
				if (typeof seconds === "number") {
					let date = new Date();
					date.setSeconds(date.getSeconds() + seconds);
					expires = ";expires=" + date.toUTCString();
				}
				if (circuits === true && location.host) {
					var c = location.host.match(/(forumfree|forumcommunity|blogfree)\.(it|net)$/gi);
					if (c) domain = ";domain=" + c[0];
				}
				let cookie = name + "=" + value + expires + domain;
				document.cookie = cookie;
				return true;
			} catch (e) {
				return false;
			}
		}
	}
}
