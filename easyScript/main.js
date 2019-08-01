function launchNewModal(d) {
	if (!d || !d.hasOwnProperty('id') || !d.hasOwnProperty('body') || $('#' + d.id).length != 0) {
		console.warn('Error in generating a new modal' + d.id);
		return false;
	}

	var boxes = {
		'footer': '<div class="%footerClass%">{d}</div>',
		'title': '<h5 class="%titleClass%">{d}</h5>',
		'close': '<button type="button" class="close" data-dismiss="modal" aria-label="Chiudi">\
					<span aria-hidden="true">&times;</span>\
				</button>'
	};

	var classes = {
		'genClass': 'fade',
		'dialogClass': 'modal-dialog modal-dialog-centered',
		'contentClass': 'modal-content',
		'headerClass': 'modal-header',
		'bodyClass': 'modal-body',
		'footerClass': 'modal-footer',
		'titleClass': 'modal-title'
	};

	var template = '<div class="modal %genClass%" id="{id}" tabindex="-1" role="dialog" aria-hidden="true">\
		<div class="%dialogClass%" role="document">\
		<div class="%contentClass%">\
		  <div class="%headerClass%">\
			{title}\
			{close}\
		  </div>\
		  <div class="%bodyClass%">\
			{body}\
		  </div>\
		  {footer}\
		</div>\
		</div>\
	</div>';

	template = template.replace(/{(\w*)}/g, function(m, k) {
		if (d.hasOwnProperty(k)) {
			if (boxes.hasOwnProperty(k)) {
				return boxes[k].replace('{d}', d[k]);
			} else return d[k];
		} else {
			return '';
		}
	});

	template = template.replace(/%(\w*)%/g, function(m, k) {
		if (d.hasOwnProperty(k)) {
			return d[k];
		} else return classes[k];
	});

	return template;
}


$(document).on("click", "*[data-name][data-listinstalled][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this),
		forums = '',
		users = '';

	var info = JSON.parse(atob(jqthis.attr("data-listinstalled")));
	$.each(info, function(k, v) {
		var template = '<li class="list-inline-item text-left m-2 col-10 col-md-10"><div class="card p-2"><h5 class="card-title text-truncate m-0"><a target="_blank" href="{flink}">{type}: {fname}</a></h5></div></li>';

		if (/^([A-Za-z0-9\.-]+)\.(forumfree|forumcommunity|blogfree)\.(it|net)$/i.test(v[1])) {
			forums += template.replace(/\{flink\}/gim, 'https://' + v[1] + '/').replace(/\{fname\}/gim, v[1]).replace(/\{cid\}/gim, v[0]).replace(/\{type\}/gim, 'Forum');
		} else {
			users += template.replace(/\{flink\}/gim, v[0].replace(/^ff/i, "https://ffboard.forumfree.it/?act=Profile&MID=").replace(/^fc/i, "https://top.forumcommunity.net/?act=Profile&MID=").replace(/^bf/i, "https://supporto.blogfree.net/?act=Profile&MID=")).replace(/\{fname\}/gim, v[1] + ' ('+v[0]+')').replace(/\{type\}/gim, 'Utente');
		}
	});

	var html = '';

	html += '<div class="btn-group">';
	html += '<button onclick="location.href=\'https://ffboard.forumfree.it/?pag=easyscript&evd='+jqthis.attr("data-sid")+'&s_tab='+jqthis.attr("data-stab")+'\'" type="button" class="btn btn-info btn-default btn-md"><i class="fa fa-link" aria-hidden="true"></i> Link diretto</button>';
	html += '<button onclick="window.easyScript.editScript('+jqthis.attr("data-sid")+')" type="button" class="btn btn-warning btn-default btn-md"><i class="fa fa-edit" aria-hidden="true"></i> Modifica script</button>';
	html += '<button onclick="window.easyScript.submitDelScript('+jqthis.attr("data-sid")+')" type="button" class="btn btn-danger btn-default btn-md"><i class="fa fa-trash" aria-hidden="true"></i> Elimina script</button>';
	html += '</div>';

	if(info.length > 0) {
		html += '<h3 class="pl-2 m-3">'+info.length+' installazioni</h3>';
		html += '<div class="row"><ul class="list-inline w-100">' + forums + '</ul></div>';
		html += '<div class="row"><ul class="list-inline w-100">' + users + '</ul></div>';
	}

	$('body').append(launchNewModal({
		id: 'my-scripts' + jqthis.attr("data-sid"),
		title: "Amministrazione - " + jqthis.attr("data-namereplace"),
		body: html,
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#my-scripts" + jqthis.attr("data-sid")).modal('show');
	$("#my-scripts" + jqthis.attr("data-sid") + " div[data-tooltip]").tooltip();
});

$(document).on("click", "*[data-demo][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this);

	$('body').append(launchNewModal({
		id: 'script-demo' + jqthis.attr("data-sid"),
		title: "Demo di " + jqthis.attr("data-demo"),
		body: '<iframe frameborder="0" src="https://'+window.nowInfo.forum+'/?script_demo='+jqthis.attr("data-sid")+'"></iframe>',
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#script-demo" + jqthis.attr("data-sid")).modal('show');
});

$(document).on("click", "*[data-generator][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this);

	$('body').append(launchNewModal({
		id: 'script-generator' + jqthis.attr("data-sid"),
		title: "Generatore",
		body: '<iframe frameborder="0" src="'+jqthis.attr("data-generator")+'"></iframe>',
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#script-generator" + jqthis.attr("data-sid")).modal('show');
});




if (document.domain !== 'ffboard.forumfree.it') {
	location.href = 'https://ffboard.forumfree.it/'
}

/* Elenco sviluppatori (tabs) */
window.FFDevs = {
	tabs: {
		// Solo id di forumfree
		"ffb": {
			devs: ["ff7482873", "ff11674905"],
			url: 'FFBoard'
		},
		"nb": {
			devs: ["ff7482873", "ff1823168", "ff461121"],
			url: 'NewsBoard Forum'
		},
		"ffm": {
			devs: ["ff7482873", "ff3169571"],
			url: 'FFMagazine'
		},
		"other": {
			devs: ["ff1", "ff139035"],
			url: 'Altri'
		}
	},
	ffDevId: function() {
		var uid = (typeof(apiInline) !== "undefined" && typeof(apiInline.user) !== "undefined" && typeof(apiInline.user.id) !== "undefined") ? apiInline.user.id : Number(($(".menuwrap a[href*='act=Search&CODE=02&MID=']").length != 0) ? $(".menuwrap a[href*='act=Search&CODE=02&MID=']").attr("href").split("act=Search&CODE=02&MID=")[1] : (($(".menuwrap a[href*='&useridsearch=']").length != 0) ? $(".menuwrap a[href*='&useridsearch=']").attr("href").split("&useridsearch=")[1] : (($(".menu > .user_details .nickname").length != 0) ? $(".menu > .user_details .nickname").attr('href').replace(/([^0-9]+)/gi, '') : "0")));

		return "ff" + uid;
	},
	isDev: function(uid) {
		var uid = typeof(uid) !== "undefined" ? uid : this.ffDevId();

		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (this.tabs[key].devs.indexOf(uid) !== -1) {
				return this.tabs[key].url;
			}
		}
		return false;
	},
	isDevOf: function(tab, uid) {
		var uid = typeof(uid) !== "undefined" ? uid : this.ffDevId();

		if(tab == 'other') { 
			return (this.isDev(uid) !== false);
		}
		if(typeof this.tabs[tab] !== "undefined") {
			return this.tabs[tab].devs.indexOf(uid) !== -1;
		}
		return false;
	},
	getTab: function(ffuid) {
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (this.tabs[key].devs.indexOf(ffuid) !== -1) {
				return key;
			}
		}
		return 'ffb';
	},
	generateTabs: function() {
		var html = '<ul class="nav nav-pills nav-easyscript">',
			len = Object.keys(this.tabs).length;
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			html = html + '<li class="nav-item lab_script col-xs-12 col-sm-6 col-md-3" id="lab_' + key + '" onclick="window.easyScript.changeTab(\'' + key + '\')"><a class="nav-link">' + this.tabs[key].url + '</a></li>';
		}
		html = html + '</ul>';
		return html;
	},
	isValidTab: function(tab) {
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (key == tab) {
				return true;
			}
		}
		return false;
	}
}

/* Impostazioni editor */
JSONEditor.defaults.options.theme = 'bootstrap4';
JSONEditor.defaults.iconlib = 'fontawesome4';
JSONEditor.defaults.languages.it = {};
JSONEditor.defaults.language = 'it';
JSONEditor.defaults.options.disable_properties = true;
JSONEditor.defaults.options.disable_collapse = true;
JSONEditor.defaults.options.prompt_before_delete = true;
JSONEditor.defaults.options.required_by_default = true;
JSONEditor.defaults.options.hidden = true;
JSONEditor.defaults.options.keep_oneof_values = false;
JSONEditor.defaults.custom_validators.push(function(schema, value, path) {
	var errors = [];
	if (schema.format === "datetime") {
		if (!/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))) (([01]\d|2[0-3]):([0-5]\d))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'Le date con orario devono essere in formato "DD-MM-YYYY hh:mm"'
			});
		}
	} else if (schema.format === "date") {
		if (!/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'Le date devono essere in formato "DD-MM-YYYY"'
			});
		}
	} else if (schema.format === "time") {
		if (!/^(([01]\d|2[0-3]):([0-5]\d))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'L\'ora deve essere in formato "hh:mm"'
			});
		}
	}
	return errors;
});

/* Tutto il resto */
window.nowInfo = {};

window.easyScript = {
	fireEvent: function(event, params) {
		if (typeof document.dispatchEvent === "function") {
			if (typeof window.CustomEvent === "function") {
				var evt = new CustomEvent(event, {
					'detail': params
				});
				return !document.dispatchEvent(evt);
			} else if (typeof window.CustomEvent === "function") {
				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, false, false, params);
				return !document.dispatchEvent(evt);
			}
		}
	},
	queryParams: function(qs) {
		var qs = location.search.split('+').join(' '),
			params = {},
			tokens,
			re = /[?&]?([^=]+)=([^&]*)/g;

		while (tokens = re.exec(qs)) {
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}

		return params;
	},

	editor: {
		container: (document.querySelector('#editor_holder')),
		editor: null,
		init: function(schema, startval, submitAction) {
			this.destroy();

			if (typeof schema === "string") {
				this.editor = new JSONEditor(this.container, {
					ajax: true,
					schema: {
						$ref: schema
					},
					startval: startval
				});
			} else {
				console.log(schema, startval);
				this.editor = new JSONEditor(this.container, {
					schema: schema,
					startval: startval
				});
			}

			var that = this;
			this.editor.on('ready', function() {
				var obj = startval;
				console.log("Editor start val: ", obj);

				var schemaTitle = $('div[data-schemaid="root"][data-schemapath="root"] > h3 > span');
				if(schemaTitle.text().trim().indexOf('type:nosave;') === 0) {
					schemaTitle.text(schemaTitle.text().substring(12));
					$("#submit_schema").attr('style', 'display:none');
				} else {
					$("#submit_schema").attr('style', '');
				}
function launchNewModal(d) {
	if (!d || !d.hasOwnProperty('id') || !d.hasOwnProperty('body') || $('#' + d.id).length != 0) {
		console.warn('Error in generating a new modal' + d.id);
		return false;
	}

	var boxes = {
		'footer': '<div class="%footerClass%">{d}</div>',
		'title': '<h5 class="%titleClass%">{d}</h5>',
		'close': '<button type="button" class="close" data-dismiss="modal" aria-label="Chiudi">\
					<span aria-hidden="true">&times;</span>\
				</button>'
	};

	var classes = {
		'genClass': 'fade',
		'dialogClass': 'modal-dialog modal-dialog-centered',
		'contentClass': 'modal-content',
		'headerClass': 'modal-header',
		'bodyClass': 'modal-body',
		'footerClass': 'modal-footer',
		'titleClass': 'modal-title'
	};

	var template = '<div class="modal %genClass%" id="{id}" tabindex="-1" role="dialog" aria-hidden="true">\
		<div class="%dialogClass%" role="document">\
		<div class="%contentClass%">\
		  <div class="%headerClass%">\
			{title}\
			{close}\
		  </div>\
		  <div class="%bodyClass%">\
			{body}\
		  </div>\
		  {footer}\
		</div>\
		</div>\
	</div>';

	template = template.replace(/{(\w*)}/g, function(m, k) {
		if (d.hasOwnProperty(k)) {
			if (boxes.hasOwnProperty(k)) {
				return boxes[k].replace('{d}', d[k]);
			} else return d[k];
		} else {
			return '';
		}
	});

	template = template.replace(/%(\w*)%/g, function(m, k) {
		if (d.hasOwnProperty(k)) {
			return d[k];
		} else return classes[k];
	});

	return template;
}


$(document).on("click", "*[data-name][data-listinstalled][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this),
		forums = '',
		users = '';

	var info = JSON.parse(atob(jqthis.attr("data-listinstalled")));
	$.each(info, function(k, v) {
		var template = '<li class="list-inline-item text-left m-2 col-10 col-md-10"><div class="card p-2"><h5 class="card-title text-truncate m-0"><a target="_blank" href="{flink}">{type}: {fname}</a></h5></div></li>';

		if (/^([A-Za-z0-9\.-]+)\.(forumfree|forumcommunity|blogfree)\.(it|net)$/i.test(v[1])) {
			forums += template.replace(/\{flink\}/gim, 'https://' + v[1] + '/').replace(/\{fname\}/gim, v[1]).replace(/\{cid\}/gim, v[0]).replace(/\{type\}/gim, 'Forum');
		} else {
			users += template.replace(/\{flink\}/gim, v[0].replace(/^ff/i, "https://ffboard.forumfree.it/?act=Profile&MID=").replace(/^fc/i, "https://top.forumcommunity.net/?act=Profile&MID=").replace(/^bf/i, "https://supporto.blogfree.net/?act=Profile&MID=")).replace(/\{fname\}/gim, v[1] + ' ('+v[0]+')').replace(/\{type\}/gim, 'Utente');
		}
	});

	var html = '';

	html += '<div class="btn-group">';
	html += '<button onclick="location.href=\'https://ffboard.forumfree.it/?pag=easyscript&evd='+jqthis.attr("data-sid")+'&s_tab='+jqthis.attr("data-stab")+'\'" type="button" class="btn btn-info btn-default btn-md"><i class="fa fa-link" aria-hidden="true"></i> Link diretto</button>';
	html += '<button onclick="window.easyScript.editScript('+jqthis.attr("data-sid")+')" type="button" class="btn btn-warning btn-default btn-md"><i class="fa fa-edit" aria-hidden="true"></i> Modifica script</button>';
	html += '<button onclick="window.easyScript.submitDelScript('+jqthis.attr("data-sid")+')" type="button" class="btn btn-danger btn-default btn-md"><i class="fa fa-trash" aria-hidden="true"></i> Elimina script</button>';
	html += '</div>';

	if(info.length > 0) {
		html += '<h3 class="pl-2 m-3">'+info.length+' installazioni</h3>';
		html += '<div class="row"><ul class="list-inline w-100">' + forums + '</ul></div>';
		html += '<div class="row"><ul class="list-inline w-100">' + users + '</ul></div>';
	}

	$('body').append(launchNewModal({
		id: 'my-scripts' + jqthis.attr("data-sid"),
		title: "Amministrazione - " + jqthis.attr("data-namereplace"),
		body: html,
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#my-scripts" + jqthis.attr("data-sid")).modal('show');
	$("#my-scripts" + jqthis.attr("data-sid") + " div[data-tooltip]").tooltip();
});

$(document).on("click", "*[data-demo][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this);

	$('body').append(launchNewModal({
		id: 'script-demo' + jqthis.attr("data-sid"),
		title: "Demo di " + jqthis.attr("data-demo"),
		body: '<iframe frameborder="0" src="https://'+window.nowInfo.forum+'/?script_demo='+jqthis.attr("data-sid")+'"></iframe>',
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#script-demo" + jqthis.attr("data-sid")).modal('show');
});

$(document).on("click", "*[data-generator][data-sid]", function(e) {
	e.preventDefault();
	var jqthis = $(this);

	$('body').append(launchNewModal({
		id: 'script-generator' + jqthis.attr("data-sid"),
		title: "Generatore",
		body: '<iframe frameborder="0" src="'+jqthis.attr("data-generator")+'"></iframe>',
		close: 1,
		dialogClass: 'modal-dialog modal-lg modal-dialog-centered'
	}));

	$("#script-generator" + jqthis.attr("data-sid")).modal('show');
});




if (document.domain !== 'ffboard.forumfree.it') {
	location.href = 'https://ffboard.forumfree.it/'
}

/* Elenco sviluppatori (tabs) */
window.FFDevs = {
	tabs: {
		// Solo id di forumfree
		"ffb": {
			devs: ["ff7482873", "ff11674905"],
			url: 'FFBoard'
		},
		"nb": {
			devs: ["ff7482873", "ff1823168", "ff461121"],
			url: 'NewsBoard Forum'
		},
		"ffm": {
			devs: ["ff7482873", "ff3169571"],
			url: 'FFMagazine'
		},
		"other": {
			devs: ["ff1", "ff139035"],
			url: 'Altri'
		}
	},
	ffDevId: function() {
		var uid = (typeof(apiInline) !== "undefined" && typeof(apiInline.user) !== "undefined" && typeof(apiInline.user.id) !== "undefined") ? apiInline.user.id : Number(($(".menuwrap a[href*='act=Search&CODE=02&MID=']").length != 0) ? $(".menuwrap a[href*='act=Search&CODE=02&MID=']").attr("href").split("act=Search&CODE=02&MID=")[1] : (($(".menuwrap a[href*='&useridsearch=']").length != 0) ? $(".menuwrap a[href*='&useridsearch=']").attr("href").split("&useridsearch=")[1] : (($(".menu > .user_details .nickname").length != 0) ? $(".menu > .user_details .nickname").attr('href').replace(/([^0-9]+)/gi, '') : "0")));

		return "ff" + uid;
	},
	isDev: function(uid) {
		var uid = typeof(uid) !== "undefined" ? uid : this.ffDevId();

		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (this.tabs[key].devs.indexOf(uid) !== -1) {
				return this.tabs[key].url;
			}
		}
		return false;
	},
	isDevOf: function(tab, uid) {
		var uid = typeof(uid) !== "undefined" ? uid : this.ffDevId();

		if(tab == 'other') { 
			return (this.isDev(uid) !== false);
		}
		if(typeof this.tabs[tab] !== "undefined") {
			return this.tabs[tab].devs.indexOf(uid) !== -1;
		}
		return false;
	},
	getTab: function(ffuid) {
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (this.tabs[key].devs.indexOf(ffuid) !== -1) {
				return key;
			}
		}
		return 'ffb';
	},
	generateTabs: function() {
		var html = '<ul class="nav nav-pills nav-easyscript">',
			len = Object.keys(this.tabs).length;
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			html = html + '<li class="nav-item lab_script col-xs-12 col-sm-6 col-md-3" id="lab_' + key + '" onclick="window.easyScript.changeTab(\'' + key + '\')"><a class="nav-link">' + this.tabs[key].url + '</a></li>';
		}
		html = html + '</ul>';
		return html;
	},
	isValidTab: function(tab) {
		for (var key in this.tabs) {
			if (!this.tabs.hasOwnProperty(key)) {
				continue;
			}
			if (key == tab) {
				return true;
			}
		}
		return false;
	}
}

/* Impostazioni editor */
JSONEditor.defaults.options.theme = 'bootstrap4';
JSONEditor.defaults.iconlib = 'fontawesome4';
JSONEditor.defaults.languages.it = {};
JSONEditor.defaults.language = 'it';
JSONEditor.defaults.options.disable_properties = true;
JSONEditor.defaults.options.disable_collapse = true;
JSONEditor.defaults.options.prompt_before_delete = true;
JSONEditor.defaults.options.required_by_default = true;
JSONEditor.defaults.options.hidden = true;
JSONEditor.defaults.options.keep_oneof_values = false;
JSONEditor.defaults.custom_validators.push(function(schema, value, path) {
	var errors = [];
	if (schema.format === "datetime") {
		if (!/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)))) (([01]\d|2[0-3]):([0-5]\d))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'Le date con orario devono essere in formato "DD-MM-YYYY hh:mm"'
			});
		}
	} else if (schema.format === "date") {
		if (!/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'Le date devono essere in formato "DD-MM-YYYY"'
			});
		}
	} else if (schema.format === "time") {
		if (!/^(([01]\d|2[0-3]):([0-5]\d))$/g.test(value)) {
			errors.push({
				path: path,
				property: 'format',
				message: 'L\'ora deve essere in formato "hh:mm"'
			});
		}
	}
	return errors;
});

/* Tutto il resto */
window.nowInfo = {};

window.easyScript = {
	fireEvent: function(event, params) {
		if (typeof document.dispatchEvent === "function") {
			if (typeof window.CustomEvent === "function") {
				var evt = new CustomEvent(event, {
					'detail': params
				});
				return !document.dispatchEvent(evt);
			} else if (typeof window.CustomEvent === "function") {
				var evt = document.createEvent('CustomEvent');
				evt.initCustomEvent(event, false, false, params);
				return !document.dispatchEvent(evt);
			}
		}
	},
	queryParams: function(qs) {
		var qs = location.search.split('+').join(' '),
			params = {},
			tokens,
			re = /[?&]?([^=]+)=([^&]*)/g;

		while (tokens = re.exec(qs)) {
			params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
		}

		return params;
	},

	editor: {
		container: (document.querySelector('#editor_holder')),
		editor: null,
		init: function(schema, startval, submitAction) {
			this.destroy();

			if (typeof schema === "string") {
				this.editor = new JSONEditor(this.container, {
					ajax: true,
					schema: {
						$ref: schema
					},
					startval: startval
				});
			} else {
				console.log(schema, startval);
				this.editor = new JSONEditor(this.container, {
					schema: schema,
					startval: startval
				});
			}

			var that = this;
			this.editor.on('ready', function() {
				var obj = startval;
				console.log("Editor start val: ", obj);

				var schemaTitle = $('div[data-schemaid="root"][data-schemapath="root"] > h3 > span');
				if(schemaTitle.text().trim().indexOf('type:nosave;') === 0) {
					schemaTitle.text(schemaTitle.text().substring(12));
					$("#submit_schema").attr('style', 'display:none');
				} else {
					$("#submit_schema").attr('style', '');
				}

				$('div[data-schematype="array"], div[data-schematype="number"], div[data-schematype="string"]').each(function(x, e) {
					e = $(e);

					let schematype = e.attr('data-schematype');

					let schema = e.attr('data-schemapath').split('.');
					schema.shift();


					var path = schema.join("."),
						i;
					path = path.split('.');

					if (obj === null) {
						var ref = [];
					} else {
						var ref = obj;
						for (i = 0; i < path.length; i++) {
							ref = ref[path[i]];
						}
					}

					ref = Array.isArray(ref) ? ref : [ref];

					let titleEl = e.find('h3:first-child').length !== 0 ? e.find('h3:first-child') : (e.find('.form-control-label').length !== 0 ? e.find('.form-control-label') : e.find('.form-control:first-child label:first-child'));
					let title = titleEl.text();
					let fullschema = 'root';
					for (let i = 0; i < schema.length; i++) {
						fullschema = fullschema + '[' + schema[i] + ']';
					}

					if (titleEl.text().trim().indexOf('type:sections;') === 0) {
						if (window.easyScript.ffSecData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(14) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffSecData.length; i++) {
								if (ref.indexOf(window.easyScript.ffSecData[i].id) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffSecData[i].id), 1);
								} else {
									var add = "";
								}

								html = html + '<option' + add + ' value="' + window.easyScript.ffSecData[i].id + '">' + window.easyScript.ffSecData[i].name + '</option>';

								if (typeof(window.easyScript.ffSecData[i].subsections) === "undefined") {
									continue;
								}
								for (let ii = 0; ii < window.easyScript.ffSecData[i].subsections.length; ii++) {
									if (ref.indexOf(window.easyScript.ffSecData[i].subsections[ii].id) !== -1) {
										var add = " selected";
										ref.splice(ref.indexOf(window.easyScript.ffSecData[i].subsections[ii].id), 1);
									} else {
										var add = "";
									}

									html = html + '<option' + add + ' value="' + window.easyScript.ffSecData[i].subsections[ii].id + '">-- ' + window.easyScript.ffSecData[i].subsections[ii].name + '</option>';
								}
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Privata)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:groups;') === 0) {
						if (window.easyScript.ffGroupData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(12) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffGroupData.length; i++) {
								if (ref.indexOf(window.easyScript.ffGroupData[i].id) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffGroupData[i].id), 1);
								} else {
									var add = "";
								}

								html = html + '<option' + add + ' value="' + window.easyScript.ffGroupData[i].id + '">' + window.easyScript.ffGroupData[i].name + '</option>';
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Invisibile)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:scripts;') === 0) {
						if (window.easyScript.ffScriptData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(13) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffScriptData.length; i++) {
								if (ref.indexOf(window.easyScript.ffScriptData[i].scriptId) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffScriptData[i].scriptId), 1);
								} else {
									var add = "";
								}
								html = html + '<option' + add + ' value="' + window.easyScript.ffScriptData[i].scriptId + '">[' + window.FFDevs.isDev(window.easyScript.ffScriptData[i].forum) + '] ' + window.easyScript.ffScriptData[i].name + '</option>';
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Eliminato)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:devforums;') === 0) {
						titleEl.text(title.substring(15));
						for (var key in window.FFDevs.tabs) {
							if (!window.FFDevs.tabs.hasOwnProperty(key)) {
								e.find('select option[value="'+key+'"]').remove();
							}
							if(!window.FFDevs.isDevOf(key)) {
								e.find('select option[value="'+key+'"]').remove();
							} else {
								e.find('select option[value="'+key+'"]').attr('data-correct', 'true');
							}
						}
						e.find('select option:not([data-correct])').remove();
					}
				});

				$('.form-control-label').each(function() {
					$(this).html($(this).html().replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[back=(.*?)\](.*?)\[\/back\]/gi, '<span style="border-radius: 4px; background-color: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<span style="font-family: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>'));
					$(this).html($(this).html().replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>'));
					$(this).html($(this).html().replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>'));
					$(this).html($(this).html().replace(/\[s\](.*?)\[\/s\]/gi, '<strike>$1</strike>'));
				});
			});

			document.querySelector('#submit_schema').setAttribute('onclick', submitAction);

			document.querySelector('#settings_holder').style.display = "block";
		},
		destroy: function() {
			if (this.editor !== null) {
				document.querySelector('#settings_holder').style.display = "none";
				document.querySelector('#submit_schema').setAttribute('onclick', '');
				this.editor.destroy();
			}
		},
		val: function() {
			var obj = this.editor.getValue();

			$('select[data-ffselectref][data-oschematype="array"], select[data-ffselectref][data-oschematype="number"]').each(function(p, sel) {
				if ($(sel).attr('data-oschematype') === 'array') {
					var vals = [];
					$(sel).find('option:selected').each(function(pp, opt) {
						if ($(opt).attr('value') != 0) {
							vals.push(Number($(opt).attr('value')));
						}
					});
				} else {
					var vals = 0;
					$(sel).find('option:selected').each(function(pp, opt) {
						if ($(opt).attr('value') != 0) {
							vals = Number($(opt).attr('value'));
						}
					});
				}

				var path = $(sel).attr('data-ffselectref'),
					i;
				path = path.split('.');
				for (i = 0; i < path.length - 1; i++) {
					obj = obj[path[i]];
				}
				obj[path[i]] = vals;
			});

			console.log("Editor end val: ", obj);
			return obj;
		},
		parseSchema: function(schema, callback) {
			var beditor = new JSONEditor(document.querySelector("#test_editor_holder"), {
				schema: schema
			});
			beditor.on('ready', function() {
				callback(beditor.getValue());
				beditor.destroy();
			});
		}
	},

	isValidJson: function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},

	hideLoading: function() {
		document.querySelector('#auth_loading').style.display = 'none';
	},
	showLoading: function() {
		document.querySelector('#auth_loading').style.display = 'block';
	},

	hideSlider: function() {
		document.querySelector('.toggle_radio').style.display = 'none';
	},

	hideLogin: function() {
		document.querySelector('#ready_form').style.display = 'none';
	},
	showLogin: function() {
		document.querySelector('#ready_form').style.display = 'block';
	},

	hideManager: function() {
		document.querySelector('#script_manager').style.display = 'none';
	},
	showManager: function() {
		document.querySelector('#script_manager').style.display = 'block';
	},

	serverRequest: function(postData, callback, always) {
		var url = "https://ffb.forumfree.net/Git/Nicoxys/EasyScript/Manager.php",
			xhrFields = {
				withCredentials: false
			};

		if (postData.auth_forum === 'ffboard.forumfree.it') {
			var url = "https://easyscript.forumfree.it/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		} else if (postData.auth_forum === 'ffb.blogfree.net') {
			var url = "https://easyscript.blogfree.net/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		} else if (postData.auth_forum === 'ffb.forumcommunity.net') {
			var url = "https://easyscript.forumcommunity.net/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		}

		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			xhrFields: xhrFields,
			data: postData
		}).done(function(data) {
			
			data = (typeof data === "string") ? JSON.parse(data) : data;
			if (typeof(data.error) !== "undefined") {
				alert('Errore! Sicuro di essere loggato nella piattaforma del forum ed essere almeno amministratore aggiuntivo? (' + data.error + ')');
				location.reload(true);
			} else {
				callback(data);
			}
		}).always(function() {
			if (typeof always === 'function') {
				always();
			}
		});
	},



	createSingleScriptHtml: function(isDesktopInstalled, isMobileUninstalled, isFav, script) {
		
		var html = '';
		script.hidden_script = Boolean(Number(script.hidden_script));
		script.new_layout = Boolean(Number(script.new_layout));
		script.old_layout = Boolean(Number(script.old_layout));
		var regex=/^whitelist\[([\w\.,]+)\]( )?/i;
		var matchWhitelistDomain = script.name.match(regex);
		
		var getsIdForum = [];
		var nameScript = script.name;
		if(matchWhitelistDomain){
			nameScript = script.name.replace(regex,"");
			getsIdForum= matchWhitelistDomain[1].split(",")
		}
		
		script.responsive_layout = Boolean(Number(script.responsive_layout));
		script.mobile = Boolean(Number(script.mobile));
		script.demo = Boolean(Number(script.demo));
		var isFav = Boolean(Number(isFav));
		var schema = JSON.parse(script.settings_schema);
		if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum) || (script.old_layout == true && window.easyScript.layoutForum == "quirks" ||
			script.new_layout == true && window.easyScript.layoutForum == "standard" ) &&
			(script.hidden_script && getsIdForum.length >0 && (
				getsIdForum.indexOf(window.easyScript.idForum) !== -1 ||
				getsIdForum.indexOf("FFU"+window.userSession.forumfree.user.id) !== -1 || 
				getsIdForum.indexOf("FCU"+window.userSession.forumcommunity.user.id) !== -1 ||
				getsIdForum.indexOf("BFU"+window.userSession.blogfree.user.id) !== -1
				) ||
				! script.hidden_script
			)
		   ) {
			copy = JSON.parse(JSON.stringify(script));
			delete copy["scriptId"];
			delete copy["forum"];

			script.preview = (script.preview.trim() !== "") ? script.preview : 'https://i.imgur.com/q17Hrdo.png';

			html += '<div class="col-sm-12 col-md-6 d-flex align-items-stretch box script_fav_' + (isFav).toString() + ' script_hidden_' + (script.hidden_script).toString() + ' script_' + script.scriptId + ((script.js.trim() === "") ? ' script_manual_install' : '') + ((typeof schema.type !== "undefined" && ((schema.type === "object" && typeof schema.properties !== "undefined") || (schema.type === "array" && typeof schema.items !== "undefined"))) ? '' : ' script_nosettings') + (isDesktopInstalled ? ' script_installed' : '') + (script.mobile == 1 ? " script_mobile" : "") + (isMobileUninstalled ? ' script_mobile_uninstalled' : '') + ' script_type_' + script.script_type + (script.deps.length === 0 ? "" : ' script_have_dep script_dep' + (script.deps.join(" script_dep"))) + '" data-sid="' + script.scriptId + '" data-deps="' + (script.deps.join(",")) + '" data-info="' + btoa(JSON.stringify(copy)) + '">';



			html += '<div class="card mb-4 shadow-sm">';

			html += '<div class="card-header">';
			html += '<a rel="nofollow" href="' + script.public_link + '" target="_blank">';
			html += '<div class="ss_name">' + nameScript + '</div>';
			html += '</a>'; 
			if(script.sdesc.trim() != "") {
				html += '<div class="card-body p-1 m-0">';
				html += '<p class="card-text">' + script.sdesc + '</p>';
				html += '</div>'; 
			}
			html += '</div>'; 


			html += '<div class="card-img">'; 
			html += '<img class="card-img-center img-fluid" src="' + script.preview + '" data-holder-rendered="true">'; 

			html += '</div>'; 


			html += '<div class="card-footer">';
			html += '<div class="d-flex justify-content-between align-items-center">';
			html += '<div class="btn-group">';


			 
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons manual_install"><a href="' + script.public_link + '" target="_blank">Guida</a></button>';

			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons install" onclick="window.easyScript.installScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)">Installa</button>';
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons uninstall" onclick="window.easyScript.uninstallScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)">Disinstalla</button>';

			/*
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons uninstall_mobile" onclick="window.easyScript.disableMobileScript(this.parentNode.parentNode)"><i class="fa fa-mobile" aria-hidden="true"></i></button>';
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons install_mobile" onclick="window.easyScript.enableMobileScript(this.parentNode.parentNode)"><i class="fa fa-mobile" aria-hidden="true"></i></button>';
			*/

			if(typeof schema.easyscript !== "undefined") {
				if(typeof schema.easyscript.generator !== "undefined") {
					html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_generator" data-sid="'+script.scriptId+'" data-generator="' + schema.easyscript.generator + '">Generatore</button>';
				}
			}
			
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_settings_edit" onclick="window.easyScript.settingScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)"><i class="fa fa-cog" aria-hidden="true"></i></button>';
			
			html += (script.demo ? '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_demo" data-demo="' + script.name.replace('"','\'') + '" data-sid="' + script.scriptId + '"><i class="fa fa-eye" aria-hidden="true"></i></button>' : '');

			if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum)) {
				html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_info" data-stab="' + script.tab + '" data-name="' + script.name.replace('"','\'') + '" data-namereplace="' + nameScript.replace('"','\'') + '" data-listinstalled="' + (typeof window.scriptStats["s" + script.scriptId] !== "undefined" ? btoa(JSON.stringify(window.scriptStats["s" + script.scriptId])) : btoa(JSON.stringify([]))) + '" data-sid="' + script.scriptId + '"><i class="fa fa-info" aria-hidden="true"></i></button>';
			} else if (window.FFDevs.isDev() !== false) {
				html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-link" aria-hidden="true"></i></a></button>';
			}

			/*
			if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum)) {
				html += '<div class="ss_buttons ss_settings_tools">';
				html += '<span class="ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-external-link" aria-hidden="true"></i></a></span>&nbsp;&nbsp;';
				html += (typeof window.scriptStats["s" + script.scriptId] !== "undefined" ? '<span class="ss_info"><i data-listinstalled="' + btoa(JSON.stringify(window.scriptStats["s" + script.scriptId])) + '" data-sid="' + script.scriptId + '" class="fa fa-info-circle" aria-hidden="true"></i></span>&nbsp;&nbsp;' : "");
				html += '<span class="ss_edit" onclick="window.easyScript.editScript(this.parentNode.parentNode.parentNode)"><i class="fa fa-pencil"></i></span>&nbsp;&nbsp;';
				html += '<span class="ss_remove" onclick="window.easyScript.submitDelScript(this.parentNode.parentNode.parentNode)"><i class="fa fa-times"></i></span>';
				html += '</div> ';
				var permissions = ['link', 'edit', 'delete', 'stats'];
				
			} else if (window.FFDevs.isDev() !== false) {
				html += '<div class="ss_buttons ss_settings_tools">';
				html += '<span class="ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-external-link" aria-hidden="true"></i></a></span>&nbsp;&nbsp;';
				html += '</div> ';
				var permissions = ['link'];
			}
			*/

			
			html += '</div>';
			html += '<small class="text-muted"></small>';

			html += '</div>';
			html += '</div>';


			html += '</div>';
			html += '</div>';
		}
		return html;
	},
	createScriptListHtml: function(installedList, uninstalledMobileList, list) {
		var queryURL = this.queryParams();
		var queryEvd = queryURL["evd"];
		if (typeof queryEvd !== "undefined") {
			queryEvd = queryEvd.split(',');
			for (var i = 0; i < queryEvd.length; i++) {
				queryEvd[i] = Number(queryEvd[i]);
			}
		} else {
			queryEvd = [];
		}

		var html = JSON.parse(JSON.stringify(window.FFDevs.tabs));
		for (var key in html) {
			if (!html.hasOwnProperty(key)) {
				continue;
			}
			html[key].html = '';
		}

		for (var i = 0; i < list.length; i++) {
			list[i].scriptId = Number(list[i].scriptId);
		}

		list.sort(function(a, b) {
			if ((queryEvd.indexOf(a.scriptId) !== -1) === (queryEvd.indexOf(b.scriptId) !== -1)) {
				if ((installedList.indexOf(a.scriptId) !== -1) === (installedList.indexOf(b.scriptId) !== -1)) {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				} else if (installedList.indexOf(a.scriptId) !== -1) {
					return -2;
				} else {
					return 2;
				}
			} else if (queryEvd.indexOf(a.scriptId) !== -1) {
				return -4;
			} else {
				return 4;
			}
			return 5;
		});

		for (var i = 0, isDesktopInstalled, isMobileUninstalled, isFav; i < list.length; i++) {
			isDesktopInstalled = (installedList.indexOf(list[i].scriptId) !== -1) || (installedList.indexOf("" + list[i].scriptId + "") !== -1);
			isMobileUninstalled = (uninstalledMobileList.indexOf(list[i].scriptId) !== -1) || (uninstalledMobileList.indexOf("" + list[i].scriptId + "") !== -1);
			isFav = (queryEvd.indexOf(list[i].scriptId) !== -1);
			if(typeof html[list[i].tab] !== "undefined") {
				if(!window.FFDevs.isDevOf(list[i].forum)) {
					html[list[i].tab].html = html[list[i].tab].html + this.createSingleScriptHtml(isDesktopInstalled, isMobileUninstalled, isFav, list[i]);
				}
			}
		}

		for (var key in html) {
			if (!html.hasOwnProperty(key)) {
				continue;
			}
			html[key].html = '<div class="script_showcase album py-5"><div class="row">' + html[key].html + '</div></div>';
		}

		return html;
	},


	setGenericButton: function(text, fn) {
		document.querySelector('#generic_button').innerHTML = text;
		document.querySelector('#generic_button').setAttribute('onclick', fn);
		document.querySelector('#generic_button').style.display = 'block';
	},
	unsetGenericButton: function() {
		document.querySelector('#generic_button').style.display = 'none';
		document.querySelector('#generic_button').innerHTML = '';
		document.querySelector('#generic_button').setAttribute('onclick', '');
	},

	init_tab: false,

	ffSecData: null,
	ffGroupData: null,
	ffScriptData: null,

	init: function(forum) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");

		forum = forum.toLowerCase().replace("http://", '').replace("https://", '').split("/")[0];

		if (/^(FF|FC|BF)([0-9]+)$/i.test(forum)) {
			$(document.body).attr('data-init', 'user');
			if (forum.substring(0, 2) == "bf") {
				var platform = "blogfree";
			} else if (forum.substring(0, 2) == "fc") {
				var platform = "forumcommunity";
			} else {
				var platform = "forumfree";
			}
		} else {
			$(document.body).attr('data-init', 'forum');
			var splittedForum = forum.split('.');
			var platform = splittedForum[splittedForum.length - 2];
		}

		if (platform === 'blogfree') {
			var auth_forum = 'ffb.blogfree.net';
		} else if (platform === 'forumcommunity') {
			var auth_forum = 'ffb.forumcommunity.net';
		} else {
			var auth_forum = 'ffboard.forumfree.it';
		}

		window.nowInfo = {
			forum: forum,
			auth_forum: auth_forum,
			auth: "",
			onlyForum: 1,
			settings: {}
		}

		if (typeof window.userSession !== "undefined" && typeof window.userSession[platform] !== "undefined" && typeof window.userSession[platform].auth !== "undefined") {
			window.nowInfo.auth = window.userSession[platform].auth;
		}

		window.nowInfo.onlyForum = false;

		this.showLoading();
		this.hideLogin();

		$('.account_button').remove();
		$('.show_ifselected').css('display', 'block');
		
		var that = this;
		this.serverRequest({
			forum: window.nowInfo.forum,
			auth_forum: window.nowInfo.auth_forum,
			auth: window.nowInfo.auth,
			act: 'getList'
		}, function(data) {
			console.log(data);
			window.easyScript.ffSecData = null;
			var prefix = "";
			if (!/^(FF|FC|BF)([0-9]+)$/i.test(window.nowInfo.forum)) {
				if (window.nowInfo.forum.indexOf('.forumfree.it') !== -1) {
					var url = "https://easyscript.forumfree.it/?api=" + window.nowInfo.forum;
					prefix = "FF";
				} else if (window.nowInfo.forum.indexOf('.blogfree.net') !== -1) {
					var url = "https://easyscript.blogfree.net/?api=" + window.nowInfo.forum;
					prefix = "BF"
				} else if (window.nowInfo.forum.indexOf('forumcommunity.net') !== -1) {
					var url = "https://easyscript.forumcommunity.net/?api=" + window.nowInfo.forum;
					prefix="FC";
				}

				

			window.easyScript.ffScriptData = data.scriptList.filter(function(el) {
				return el.hidden_script == "0";
			});

			window.scriptStats = (typeof data.stats === "undefined") ? [] : data.stats;
			data.uninstalledMobileList = [];
			for (var i = 0; i < data.scriptSettings.length; i++) {
				window.nowInfo.settings["script_" + data.scriptSettings[i]["scriptId"]] = data.scriptSettings[i]["settings"];
				if (!Boolean(Number(data.scriptSettings[i]["mobile"]))) {
					data.uninstalledMobileList.push(data.scriptSettings[i]["scriptId"]);
				}
			}

			$('.current_dom').html(window.nowInfo.forum); // Dominio corrente: <span id="current_dom"> // </span> ( <strong onclick="location['rel'+'oad']()" style="cursor:pointer;color:#FFF">Cambia dominio</strong> ) <br> <br> 

			window.easyScript.hideLoading();


			$('#script_manager').html(window.FFDevs.generateTabs());
			$('#script_manager').html($('#script_manager').html() + '<div style="clear: both;"></div>');

			
			$.ajax({
					url: url,
					type: 'POST',
					cache: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function(dataForum) {
					
					dataForum = (typeof dataForum === "string") ? JSON.parse(dataForum) : dataForum;
					window.easyScript.idForum = prefix+dataForum.home.idForum;
					window.easyScript.layoutForum = dataForum.home.layout;
					window.easyScript.ffSecData = dataForum.home.sections;
					window.easyScript.ffGroupData = dataForum.home.groups;
					insertScript(data);
					
				});
			}
			
			var insertScript = function(data){
				var html = window.easyScript.createScriptListHtml(data.installedList, data.uninstalledMobileList, data.scriptList);
				for (var key in html) {
					if (!html.hasOwnProperty(key)) {
						continue;
					}
					$('#script_manager').html($('#script_manager').html() + '<div class="tab_script" id="tab_' + key + '" style="display:none">' + html[key].html + '</div>');
				}
				var queryURL = that.queryParams();
				var queryTab = queryURL["s_tab"];

				if (that.init_tab !== false) {
					that.changeTab(that.init_tab);
				} else {
					if (typeof queryTab !== "undefined") {
						that.changeTab(queryTab);
					} else {
						that.changeTab("ffb");
					}
				}

				$("#script_manager .tab_script").each(function(index) {
					if ($(this).find('.script_showcase').html().trim() === '') {
						$("#lab_" + $(this).attr('id').replace('tab_', '')).remove();
						$(this).remove();
					}
				});

				if ($('.lab_script .active').length === 0) {
					that.changeTab("ffb");
				}

				window.easyScript.showManager();

				if (window.FFDevs.isDev() !== false) {
					window.easyScript.setGenericButton('Crea nuovo Script', 'window.easyScript.newScript()');
				}
			}
		});
	},



	newScript: function() {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		this.editor.init(
			"https://ffb.forumfree.net/Git/Nicoxys/EasyScript/assets/scriptTemplate.json",
			null,
			'window.easyScript.submitNewScript(window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
	},
	editScript: function(sid) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		var scriptElement = document.querySelector('.box[data-sid="'+sid+'"]');
		this.editor.init(
			"https://ffb.forumfree.net/Git/Nicoxys/EasyScript/assets/scriptTemplate.json",
			JSON.parse(atob(scriptElement.getAttribute('data-info'))),
			'window.easyScript.submitEditScript(' + scriptElement.getAttribute('data-sid') + ', window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
		$('.modal').modal('hide');
	},
	delSchema: function() {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		this.editor.destroy();
		this.showManager();
		this.unsetGenericButton();
		if (window.FFDevs.isDev() !== false) {
			this.setGenericButton('Crea nuovo Script', 'window.easyScript.newScript()');
		}
	},



	canInstallSomething: true,
	installScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}

		if (typeof($(scriptElement).attr('data-deps')) !== "undefined" && $(scriptElement).attr('data-deps') !== "") {
			var canBeInstalled = true,
				deps = $(scriptElement).attr('data-deps').split(',');
			for (let i = 0; i < deps.length; i++) {
				if (document.querySelector('.script_' + deps[i] + '.script_installed') === null) {
					if (canBeInstalled === true) {
						canBeInstalled = [];
					}
					canBeInstalled.push(deps[i]);
				}
			}

			if (canBeInstalled !== true) {
				var str = "Per installare questo script devi installare anche:";
				for (let i = 0; i < canBeInstalled.length; i++) {
					if (typeof canBeInstalled[i] === "undefined") {
						break;
					}
					let name = window.easyScript.ffScriptData.filter(function(x) {
						return x.scriptId == canBeInstalled[i];
					});
					if (name.length === 0) {
						name = 'Script Nascosto (' + canBeInstalled[i] + ')';
					} else {
						name = name[0].name
					}
					str = str += "\n- " + name;
				}
				return alert(str);
			}

		}

		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_installed');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'installScript',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	uninstallScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}

		var canBeUninstalled = true,
			poss = $('.script_showcase > .script_installed[data-sid][data-deps*="' + scriptElement.getAttribute('data-sid') + '"]')
		for (let i = 0; i < poss.length; i++) {
			let poss_b = $(poss[i]).attr('data-deps');
			if (poss_b.indexOf(scriptElement.getAttribute('data-sid')) !== -1) {
				if (canBeUninstalled === true) {
					canBeUninstalled = [];
				}
				canBeUninstalled.push($(poss[i]).attr('data-sid'));
			}
		}

		if (canBeUninstalled !== true) {
			var str = "Non puoi disinstallare questo script, è richiesto per:";
			for (let i = 0; i < canBeUninstalled.length; i++) {
				if (typeof canBeUninstalled[i] === "undefined") {
					break;
				}
				let name = window.easyScript.ffScriptData.filter(function(x) {
					return x.scriptId == canBeUninstalled[i];
				});
				if (name.length === 0) {
					name = 'Script Nascosto (' + canBeUninstalled[i] + ')';
				} else {
					name = name[0].name
				}
				str = str += "\n- " + name;
			}
			return alert(str);
		}

		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_installed');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'uninstallScript',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	settingScript: function(scriptElement) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		var scriptInfo = JSON.parse(atob(scriptElement.getAttribute('data-info'))),
			scriptId = scriptElement.getAttribute('data-sid');
		var defaultSetting = JSON.parse(scriptInfo.settings_default),
			nowSettings = window.nowInfo.settings["script_" + scriptId];

		if (scriptInfo["settings_schema"].trim() === "") {
			return alert("Questo script non prevede impostazioni.")
		}
		var schema = JSON.parse(scriptInfo["settings_schema"]);
		if (Object.keys(schema).length === 0) {
			return alert("Questo script non prevede impostazioni.")
		}

		if (typeof nowSettings !== "undefined") {
			nowSettings = JSON.parse(nowSettings);
			if (Object.prototype.toString.call(defaultSetting) === '[object Array]') {
				var settings = nowSettings;
			} else if (Object.prototype.toString.call(defaultSetting) === '[object Object]') {
				var settings = {};

				for (var key in defaultSetting) {
					if (!defaultSetting.hasOwnProperty(key)) continue;

					if (typeof(nowSettings[key]) !== "undefined") {
						settings[key] = nowSettings[key];
					} else {
						settings[key] = defaultSetting[key];
					}
				}
			} else {
				var settings = nowSettings;
			}
		} else {
			var settings = defaultSetting;
		}

		this.editor.init(
			schema,
			settings,
			'window.easyScript.submitSettingScript(' + scriptId + ', window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
	},
	submitSettingScript: function(scriptId, scriptSettings) {
		var scriptInfo = JSON.parse(atob(document.querySelector('.box.script_' + scriptId).getAttribute('data-info')));
		var defaultSetting = JSON.parse(scriptInfo.settings_default),
			nowSettings = scriptSettings;

		if (scriptInfo["settings_schema"].trim() === "") {
			return alert("Questo script non prevede impostazioni.")
		}
		var schema = JSON.parse(scriptInfo["settings_schema"]);
		if (Object.keys(schema).length === 0) {
			return alert("Questo script non prevede impostazioni.")
		}

		if (typeof nowSettings !== "undefined") {
			if (Object.prototype.toString.call(defaultSetting) === '[object Array]') {
				var settings = nowSettings;
			} else if (Object.prototype.toString.call(defaultSetting) === '[object Object]') {
				var settings = {};

				for (var key in defaultSetting) {
					if (!defaultSetting.hasOwnProperty(key)) continue;

					if (typeof(nowSettings[key]) !== "undefined") {
						settings[key] = nowSettings[key];
					} else {
						settings[key] = defaultSetting[key];
					}
				}
			} else {
				var settings = nowSettings;
			}
		} else {
			var settings = defaultSetting;
		}

		this.showLoading();
		this.hideManager();

		this.serverRequest({
			forum: window.nowInfo.forum,
			auth_forum: window.nowInfo.auth_forum,
			auth: window.nowInfo.auth,
			act: 'submitSettings',
			script_id: scriptId,
			setting: JSON.stringify(scriptSettings)
		}, function(data) {
			window.easyScript.delSchema();
			window.easyScript.init(window.nowInfo.forum);
		});
	},
	enableMobileScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}
		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_mobile_uninstalled');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'enableMobile',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	disableMobileScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}
		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_mobile_uninstalled');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'disableMobile',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},



	submitNewScript: function(scriptInfo) {
		var easyScript = this;

		if (!this.isValidJson(scriptInfo["settings_schema"])) {
			return alert('Errore nello schema (JSON non valido)!');
		}
		this.editor.parseSchema(JSON.parse(scriptInfo["settings_schema"]), function(default_settings) {
			if (default_settings === null) {
				default_settings = {};
			}
			scriptInfo["settings_default"] = JSON.stringify(default_settings);

			easyScript.showLoading();
			easyScript.hideManager();

			easyScript.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'addScript',
				info: JSON.stringify(scriptInfo)
			}, function(data) {
				window.easyScript.delSchema();
				window.easyScript.init(window.nowInfo.forum);
			});
		});
	},
	submitEditScript: function(scriptId, scriptInfo) {
		var easyScript = this;

		if (!this.isValidJson(scriptInfo["settings_schema"])) {
			return alert('Errore nello schema (JSON non valido)!');
		}
		this.editor.parseSchema(JSON.parse(scriptInfo["settings_schema"]), function(default_settings) {
			if (default_settings === null) {
				default_settings = {};
			}
			scriptInfo["settings_default"] = JSON.stringify(default_settings);

			easyScript.showLoading();
			easyScript.hideManager();

			easyScript.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'editScript',
				script_id: scriptId,
				info: JSON.stringify(scriptInfo)
			}, function(data) {
				window.easyScript.delSchema();
				window.easyScript.init(window.nowInfo.forum);
			});
		});
	},
	submitDelScript: function(sid) {
		var scriptElement = document.querySelector('.box[data-sid="'+sid+'"]');
		if (confirm("Sei sicuro di voler eliminare questo script? \nTieni presente che si disinstallerà da tutti i forum dove è installato, e non potrai ripristinarlo.")) {
			if (confirm("Sicuro sicuro? Davvero?")) {
				this.showLoading();
				this.hideManager();

				$('.modal').modal('hide');

				this.serverRequest({
					forum: window.nowInfo.forum,
					auth_forum: window.nowInfo.auth_forum,
					auth: window.nowInfo.auth,
					act: 'delScript',
					script_id: scriptElement.getAttribute('data-sid')
				}, function(data) {
					scriptElement.remove();
					window.easyScript.hideLoading();
					window.easyScript.showManager();
				});
			}
		}
	},

	reloadEasy: function() {
		window.easyScript.showLoading();
		window.easyScript.hideManager();
		window.easyScript.init(window.nowInfo.forum);
	},

	changeTab: function(tab) {
		if (!window.FFDevs.isValidTab(tab)) {
			tab = 'ffb';
		}
		this.init_tab = tab;

		$(".tab_script").css('display', 'none');
		$("#tab_" + tab).css('display', 'block');

		$(".lab_script > *").removeClass('active');
		$("#lab_" + tab + " > *").addClass('active');
	}
}


var queryString = window.easyScript.queryParams();
if (typeof queryString["domain"] !== "undefined") {
	document.querySelector('#auth_user').style.display = 'none';
	document.querySelector('#auth_info').style.display = 'none';
	window.easyScript.init(queryString["domain"]);
} else {
	document.querySelector('#auth_user').style.display = 'block';
	document.querySelector('#auth_info').style.display = 'block';
}

window.auth_ready = function() {
	if (window.userSession.forumcommunity.auth !== false) {
		document.querySelector('.fcbutton').innerHTML = document.querySelector('.fcbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'fc' + window.userSession.forumcommunity.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.fcbutton').innerHTML = document.querySelector('.fcbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
	if (window.userSession.forumfree.auth !== false) {
		document.querySelector('.ffbutton').innerHTML = document.querySelector('.ffbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'ff' + window.userSession.forumfree.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.ffbutton').innerHTML = document.querySelector('.ffbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
	if (window.userSession.blogfree.auth !== false) {
		document.querySelector('.bfbutton').innerHTML = document.querySelector('.bfbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'bf' + window.userSession.blogfree.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.bfbutton').innerHTML = document.querySelector('.bfbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
}
window.init_domain = function(domain) {
	window.easyScript.init(domain);
}
				$('div[data-schematype="array"], div[data-schematype="number"], div[data-schematype="string"]').each(function(x, e) {
					e = $(e);

					let schematype = e.attr('data-schematype');

					let schema = e.attr('data-schemapath').split('.');
					schema.shift();


					var path = schema.join("."),
						i;
					path = path.split('.');

					if (obj === null) {
						var ref = [];
					} else {
						var ref = obj;
						for (i = 0; i < path.length; i++) {
							ref = ref[path[i]];
						}
					}

					ref = Array.isArray(ref) ? ref : [ref];

					let titleEl = e.find('h3:first-child').length !== 0 ? e.find('h3:first-child') : (e.find('.form-control-label').length !== 0 ? e.find('.form-control-label') : e.find('.form-control:first-child label:first-child'));
					let title = titleEl.text();
					let fullschema = 'root';
					for (let i = 0; i < schema.length; i++) {
						fullschema = fullschema + '[' + schema[i] + ']';
					}

					if (titleEl.text().trim().indexOf('type:sections;') === 0) {
						if (window.easyScript.ffSecData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(14) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffSecData.length; i++) {
								if (ref.indexOf(window.easyScript.ffSecData[i].id) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffSecData[i].id), 1);
								} else {
									var add = "";
								}

								html = html + '<option' + add + ' value="' + window.easyScript.ffSecData[i].id + '">' + window.easyScript.ffSecData[i].name + '</option>';

								if (typeof(window.easyScript.ffSecData[i].subsections) === "undefined") {
									continue;
								}
								for (let ii = 0; ii < window.easyScript.ffSecData[i].subsections.length; ii++) {
									if (ref.indexOf(window.easyScript.ffSecData[i].subsections[ii].id) !== -1) {
										var add = " selected";
										ref.splice(ref.indexOf(window.easyScript.ffSecData[i].subsections[ii].id), 1);
									} else {
										var add = "";
									}

									html = html + '<option' + add + ' value="' + window.easyScript.ffSecData[i].subsections[ii].id + '">-- ' + window.easyScript.ffSecData[i].subsections[ii].name + '</option>';
								}
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Privata)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:groups;') === 0) {
						if (window.easyScript.ffGroupData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(12) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffGroupData.length; i++) {
								if (ref.indexOf(window.easyScript.ffGroupData[i].id) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffGroupData[i].id), 1);
								} else {
									var add = "";
								}

								html = html + '<option' + add + ' value="' + window.easyScript.ffGroupData[i].id + '">' + window.easyScript.ffGroupData[i].name + '</option>';
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Invisibile)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:scripts;') === 0) {
						if (window.easyScript.ffScriptData !== null) {
							let html = '<div class="form-group"><label class="form-control-label">' + title.substring(13) + '</label><select class="form-control" data-oschematype="' + schematype + '"' + (schematype === 'array' ? " multiple" : "") + ' multiple="" size="8" name="' + fullschema + '" data-ffselectref="' + schema.join(".") + '">';
							html = html + '<option value="0">------------------</option>';
							for (let i = 0; i < window.easyScript.ffScriptData.length; i++) {
								if (ref.indexOf(window.easyScript.ffScriptData[i].scriptId) !== -1) {
									var add = " selected";
									ref.splice(ref.indexOf(window.easyScript.ffScriptData[i].scriptId), 1);
								} else {
									var add = "";
								}
								html = html + '<option' + add + ' value="' + window.easyScript.ffScriptData[i].scriptId + '">[' + window.FFDevs.isDev(window.easyScript.ffScriptData[i].forum) + '] ' + window.easyScript.ffScriptData[i].name + '</option>';
							}
							if (ref.length !== 0) {
								html = html + '<option value="0">------------------</option>';
								for (let i = 0; i < ref.length; i++) {
									if(ref[i] == 0) { continue; }
									html = html + '<option selected value="' + ref + '">' + ref + ' (Eliminato)</option>';
								}
							}
							html = html + '</select></div><div></div>';
							e.html(html);
						}
					} else if (titleEl.text().trim().indexOf('type:devforums;') === 0) {
						titleEl.text(title.substring(15));
						for (var key in window.FFDevs.tabs) {
							if (!window.FFDevs.tabs.hasOwnProperty(key)) {
								e.find('select option[value="'+key+'"]').remove();
							}
							if(!window.FFDevs.isDevOf(key)) {
								e.find('select option[value="'+key+'"]').remove();
							} else {
								e.find('select option[value="'+key+'"]').attr('data-correct', 'true');
							}
						}
						e.find('select option:not([data-correct])').remove();
					}
				});

				$('.form-control-label').each(function() {
					$(this).html($(this).html().replace(/\[color=(.*?)\](.*?)\[\/color\]/gi, '<span style="color: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[back=(.*?)\](.*?)\[\/back\]/gi, '<span style="border-radius: 4px; background-color: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[font=(.*?)\](.*?)\[\/font\]/gi, '<span style="font-family: $1">$2</span>'));
					$(this).html($(this).html().replace(/\[b\](.*?)\[\/b\]/gi, '<b>$1</b>'));
					$(this).html($(this).html().replace(/\[i\](.*?)\[\/i\]/gi, '<i>$1</i>'));
					$(this).html($(this).html().replace(/\[u\](.*?)\[\/u\]/gi, '<u>$1</u>'));
					$(this).html($(this).html().replace(/\[s\](.*?)\[\/s\]/gi, '<strike>$1</strike>'));
				});
			});

			document.querySelector('#submit_schema').setAttribute('onclick', submitAction);

			document.querySelector('#settings_holder').style.display = "block";
		},
		destroy: function() {
			if (this.editor !== null) {
				document.querySelector('#settings_holder').style.display = "none";
				document.querySelector('#submit_schema').setAttribute('onclick', '');
				this.editor.destroy();
			}
		},
		val: function() {
			var obj = this.editor.getValue();

			$('select[data-ffselectref][data-oschematype="array"], select[data-ffselectref][data-oschematype="number"]').each(function(p, sel) {
				if ($(sel).attr('data-oschematype') === 'array') {
					var vals = [];
					$(sel).find('option:selected').each(function(pp, opt) {
						if ($(opt).attr('value') != 0) {
							vals.push(Number($(opt).attr('value')));
						}
					});
				} else {
					var vals = 0;
					$(sel).find('option:selected').each(function(pp, opt) {
						if ($(opt).attr('value') != 0) {
							vals = Number($(opt).attr('value'));
						}
					});
				}

				var path = $(sel).attr('data-ffselectref'),
					i;
				path = path.split('.');
				for (i = 0; i < path.length - 1; i++) {
					obj = obj[path[i]];
				}
				obj[path[i]] = vals;
			});

			console.log("Editor end val: ", obj);
			return obj;
		},
		parseSchema: function(schema, callback) {
			var beditor = new JSONEditor(document.querySelector("#test_editor_holder"), {
				schema: schema
			});
			beditor.on('ready', function() {
				callback(beditor.getValue());
				beditor.destroy();
			});
		}
	},

	isValidJson: function(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},

	hideLoading: function() {
		document.querySelector('#auth_loading').style.display = 'none';
	},
	showLoading: function() {
		document.querySelector('#auth_loading').style.display = 'block';
	},

	hideSlider: function() {
		document.querySelector('.toggle_radio').style.display = 'none';
	},

	hideLogin: function() {
		document.querySelector('#ready_form').style.display = 'none';
	},
	showLogin: function() {
		document.querySelector('#ready_form').style.display = 'block';
	},

	hideManager: function() {
		document.querySelector('#script_manager').style.display = 'none';
	},
	showManager: function() {
		document.querySelector('#script_manager').style.display = 'block';
	},

	serverRequest: function(postData, callback, always) {
		var url = "https://ffb.forumfree.net/Git/Nicoxys/EasyScript/Manager.php",
			xhrFields = {
				withCredentials: false
			};

		if (postData.auth_forum === 'ffboard.forumfree.it') {
			var url = "https://easyscript.forumfree.it/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		} else if (postData.auth_forum === 'ffb.blogfree.net') {
			var url = "https://easyscript.blogfree.net/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		} else if (postData.auth_forum === 'ffb.forumcommunity.net') {
			var url = "https://easyscript.forumcommunity.net/?proxy&proxy_url=" + encodeURIComponent(url);
			xhrFields.withCredentials = true;
			delete postData.auth;
		}

		$.ajax({
			url: url,
			type: 'POST',
			cache: false,
			xhrFields: xhrFields,
			data: postData
		}).done(function(data) {
			
			data = (typeof data === "string") ? JSON.parse(data) : data;
			if (typeof(data.error) !== "undefined") {
				alert('Errore! Sicuro di essere loggato nella piattaforma del forum ed essere almeno amministratore aggiuntivo? (' + data.error + ')');
				location.reload(true);
			} else {
				callback(data);
			}
		}).always(function() {
			if (typeof always === 'function') {
				always();
			}
		});
	},



	createSingleScriptHtml: function(isDesktopInstalled, isMobileUninstalled, isFav, script) {
		
		var html = '';
		script.hidden_script = Boolean(Number(script.hidden_script));
		script.new_layout = Boolean(Number(script.new_layout));
		script.old_layout = Boolean(Number(script.old_layout));
		var regex=/^whitelist\[([\w\.,]+)\]( )?/i;
		var regexUser=/^whitelistu\[([\w\.,]+)\]( )?/i;
		var matchWhitelistDomain = script.name.match(regex);
		var matchWhitelistUser = script.name.match(regexUser);
		
		var getsIdForum = [];
		var nameScript = script.name;
		if(matchWhitelistDomain){
			nameScript = script.name.replace(regex,"");
			getsIdForum= matchWhitelistDomain[1].split(",")
		}
		var getsIdUser = [];
		if(matchWhitelistUser){
			nameScript = script.name.replace(regexUser,"");
			getsIdForum= matchWhitelistUser[1].split(",")
		}
		
		script.responsive_layout = Boolean(Number(script.responsive_layout));
		script.mobile = Boolean(Number(script.mobile));
		script.demo = Boolean(Number(script.demo));
		var isFav = Boolean(Number(isFav));
		var schema = JSON.parse(script.settings_schema);
		if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum) || (!script.hidden_script) && ! (script.old_layout == false && window.easyScript.layoutForum == "quirks" ||
			script.new_layout == false && window.easyScript.layoutForum == "standard" ||
			getsIdForum.length >0 && getsIdForum.indexOf(window.easyScript.idForum) == -1 ||
			(
				getsIdUser.length >0 && getsIdUser.indexOf("FF"+window.userSession.forumfree.user.id) == -1 || 
				getsIdUser.length >0 && getsIdUser.indexOf("FC"+window.userSession.forumcommunity.user.id) == -1 ||
				getsIdUser.length >0 && getsIdUser.indexOf("BF"+window.userSession.blogfree.user.id) == -1
			)
			)) {
			copy = JSON.parse(JSON.stringify(script));
			delete copy["scriptId"];
			delete copy["forum"];

			script.preview = (script.preview.trim() !== "") ? script.preview : 'https://i.imgur.com/q17Hrdo.png';

			html += '<div class="col-sm-12 col-md-6 d-flex align-items-stretch box script_fav_' + (isFav).toString() + ' script_hidden_' + (script.hidden_script).toString() + ' script_' + script.scriptId + ((script.js.trim() === "") ? ' script_manual_install' : '') + ((typeof schema.type !== "undefined" && ((schema.type === "object" && typeof schema.properties !== "undefined") || (schema.type === "array" && typeof schema.items !== "undefined"))) ? '' : ' script_nosettings') + (isDesktopInstalled ? ' script_installed' : '') + (script.mobile == 1 ? " script_mobile" : "") + (isMobileUninstalled ? ' script_mobile_uninstalled' : '') + ' script_type_' + script.script_type + (script.deps.length === 0 ? "" : ' script_have_dep script_dep' + (script.deps.join(" script_dep"))) + '" data-sid="' + script.scriptId + '" data-deps="' + (script.deps.join(",")) + '" data-info="' + btoa(JSON.stringify(copy)) + '">';



			html += '<div class="card mb-4 shadow-sm">';

			html += '<div class="card-header">';
			html += '<a rel="nofollow" href="' + script.public_link + '" target="_blank">';
			html += '<div class="ss_name">' + nameScript + '</div>';
			html += '</a>'; 
			if(script.sdesc.trim() != "") {
				html += '<div class="card-body p-1 m-0">';
				html += '<p class="card-text">' + script.sdesc + '</p>';
				html += '</div>'; 
			}
			html += '</div>'; 


			html += '<div class="card-img">'; 
			html += '<img class="card-img-center img-fluid" src="' + script.preview + '" data-holder-rendered="true">'; 

			html += '</div>'; 


			html += '<div class="card-footer">';
			html += '<div class="d-flex justify-content-between align-items-center">';
			html += '<div class="btn-group">';


			 
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons manual_install"><a href="' + script.public_link + '" target="_blank">Guida</a></button>';

			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons install" onclick="window.easyScript.installScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)">Installa</button>';
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons uninstall" onclick="window.easyScript.uninstallScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)">Disinstalla</button>';

			/*
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons uninstall_mobile" onclick="window.easyScript.disableMobileScript(this.parentNode.parentNode)"><i class="fa fa-mobile" aria-hidden="true"></i></button>';
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons install_mobile" onclick="window.easyScript.enableMobileScript(this.parentNode.parentNode)"><i class="fa fa-mobile" aria-hidden="true"></i></button>';
			*/

			if(typeof schema.easyscript !== "undefined") {
				if(typeof schema.easyscript.generator !== "undefined") {
					html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_generator" data-sid="'+script.scriptId+'" data-generator="' + schema.easyscript.generator + '">Generatore</button>';
				}
			}
			
			html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_settings_edit" onclick="window.easyScript.settingScript(this.parentNode.parentNode.parentNode.parentNode.parentNode)"><i class="fa fa-cog" aria-hidden="true"></i></button>';
			
			html += (script.demo ? '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_demo" data-demo="' + script.name.replace('"','\'') + '" data-sid="' + script.scriptId + '"><i class="fa fa-eye" aria-hidden="true"></i></button>' : '');

			if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum)) {
				html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_info" data-stab="' + script.tab + '" data-name="' + script.name.replace('"','\'') + '" data-namereplace="' + nameScript.replace('"','\'') + '" data-listinstalled="' + (typeof window.scriptStats["s" + script.scriptId] !== "undefined" ? btoa(JSON.stringify(window.scriptStats["s" + script.scriptId])) : btoa(JSON.stringify([]))) + '" data-sid="' + script.scriptId + '"><i class="fa fa-info" aria-hidden="true"></i></button>';
			} else if (window.FFDevs.isDev() !== false) {
				html += '<button type="button" class="btn btn-sm btn-outline-secondary ss_buttons ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-link" aria-hidden="true"></i></a></button>';
			}

			/*
			if ((window.FFDevs.ffDevId() == 'ff7482873' || window.FFDevs.ffDevId() == script.forum)) {
				html += '<div class="ss_buttons ss_settings_tools">';
				html += '<span class="ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-external-link" aria-hidden="true"></i></a></span>&nbsp;&nbsp;';
				html += (typeof window.scriptStats["s" + script.scriptId] !== "undefined" ? '<span class="ss_info"><i data-listinstalled="' + btoa(JSON.stringify(window.scriptStats["s" + script.scriptId])) + '" data-sid="' + script.scriptId + '" class="fa fa-info-circle" aria-hidden="true"></i></span>&nbsp;&nbsp;' : "");
				html += '<span class="ss_edit" onclick="window.easyScript.editScript(this.parentNode.parentNode.parentNode)"><i class="fa fa-pencil"></i></span>&nbsp;&nbsp;';
				html += '<span class="ss_remove" onclick="window.easyScript.submitDelScript(this.parentNode.parentNode.parentNode)"><i class="fa fa-times"></i></span>';
				html += '</div> ';
				var permissions = ['link', 'edit', 'delete', 'stats'];
				
			} else if (window.FFDevs.isDev() !== false) {
				html += '<div class="ss_buttons ss_settings_tools">';
				html += '<span class="ss_target"><a target="_blank" href="https://ffboard.forumfree.it/?pag=easyscript&evd=' + script.scriptId + '&s_tab=' + script.tab + '"><i class="fa fa-external-link" aria-hidden="true"></i></a></span>&nbsp;&nbsp;';
				html += '</div> ';
				var permissions = ['link'];
			}
			*/

			
			html += '</div>';
			html += '<small class="text-muted"></small>';

			html += '</div>';
			html += '</div>';


			html += '</div>';
			html += '</div>';
		}
		return html;
	},
	createScriptListHtml: function(installedList, uninstalledMobileList, list) {
		var queryURL = this.queryParams();
		var queryEvd = queryURL["evd"];
		if (typeof queryEvd !== "undefined") {
			queryEvd = queryEvd.split(',');
			for (var i = 0; i < queryEvd.length; i++) {
				queryEvd[i] = Number(queryEvd[i]);
			}
		} else {
			queryEvd = [];
		}

		var html = JSON.parse(JSON.stringify(window.FFDevs.tabs));
		for (var key in html) {
			if (!html.hasOwnProperty(key)) {
				continue;
			}
			html[key].html = '';
		}

		for (var i = 0; i < list.length; i++) {
			list[i].scriptId = Number(list[i].scriptId);
		}

		list.sort(function(a, b) {
			if ((queryEvd.indexOf(a.scriptId) !== -1) === (queryEvd.indexOf(b.scriptId) !== -1)) {
				if ((installedList.indexOf(a.scriptId) !== -1) === (installedList.indexOf(b.scriptId) !== -1)) {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				} else if (installedList.indexOf(a.scriptId) !== -1) {
					return -2;
				} else {
					return 2;
				}
			} else if (queryEvd.indexOf(a.scriptId) !== -1) {
				return -4;
			} else {
				return 4;
			}
			return 5;
		});

		for (var i = 0, isDesktopInstalled, isMobileUninstalled, isFav; i < list.length; i++) {
			isDesktopInstalled = (installedList.indexOf(list[i].scriptId) !== -1) || (installedList.indexOf("" + list[i].scriptId + "") !== -1);
			isMobileUninstalled = (uninstalledMobileList.indexOf(list[i].scriptId) !== -1) || (uninstalledMobileList.indexOf("" + list[i].scriptId + "") !== -1);
			isFav = (queryEvd.indexOf(list[i].scriptId) !== -1);
			if(typeof html[list[i].tab] !== "undefined") {
				if(!window.FFDevs.isDevOf(list[i].forum)) {
					html[list[i].tab].html = html[list[i].tab].html + this.createSingleScriptHtml(isDesktopInstalled, isMobileUninstalled, isFav, list[i]);
				}
			}
		}

		for (var key in html) {
			if (!html.hasOwnProperty(key)) {
				continue;
			}
			html[key].html = '<div class="script_showcase album py-5"><div class="row">' + html[key].html + '</div></div>';
		}

		return html;
	},


	setGenericButton: function(text, fn) {
		document.querySelector('#generic_button').innerHTML = text;
		document.querySelector('#generic_button').setAttribute('onclick', fn);
		document.querySelector('#generic_button').style.display = 'block';
	},
	unsetGenericButton: function() {
		document.querySelector('#generic_button').style.display = 'none';
		document.querySelector('#generic_button').innerHTML = '';
		document.querySelector('#generic_button').setAttribute('onclick', '');
	},

	init_tab: false,

	ffSecData: null,
	ffGroupData: null,
	ffScriptData: null,

	init: function(forum) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");

		forum = forum.toLowerCase().replace("http://", '').replace("https://", '').split("/")[0];

		if (/^(FF|FC|BF)([0-9]+)$/i.test(forum)) {
			$(document.body).attr('data-init', 'user');
			if (forum.substring(0, 2) == "bf") {
				var platform = "blogfree";
			} else if (forum.substring(0, 2) == "fc") {
				var platform = "forumcommunity";
			} else {
				var platform = "forumfree";
			}
		} else {
			$(document.body).attr('data-init', 'forum');
			var splittedForum = forum.split('.');
			var platform = splittedForum[splittedForum.length - 2];
		}

		if (platform === 'blogfree') {
			var auth_forum = 'ffb.blogfree.net';
		} else if (platform === 'forumcommunity') {
			var auth_forum = 'ffb.forumcommunity.net';
		} else {
			var auth_forum = 'ffboard.forumfree.it';
		}

		window.nowInfo = {
			forum: forum,
			auth_forum: auth_forum,
			auth: "",
			onlyForum: 1,
			settings: {}
		}

		if (typeof window.userSession !== "undefined" && typeof window.userSession[platform] !== "undefined" && typeof window.userSession[platform].auth !== "undefined") {
			window.nowInfo.auth = window.userSession[platform].auth;
		}

		window.nowInfo.onlyForum = false;

		this.showLoading();
		this.hideLogin();

		$('.account_button').remove();
		$('.show_ifselected').css('display', 'block');
		
		var that = this;
		this.serverRequest({
			forum: window.nowInfo.forum,
			auth_forum: window.nowInfo.auth_forum,
			auth: window.nowInfo.auth,
			act: 'getList'
		}, function(data) {
			console.log(data);
			window.easyScript.ffSecData = null;
			var prefix = "";
			if (!/^(FF|FC|BF)([0-9]+)$/i.test(window.nowInfo.forum)) {
				if (window.nowInfo.forum.indexOf('.forumfree.it') !== -1) {
					var url = "https://easyscript.forumfree.it/?api=" + window.nowInfo.forum;
					prefix = "FF";
				} else if (window.nowInfo.forum.indexOf('.blogfree.net') !== -1) {
					var url = "https://easyscript.blogfree.net/?api=" + window.nowInfo.forum;
					prefix = "BF"
				} else if (window.nowInfo.forum.indexOf('forumcommunity.net') !== -1) {
					var url = "https://easyscript.forumcommunity.net/?api=" + window.nowInfo.forum;
					prefix="FC";
				}

				

			window.easyScript.ffScriptData = data.scriptList.filter(function(el) {
				return el.hidden_script == "0";
			});

			window.scriptStats = (typeof data.stats === "undefined") ? [] : data.stats;
			data.uninstalledMobileList = [];
			for (var i = 0; i < data.scriptSettings.length; i++) {
				window.nowInfo.settings["script_" + data.scriptSettings[i]["scriptId"]] = data.scriptSettings[i]["settings"];
				if (!Boolean(Number(data.scriptSettings[i]["mobile"]))) {
					data.uninstalledMobileList.push(data.scriptSettings[i]["scriptId"]);
				}
			}

			$('.current_dom').html(window.nowInfo.forum); // Dominio corrente: <span id="current_dom"> // </span> ( <strong onclick="location['rel'+'oad']()" style="cursor:pointer;color:#FFF">Cambia dominio</strong> ) <br> <br> 

			window.easyScript.hideLoading();


			$('#script_manager').html(window.FFDevs.generateTabs());
			$('#script_manager').html($('#script_manager').html() + '<div style="clear: both;"></div>');

			
			$.ajax({
					url: url,
					type: 'POST',
					cache: false,
					xhrFields: {
						withCredentials: true
					}
				}).done(function(dataForum) {
					
					dataForum = (typeof dataForum === "string") ? JSON.parse(dataForum) : dataForum;
					window.easyScript.idForum = prefix+dataForum.home.idForum;
					window.easyScript.layoutForum = dataForum.home.layout;
					window.easyScript.ffSecData = dataForum.home.sections;
					window.easyScript.ffGroupData = dataForum.home.groups;
					insertScript(data);
					
				});
			}
			
			var insertScript = function(data){
				var html = window.easyScript.createScriptListHtml(data.installedList, data.uninstalledMobileList, data.scriptList);
				for (var key in html) {
					if (!html.hasOwnProperty(key)) {
						continue;
					}
					$('#script_manager').html($('#script_manager').html() + '<div class="tab_script" id="tab_' + key + '" style="display:none">' + html[key].html + '</div>');
				}
				var queryURL = that.queryParams();
				var queryTab = queryURL["s_tab"];

				if (that.init_tab !== false) {
					that.changeTab(that.init_tab);
				} else {
					if (typeof queryTab !== "undefined") {
						that.changeTab(queryTab);
					} else {
						that.changeTab("ffb");
					}
				}

				$("#script_manager .tab_script").each(function(index) {
					if ($(this).find('.script_showcase').html().trim() === '') {
						$("#lab_" + $(this).attr('id').replace('tab_', '')).remove();
						$(this).remove();
					}
				});

				if ($('.lab_script .active').length === 0) {
					that.changeTab("ffb");
				}

				window.easyScript.showManager();

				if (window.FFDevs.isDev() !== false) {
					window.easyScript.setGenericButton('Crea nuovo Script', 'window.easyScript.newScript()');
				}
			}
		});
	},



	newScript: function() {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		this.editor.init(
			"https://ffb.forumfree.net/Git/Nicoxys/EasyScript/assets/scriptTemplate.json",
			null,
			'window.easyScript.submitNewScript(window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
	},
	editScript: function(sid) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		var scriptElement = document.querySelector('.box[data-sid="'+sid+'"]');
		this.editor.init(
			"https://ffb.forumfree.net/Git/Nicoxys/EasyScript/assets/scriptTemplate.json",
			JSON.parse(atob(scriptElement.getAttribute('data-info'))),
			'window.easyScript.submitEditScript(' + scriptElement.getAttribute('data-sid') + ', window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
		$('.modal').modal('hide');
	},
	delSchema: function() {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		this.editor.destroy();
		this.showManager();
		this.unsetGenericButton();
		if (window.FFDevs.isDev() !== false) {
			this.setGenericButton('Crea nuovo Script', 'window.easyScript.newScript()');
		}
	},



	canInstallSomething: true,
	installScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}

		if (typeof($(scriptElement).attr('data-deps')) !== "undefined" && $(scriptElement).attr('data-deps') !== "") {
			var canBeInstalled = true,
				deps = $(scriptElement).attr('data-deps').split(',');
			for (let i = 0; i < deps.length; i++) {
				if (document.querySelector('.script_' + deps[i] + '.script_installed') === null) {
					if (canBeInstalled === true) {
						canBeInstalled = [];
					}
					canBeInstalled.push(deps[i]);
				}
			}

			if (canBeInstalled !== true) {
				var str = "Per installare questo script devi installare anche:";
				for (let i = 0; i < canBeInstalled.length; i++) {
					if (typeof canBeInstalled[i] === "undefined") {
						break;
					}
					let name = window.easyScript.ffScriptData.filter(function(x) {
						return x.scriptId == canBeInstalled[i];
					});
					if (name.length === 0) {
						name = 'Script Nascosto (' + canBeInstalled[i] + ')';
					} else {
						name = name[0].name
					}
					str = str += "\n- " + name;
				}
				return alert(str);
			}

		}

		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_installed');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'installScript',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	uninstallScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}

		var canBeUninstalled = true,
			poss = $('.script_showcase > .script_installed[data-sid][data-deps*="' + scriptElement.getAttribute('data-sid') + '"]')
		for (let i = 0; i < poss.length; i++) {
			let poss_b = $(poss[i]).attr('data-deps');
			if (poss_b.indexOf(scriptElement.getAttribute('data-sid')) !== -1) {
				if (canBeUninstalled === true) {
					canBeUninstalled = [];
				}
				canBeUninstalled.push($(poss[i]).attr('data-sid'));
			}
		}

		if (canBeUninstalled !== true) {
			var str = "Non puoi disinstallare questo script, è richiesto per:";
			for (let i = 0; i < canBeUninstalled.length; i++) {
				if (typeof canBeUninstalled[i] === "undefined") {
					break;
				}
				let name = window.easyScript.ffScriptData.filter(function(x) {
					return x.scriptId == canBeUninstalled[i];
				});
				if (name.length === 0) {
					name = 'Script Nascosto (' + canBeUninstalled[i] + ')';
				} else {
					name = name[0].name
				}
				str = str += "\n- " + name;
			}
			return alert(str);
		}

		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_installed');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'uninstallScript',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	settingScript: function(scriptElement) {
		$("html, body").animate({
			scrollTop: 0
		}, "slow");
		var scriptInfo = JSON.parse(atob(scriptElement.getAttribute('data-info'))),
			scriptId = scriptElement.getAttribute('data-sid');
		var defaultSetting = JSON.parse(scriptInfo.settings_default),
			nowSettings = window.nowInfo.settings["script_" + scriptId];

		if (scriptInfo["settings_schema"].trim() === "") {
			return alert("Questo script non prevede impostazioni.")
		}
		var schema = JSON.parse(scriptInfo["settings_schema"]);
		if (Object.keys(schema).length === 0) {
			return alert("Questo script non prevede impostazioni.")
		}

		if (typeof nowSettings !== "undefined") {
			nowSettings = JSON.parse(nowSettings);
			if (Object.prototype.toString.call(defaultSetting) === '[object Array]') {
				var settings = nowSettings;
			} else if (Object.prototype.toString.call(defaultSetting) === '[object Object]') {
				var settings = {};

				for (var key in defaultSetting) {
					if (!defaultSetting.hasOwnProperty(key)) continue;

					if (typeof(nowSettings[key]) !== "undefined") {
						settings[key] = nowSettings[key];
					} else {
						settings[key] = defaultSetting[key];
					}
				}
			} else {
				var settings = nowSettings;
			}
		} else {
			var settings = defaultSetting;
		}

		this.editor.init(
			schema,
			settings,
			'window.easyScript.submitSettingScript(' + scriptId + ', window.easyScript.editor.val())'
		);

		this.hideManager();
		this.setGenericButton('Indietro', 'window.easyScript.delSchema()');
	},
	submitSettingScript: function(scriptId, scriptSettings) {
		var scriptInfo = JSON.parse(atob(document.querySelector('.box.script_' + scriptId).getAttribute('data-info')));
		var defaultSetting = JSON.parse(scriptInfo.settings_default),
			nowSettings = scriptSettings;

		if (scriptInfo["settings_schema"].trim() === "") {
			return alert("Questo script non prevede impostazioni.")
		}
		var schema = JSON.parse(scriptInfo["settings_schema"]);
		if (Object.keys(schema).length === 0) {
			return alert("Questo script non prevede impostazioni.")
		}

		if (typeof nowSettings !== "undefined") {
			if (Object.prototype.toString.call(defaultSetting) === '[object Array]') {
				var settings = nowSettings;
			} else if (Object.prototype.toString.call(defaultSetting) === '[object Object]') {
				var settings = {};

				for (var key in defaultSetting) {
					if (!defaultSetting.hasOwnProperty(key)) continue;

					if (typeof(nowSettings[key]) !== "undefined") {
						settings[key] = nowSettings[key];
					} else {
						settings[key] = defaultSetting[key];
					}
				}
			} else {
				var settings = nowSettings;
			}
		} else {
			var settings = defaultSetting;
		}

		this.showLoading();
		this.hideManager();

		this.serverRequest({
			forum: window.nowInfo.forum,
			auth_forum: window.nowInfo.auth_forum,
			auth: window.nowInfo.auth,
			act: 'submitSettings',
			script_id: scriptId,
			setting: JSON.stringify(scriptSettings)
		}, function(data) {
			window.easyScript.delSchema();
			window.easyScript.init(window.nowInfo.forum);
		});
	},
	enableMobileScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}
		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_mobile_uninstalled');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'enableMobile',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},
	disableMobileScript: function(scriptElement) {
		if (!this.canInstallSomething) {
			return alert("Attendi il completamento dell'operazione precedente!");
		}
		this.canInstallSomething = false;

		$(scriptElement).toggleClass('script_mobile_uninstalled');

		this.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'disableMobile',
				script_id: scriptElement.getAttribute('data-sid')
			},
			function(data) {},
			function() {
				window.easyScript.canInstallSomething = true;
			});
	},



	submitNewScript: function(scriptInfo) {
		var easyScript = this;

		if (!this.isValidJson(scriptInfo["settings_schema"])) {
			return alert('Errore nello schema (JSON non valido)!');
		}
		this.editor.parseSchema(JSON.parse(scriptInfo["settings_schema"]), function(default_settings) {
			if (default_settings === null) {
				default_settings = {};
			}
			scriptInfo["settings_default"] = JSON.stringify(default_settings);

			easyScript.showLoading();
			easyScript.hideManager();

			easyScript.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'addScript',
				info: JSON.stringify(scriptInfo)
			}, function(data) {
				window.easyScript.delSchema();
				window.easyScript.init(window.nowInfo.forum);
			});
		});
	},
	submitEditScript: function(scriptId, scriptInfo) {
		var easyScript = this;

		if (!this.isValidJson(scriptInfo["settings_schema"])) {
			return alert('Errore nello schema (JSON non valido)!');
		}
		this.editor.parseSchema(JSON.parse(scriptInfo["settings_schema"]), function(default_settings) {
			if (default_settings === null) {
				default_settings = {};
			}
			scriptInfo["settings_default"] = JSON.stringify(default_settings);

			easyScript.showLoading();
			easyScript.hideManager();

			easyScript.serverRequest({
				forum: window.nowInfo.forum,
				auth_forum: window.nowInfo.auth_forum,
				auth: window.nowInfo.auth,
				act: 'editScript',
				script_id: scriptId,
				info: JSON.stringify(scriptInfo)
			}, function(data) {
				window.easyScript.delSchema();
				window.easyScript.init(window.nowInfo.forum);
			});
		});
	},
	submitDelScript: function(sid) {
		var scriptElement = document.querySelector('.box[data-sid="'+sid+'"]');
		if (confirm("Sei sicuro di voler eliminare questo script? \nTieni presente che si disinstallerà da tutti i forum dove è installato, e non potrai ripristinarlo.")) {
			if (confirm("Sicuro sicuro? Davvero?")) {
				this.showLoading();
				this.hideManager();

				$('.modal').modal('hide');

				this.serverRequest({
					forum: window.nowInfo.forum,
					auth_forum: window.nowInfo.auth_forum,
					auth: window.nowInfo.auth,
					act: 'delScript',
					script_id: scriptElement.getAttribute('data-sid')
				}, function(data) {
					scriptElement.remove();
					window.easyScript.hideLoading();
					window.easyScript.showManager();
				});
			}
		}
	},

	reloadEasy: function() {
		window.easyScript.showLoading();
		window.easyScript.hideManager();
		window.easyScript.init(window.nowInfo.forum);
	},

	changeTab: function(tab) {
		if (!window.FFDevs.isValidTab(tab)) {
			tab = 'ffb';
		}
		this.init_tab = tab;

		$(".tab_script").css('display', 'none');
		$("#tab_" + tab).css('display', 'block');

		$(".lab_script > *").removeClass('active');
		$("#lab_" + tab + " > *").addClass('active');
	}
}


var queryString = window.easyScript.queryParams();
if (typeof queryString["domain"] !== "undefined") {
	document.querySelector('#auth_user').style.display = 'none';
	document.querySelector('#auth_info').style.display = 'none';
	window.easyScript.init(queryString["domain"]);
} else {
	document.querySelector('#auth_user').style.display = 'block';
	document.querySelector('#auth_info').style.display = 'block';
}

window.auth_ready = function() {
	if (window.userSession.forumcommunity.auth !== false) {
		document.querySelector('.fcbutton').innerHTML = document.querySelector('.fcbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'fc' + window.userSession.forumcommunity.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.fcbutton').innerHTML = document.querySelector('.fcbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
	if (window.userSession.forumfree.auth !== false) {
		document.querySelector('.ffbutton').innerHTML = document.querySelector('.ffbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'ff' + window.userSession.forumfree.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.ffbutton').innerHTML = document.querySelector('.ffbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
	if (window.userSession.blogfree.auth !== false) {
		document.querySelector('.bfbutton').innerHTML = document.querySelector('.bfbutton').innerHTML + '<a class="account_button" onclick="window.easyScript.init(\'bf' + window.userSession.blogfree.user.id + '\');">Installa script</a>';
	} else {
		document.querySelector('.bfbutton').innerHTML = document.querySelector('.bfbutton').innerHTML + '<a class="account_button" href="#">Non loggato</a>';
	}
}
window.init_domain = function(domain) {
	window.easyScript.init(domain);
}
