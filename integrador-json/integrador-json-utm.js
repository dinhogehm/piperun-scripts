
// METODO PARA COLETAR DADOS DO FORMULARIO E ENVIAR PARA O PIPERUN, COM DADOS DE UTM.
// dependencia do script sessionStart.min.js
// dependencia do google analytics.

// sessionStart.min.js
		function setCookie(name,value,exdays=1){var expires;var date;var value;date=new Date();date.setTime(date.getTime()+(exdays*24*60*60*1000));expires=date.toUTCString();document.cookie=name+"="+value+"; expires="+expires+"; path=/"}function getCookie(name){var c_name=document.cookie;if(c_name!=undefined&&c_name.length>0){var posCookie=c_name.indexOf(name);if(posCookie>=0){var hashOportunidade='';var value="; "+document.cookie;var parts=value.split("; "+name+"=");if(parts.length==2){hashOportunidade=parts.pop().split(";").shift()}return hashOportunidade}else{return!1}}}function eraseCookie(name){setCookie(name,-1)}function getRequestURL(name){if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))return decodeURIComponent(name[1])}function setSessionStart(sessionStartName,arTerms=['utm_source','utm_medium','utm_campaign','utm_term','utm_content','utm_position','utm_device','utm_match','utm_creative','plano','tipo']){arTerms.forEach(function(termo){var nameTermo=sessionStartName+'_'+termo;sessionStartCookie[termo]='';sessionStart[termo]='';var termValue=' ';var boSet=!1;if(getRequestURL(termo)){termValue=getRequestURL(termo);boSet=!0}if(!getCookie(nameTermo)){boSet=!0}if(boSet){setCookie(nameTermo,termValue)}termValue=getCookie(nameTermo);if(termValue==''){termValue=' '}sessionStartCookie[termo]=termValue;sessionStart[termo]=termValue})}var sessionStartCookie=new Object();var sessionStart=new Object();

// URL de referencia;
// https://crmpiperun.com?utm_source=google&utm_medium=cpc&utm_campaign=manutencao-recorrente

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	if (sessionStart && sessionStart[name]) {
		return (sessionStart[name] === null || sessionStart[name] === "" || sessionStart[name] === " " || sessionStart[name] === undefined) ? "" : sessionStart[name];
	}

	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Função para formatação de data.
function formatDate(date) {
	return (date.getDate() < 10 ? '0' : '') + date.getDate()
	+ '/' + 
	(date.getMonth() + 1)
	+ '/' + 
	date.getFullYear() + ' ' +
	date.getHours() + ':' + date.getMinutes();
}

window.onload = function() {
	var formNovo = document.getElementsByTagName('form')[0];
	formNovo.addEventListener('submit', enviarDados);
}


function enviarDados() {
	// ENDPOINT
	let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=dpjji348s1vshxq366n1hd1uz2kvulz"

	let dataHora = formatDate(new Date());

	let name = document.getElementById('name').value;
	let email = document.getElementById('email').value;
	let phone = document.getElementById('phone').value;

	let utm_source = getParameterByName('utm_source');
	let utm_medium = getParameterByName('utm_medium');
	let utm_campaign = getParameterByName('utm_campaign');
	let utm_term = getParameterByName('utm_term');
	let utm_content = getParameterByName('utm_content');
	let utm_position = getParameterByName('utm_position');
	let utm_device = getParameterByName('utm_device');
	let utm_match = getParameterByName('utm_match');
	let utm_creative = getParameterByName('utm_creative');

	// RULES
	let rules = {
		"update": true,
		"status": "open",
		"equal_pipeline": true,
		"filter_status_update": "open"
	}

	// LEAD
	let lead = [{
		"id": email,
		"title": name + " - " + dataHora,
		"name": name,
		"email": email,
		"mobile_phone": phone,
		"last_conversion": {
			"source" : "Formulário do site"
		},
		 "custom_fields": {
			"Canal do Anúncio [utm]": utm_source,
			"Campanha [utm]": utm_campaign,
			"Palavra chave pesquisada Google [utm]": utm_term
		},
		"notes" : [
			"Título: " + name + " - " + dataHora + "</br>" +
			"E-mail: " + email + "</br>" +
			"Nome: " + name + "</br>" +
			"WhatsApp: " + phone + "</br>" +
			"utm_source: " + utm_source + "</br>" +
			"utm_medium: " + utm_medium + "</br>" +
			"utm_campaign: " + utm_campaign + "</br>" +
			"utm_term: " + utm_term + "</br>" +
			"utm_content: " + utm_content + "</br>" +
			"utm_position: " + utm_position + "</br>" +
			"utm_device: " + utm_device + "</br>" +
			"utm_match: " + utm_match + "</br>" +
			"utm_creative: " + utm_creative
		]
	}]

	Object.entries(lead[0]).map(index => {
			if (typeof value === 'string' && value === ''){
				delete lead[0][index]
			}
		});

	// DATA
	let dataToSend = {
		"rules": rules,
		"leads": lead
	}

	 fetch(endpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			}, body: JSON.stringify(dataToSend)
		}).then(response => {
			console.log();
		});
}
