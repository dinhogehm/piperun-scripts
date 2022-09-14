// METODO PARA COLETAR DADOS DO FORMULARIO E ENVIAR PARA O PIPERUN, COM DADOS DE UTM.
var sessionStart = new Object();
var hashEtapaFunil = "xxxxxxxxxxxxxxxxxxxxxxxxxx";

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

window.onload = function () {
    var formNovo = document.getElementsByTagName('form')[0];
    formNovo.addEventListener('submit', enviarDados);
}


function enviarDados() {
    // ENDPOINT
    let endpoint = "https://app.pipe.run/webservice/integradorJson?hash=" + hashEtapaFunil

    let dataHora = formatDate(new Date());

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone = document.getElementById('telefone').value;

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
            "source": "Formulário do site"
        },
        "custom_fields": {
            "Canal do Anúncio [utm]": utm_source,
            "Campanha [utm]": utm_campaign,
            "Palavra chave pesquisada Google [utm]": utm_term
        },
        "notes": [
            "Título: " + name + " - " + dataHora + "</br>" +
            "E-mail: " + email + "</br>" +
            "Nome: " + name + "</br>" +
            "Telefone: " + phone + "</br>" +
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
        if (typeof value === 'string' && value === '') {
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
