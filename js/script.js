let timerLoader;
let timerSession;
let inputUser;

function login() {

    inputUser = prompt("Informe um nome de usuário:");
    inputUser = {
      name: `${inputUser}`
    };

    let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', inputUser);

    promisse.then((response) => { 
      console.log(response.status);
      timerLoader = setInterval(loadMessages, 3000);
      timerSession = setInterval(session, 5000);
    });
    promisse.catch((response) => { 
      console.log(response.status);
      login();
    });

}

function session(){
  const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', inputUser);

  promisse.then(console.log("session checked"));
  promisse.catch(console.log("session not checked"));
}

function loadMessages() {

  const promisse =
    axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

  promisse.then(renderMessages);
  promisse.catch(console.log("Não Entrei"));
}



function renderMessages(response) {
  const data = response.data;
  const el = document.querySelector('.container');
  el.innerHTML = '';
  data.map(
    item => {
      if (item.type === 'status') {
        el.innerHTML += `<div class="status">
                          <span>(${item.time})</span>
                          <span><strong> ${item.from}</strong> ${item.text}</span>
                        </div>`
      }
      if (item.type === 'message') {
        el.innerHTML += `<div class="message">
                          <span>(${item.time})</span>
                          <span><strong> ${item.from}</strong> para <strong>${item.to}</strong>: ${item.text}</span>
                        </div>`
      }
      if (item.type === 'private_message') {
        el.innerHTML += `<div class="private-message">
                            <span>(${item.time})</span>
                            <span><strong> ${item.from}</strong> reservadamente para <strong>${item.to}</strong>: ${item.text}</span>
                          </div>`
      }
    }
  );

  el.lastChild.scrollIntoView();
}

function sendMessage(to, type){
  to = 'Todos';
  type = 'message';
  let text = document.querySelector('.message-text');

  const message = {
    from: inputUser.name,
    to: to,
    text: text.value,
	  type: type   
  };

  const promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', message);

  promisse.then(response => {
    text.value = '';
    loadMessages();
    console.log(response.status);
  });
  promisse.catch(console.log("Msg no sended"));

  
}