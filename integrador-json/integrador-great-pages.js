/*
Problemas encontrados nessa integração:
- O greatpages força um redirect para uma página de agradecimento, com isso, \
o script JS do integração não consegue rodar antes do redirect e acaba não rodando e não enviando os leads para o CRM PipeRun.
- Tentamos resolver:
    event.preventDefault(); 
    event.stopPropagation();
*/

function setCookie(name, value, exdays = 1) {
    var expires;
    var date;
    var value;
    date = new Date();
    date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
    expires = date.toUTCString();
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/"
}

function getCookie(name) {
    var c_name = document.cookie;
    if (c_name != undefined && c_name.length > 0) {
        var posCookie = c_name.indexOf(name);
        if (posCookie >= 0) {
            var hashOportunidade = '';
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) {
                hashOportunidade = parts.pop().split(";").shift()
            }
            return hashOportunidade
        } else {
            return !1
        }
    }
}

function eraseCookie(name) {
    setCookie(name, -1)
}

function getRequestURL(name) {
    if (name = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(location.search)) return decodeURIComponent(name[1])
}

function setSessionStart(sessionStartName, arTerms = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_position', 'utm_device', 'utm_match', 'utm_creative']) {
    arTerms.forEach(function (termo) {
        var nameTermo = sessionStartName + '_' + termo;
        sessionStartCookie[termo] = '';
        sessionStart[termo] = '';
        var termValue = ' ';
        var boSet = !1;
        if (getRequestURL(termo)) {
            termValue = getRequestURL(termo);
            boSet = !0
        }
        if (!getCookie(nameTermo)) {
            boSet = !0
        }
        if (boSet) {
            setCookie(nameTermo, termValue)
        }
        termValue = getCookie(nameTermo);
        if (termValue == '') {
            termValue = ' '
        }
        sessionStartCookie[termo] = termValue;
        sessionStart[termo] = termValue
    })
}

var sessionStartCookie = new Object();
var sessionStart = new Object();

// URL de referencia;
// https://crmpiperun.com?utm_source=google&utm_medium=cpc&utm_campaign=manutencao-recorrente

function getParameterByName(name) {
    name = name.replace(/[[]/, "[").replace(/[]]/, "]");
    var regex = new RegExp("[?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    if (sessionStart && sessionStart[name]) {
        return (sessionStart[name] === null || sessionStart[name] === "" || sessionStart[name] === " " || sessionStart[name] === undefined) ? "" : sessionStart[name];
    }
    let textReplace = '/+/g';

    return results === null ? "" : decodeURIComponent(results[1].replace(textReplace, " "));
}

// Função para formatação de data.
function formatDate(date) {
    return (date.getDate() < 10 ? '0' : '') + date.getDate()
        + '/' +
        ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)
        + '/' +
        date.getFullYear() + ' ' +
        date.getHours() + ':' + date.getMinutes();
}

// Adiciona um event listener para o evento de submit no formulário
document.addEventListener('DOMContentLoaded', function() {
    var formNovo = document.getElementsByTagName('form')[0];
    formNovo.addEventListener('submit', function(event) { 
        event.preventDefault(); 
        event.stopPropagation();
        enviarDados();
    });
});

function enviarDados() {
    // ENDPOINT
    let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=a32ca90a-5622-4023-b43f-63fec1f77c45"

    let dataHora = formatDate(new Date());

    let name = document.getElementById('input_472523_1_170725159135638761').value;
    let email = document.getElementById('input_472523_1_1707251591356387611').value;
    let phone = document.getElementById('input_1707251676').value;
    let studyStartValue = document.getElementById('input_1707251833').value;
    let programTypeValue = document.getElementById('input_1707251866').value;
    let budgetValue = document.getElementById('input_1709127037').value;

    let utm_source = getParameterByName('utm_source');
    let utm_medium = getParameterByName('utm_medium');
    let utm_campaign = getParameterByName('utm_campaign');
    let utm_term = getParameterByName('utm_term');
    let utm_content = getParameterByName('utm_content');
    let utm_position = getParameterByName('utm_position');
    let utm_device = getParameterByName('utm_device');
    let utm_match = getParameterByName('utm_match');
    let utm_creative = getParameterByName('utm_creative');
    let gclid = getParameterByName('gclid');

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
        "mobile_phone": phone,
        "email": email,
        "last_conversion": {
            "source": "Formulário do site"
        },
        "custom_fields": {
            "Canal do Anúncio [utm]": utm_source,
            "Campanha [utm]": utm_campaign,
            "Palavra chave pesquisada Google [utm]": utm_term,
            "Quando pretende iniciar seus estudos em uma universidade no exterior?": studyStartValue,
            "Qual tipo de programa você procura?": programTypeValue,
            "Qual o orçamento para os seus estudos?": budgetValue,
            "gclid": gclid,
            "utm_source": utm_source,
            "utm_medium": utm_medium,
            "utm_campaign": utm_campaign,
            "utm_term": utm_term,
            "utm_content": utm_content,
            "utm_position": utm_position,
            "utm_device": utm_device,
            "utm_match": utm_match,
            "utm_creative": utm_creative
        },
        "tags": [ "Google ADS" ],
        "notes": [
            "Título: " + name + " - " + dataHora + "</br>" +
            "E-mail: " + email + "</br>" +
            "Nome: " + name + "</br>" +
            "Telefone: " + phone + "</br>" +
            "gclid: " + gclid + "</br>" +
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

    Object.entries(lead[0]).forEach(([key, value]) => {
        if (typeof value === 'string' && value === '') {
            delete lead[0][key];
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
        document.getElementsByTagName('form')[0].submit();
    });
}
