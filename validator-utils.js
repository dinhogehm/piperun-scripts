 document.addEventListener('click', (e) => {
    if(e.composedPath()[0].id === 'id-do-botao') { 
        //// bloco de código
    }
 }

// validador simples, valida apenas a quantidade de digitos informados.                           
function validatePhone(phone) {
  let phoneNumber = phone.value.replace(/\D/g,'');
    console.log(phoneNumber.length >= 10, phoneNumber);
  return phoneNumber.length >= 10;
}                           
                           

function validateForm(form) {
    let errors_count = 0
    Object.entries(form.querySelectorAll('input')).map( (input) => {
        if (input[1].type !== 'hidden') {
            if(input[1].hasAttribute('required') && input[1].value.length < 3) {
                errors_count ++;
            }            
        }
    });

  if (errors_count > 0){
      return false; 
  }
    
  return true;
}

function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
