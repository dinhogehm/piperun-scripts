/*
* Script exclusivo para o website do cliente https://www.vida.portosegurovoce.com.br/
* */

// ENDPOINT
let hashEtapa = "4f85093c-a093-40e7-b75b-ae4635d60813"
let dados = [];

document.addEventListener('mousedown', (event) => {
    let form_id = ''
    if (event.composedPath()[1].className === '_1fbEI'){
        form_id = event.composedPath()[5].id;
    } else if (event.composedPath()[1].className === '_2UgQw'){
        form_id = event.composedPath()[4].id;
    }
    if (form_id && formValidation(form_id)) {
        readForms();
        sendData(hashEtapa, packageData(form_id, dados, []));
    }
});

function readForms() {
// Ler todos os formulários do site.
    Object.entries(document.querySelectorAll('form')).map(button => {
        // pegar todos os campos do tipo input dentro do formulário, com todos os seus atributos (Value => valor e nome são atribuitos).
        Object.entries(button[1].querySelectorAll('input')).map(input => {
            // mapeando campos
            dados = mapper(button[1].id, input[1].name, input[1].value);
        });
    });
}

function mapper(form = 'form', key, value) {
    if (!dados[form]) dados[form] = [];
    switch (key) {
        case 'nome':
            dados[form].push({name:value}); break;
        case 'profissão':
            dados[form].push({job_title:value}); break;
        case 'phone':
            dados[form].push({mobile_phone:value}); break;
        case 'nascimento-(dia/mês/ano)':
            dados[form].push({custom_fields:{ data_nascimento:value}}); break;// fazer o mapeamento do campo no piperun de 'data_nascimento' => 'Data de Nascimento'.
        default:
            key.replaceAll(' ', '-');
            dados[form].push({[key]:value}); break;
    }
    return dados;
}

function formValidation(form_id) {
    let checkFields = [];
    let validation = true;
    Object.entries(document.querySelectorAll('form')).map(form => {
        // pegar todos os campos do tipo input dentro do formulário, com todos os seus atributos (Value => valor e nome são atribuitos).
        Object.entries(form[1].querySelectorAll('input')).map(input => {
            // mapeando campos
            if (form_id === form[1].id) {
                checkFields.push({form:form[1].id, name:input[1].name, name:input[1].value, required:input[1].hasAttribute('required'), passed:input[1].value.length > 2});
            }
        });
    });

    Object.entries(checkFields).map(item => {
        item = item[1];
        if (!item.passed) {
            if (item.required) validation = false;
        }
    });
    return validation;
}

function packageData(form_id, dados, payload = []) {
    // Coletando UTMS
    payload['custom_fields'] = [];
    payload['custom_fields']['utm_source']   = getParameterByName('utm_source');
    payload['custom_fields']['utm_medium']   = getParameterByName('utm_medium');
    payload['custom_fields']['utm_campaign'] = getParameterByName('utm_campaign');
    payload['custom_fields']['utm_term']     = getParameterByName('utm_term');
    payload['custom_fields']['utm_content']  = getParameterByName('utm_content');
    payload['custom_fields']['utm_position'] = getParameterByName('utm_position');
    payload['custom_fields']['utm_device']   = getParameterByName('utm_device');
    payload['custom_fields']['utm_match']    = getParameterByName('utm_match');
    payload['custom_fields']['utm_creative'] = getParameterByName('utm_creative');
    payload['title'] = "Vida Landing Page - " + name + " - " + formatDate(new Date());
    payload['last_conversion'] = [];
    payload['last_conversion']['source'] = getParameterByName('utm_source') || "Landing Page - Franquias";
    payload['tags'] = ["Seguro de Vida"];
    payload['notes'] = ["Contato enviado através do formulário de Seguro de Vida."];

    console.log(dados);
    if (dados){
        payload.push({id:dados[form_id][1].email}); // buscando o email
        Object.entries(dados[form_id]).map(item => {
            let key = Object.keys(item[1])[0];
            payload[key] = item[1][key];
            console.log(Object.keys(item[1])[0], item[1][Object.keys(item[1])[0]])
        });
    }
    return payload;
}

function sendData(hash, data) {

    let regras = { "update": false, "equal_pipeline": true, "filter_status_update": "open" };
    let endpoint = 'https://app.pipe.run/webservice/integradorJson?hash=' + hash;
    let temp = JSON.stringify({
        "rules": regras,
        "leads": [data]
    });

    // console.log(hash, data, temp, endpoint)
    localStorage.setItem('dados', JSON.stringify({hash, data, temp, endpoint}));
    // fetch(endpoint, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     }, body: JSON.stringify({
    //         "rules": regras,
    //         "leads": [data]
    //     })
    // }).then((resp) => resp.json())
    // .then(function (response) {
    //     if (!response.success) {
    //         alert('Houve um erro ao enviar seus dados');
    //     }
    // });
}

// Função para formatação de data.
function formatDate(date) {
    return (date.getDate() < 10 ? '0' : '') + date.getDate()
        + '/' +
        ((date.getMonth()+1) < 10 ? '0' : '') + date.getMonth()
        + '/' +
        date.getFullYear() + ' ' +
        date.getHours() + ':' + date.getMinutes();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}