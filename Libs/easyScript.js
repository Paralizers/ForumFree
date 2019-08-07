window.FFLib = {
	'location': {
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
		get currentSectionName(){
			if(window.FFLib.location.getSectionId()){
				let mtitleSez = window.FFLib.info.forum.isForum ? document.querySelector(".forum .mback .mtitle,.forum .top .title") : false;
				if(mtitleSez) {
					var mtitleh1 = mtitleSez.querySelector("h1,strong");
					return mtitleh1 ? mtitleh1.innerHTML : mtitleSez.innerText;
				}
				if(window.FFLib.info.forum.isFFMobile()){
					let buttonMobile = document.querySelector(".topic .bottom .buttons a[href*='?f='][data-name]");
					if(typeof buttonMobile.dataset.name !== "undefined" && buttonMobile.dataset.name)return buttonMobile.dataset.name;
				}
				else if(window.FFLib.info.forum.isStandard()){
					let currentForum = document.querySelector(".navsub > a[href*='?f=']");
					if(currentForum) return currentForum.innerText;
				}
				else if(window.FFLib.info.forum.isQuirks()){
					let currentForum = document.querySelector("a.current_forum[href*='?f=']");
					if(currentForum) return currentForum.innerText;
				}
				return null;
			}
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
		},
		get currentTopicPosts(){
			return document.querySelectorAll(( window.FFLib.info.isFFMobile() ? ".topic .post .color td"  : (window.FFLib.info.isStandard() ? ".topic .post .color tr+tr td"  : ".topic .post tr .color")));
		}
	},

	'info': {
		'forum': {
			get id() {
				return ff_cid;
			},
			get layout() {
				return (typeof ff_layout === "undefined" ? 0 : ff_layout);
			},
			'isFFMobile': function() {
				return window.FFLib.info.forum.layout === 0;
			},
			'isQuirks': function() {
				return window.FFLib.info.forum.layout === 1;
			},
			'isStandard': function() {
				return window.FFLib.info.forum.layout === 2;
			},
			'isResponsive': function() {
				return window.FFLib.info.forum.layout === 3;
			},
			'domain': document.domain,
			'isTopic': function() {
				return document.body.id === 'topic';
			},
			'isFullEditor': function() {
				return document.body.id === 'send';
			},
			'isHome': function() {
				return document.body.id === 'board';
			},
			'isForum': function() {
				return document.body.id === 'forum';
			},
			'isProfile': function() {
				return document.body.id === 'profile' || /Profile&MID=(\d+)/.test(document.location.href);
			},
			'home': {
				'getUserLastTopic': function() {
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
				if (typeof ff_mid !== 'undefined') return ff_mid;
				if (window.FFLib.info.forum.isFFMobile()) return Number(document.querySelector('aside#Left .nickname').href.split('Profile&MID=')[1]);
				return Number(document.querySelector('.menuwrap > ul:nth-of-type(1) .menu > a').href.split('Profile&MID=')[1]);
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
			},
			'isAdmin': function() {
				return document.body.classList.contains('admin');
			},
			'isScriptAdmin': function() {
				return (typeof window.FFScript.scripts_admin !== 'undefined' && window.FFScript.scripts_admin.indexOf(window.FFLib.info.user.id) > -1);
			},
			'isInGroup': function(groupId) {
				return document.body.classList.contains('g' + groupId);
			},
			'getGroup': function() {
				for (var value of document.body.classList.values()) {
					if (value.indexOf('g') === 0 && !isNaN(Number(value.replace('g', '')))) return value.replace('g', '');
				}
				return 0;
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
		},
		'removeTags': function(string, tags = ['script', 'style']) {
			let reg = new RegExp('<\(/\?\('+tags.join('\|')+'\)\[\^>\]\*>\)', 'gi');
			return string.replace(reg, '&lt;$1')
		},
		'removeJsInTags': function(string) {
			return string.replace(/<([^>]*(on\w+(\s+)?=(.*?)|javascript)[^>]*>)/gi, '&lt;$1');
		},
		'dateFormat': function(string, format = 'Y-m-d H:i:s') {
			let date = new Date(string),
			    symbols = {
				    'Y': date.getFullYear(),
				    'n': date.getMonth() + 1,
				    'j': date.getDate(),
				    'G': date.getHours(),
				    'i': date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
				    's': date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
			    };
			symbols['m'] = symbols.n < 10 ? '0' + symbols.n : symbols.n;
			symbols['d'] = symbols.j < 10 ? '0' + symbols.j : symbols.j;
			symbols['H'] = symbols.G < 10 ? '0' + symbols.G : symbols.G;
			let reg = new RegExp(Object.keys(symbols).join('\|'), 'g');
			return format.replace(reg, function(r){return symbols[r];});
		}
	}
}
