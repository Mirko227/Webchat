const {username} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

const socket = io();
const message = document.getElementById('keyboard');;
const send = document.getElementById('send');
const chatBody = document.getElementById('chatBody');
let colorname;


// quando un utente entra nella chat viene aggiunto il suo nome perso da Qs.parse nella lista degli username
socket.emit('join',username);


socket.on('messageBOT', message =>{
  displayMessageBOT(message);
})

socket.on('message', (message,username,colorname) =>{
  displayMessage(message,username,colorname);
})

//in ascolto del click per l'invio del mio messaggio e per mostrarlo a schermo;
send.addEventListener('click', (e) =>{
if(message.value!==""){
    const msgDiv = document.createElement("div");
    msgDiv.setAttribute('class','msgDiv myMsg');
    const senderName = document.createElement("p");
    senderName.setAttribute('class','senderName');
    senderName.style.color = colorname;
    senderName.textContent = username;
    senderName.style.color=colorname;
    const newMessage = document.createElement("p");
    newMessage.innerHTML =  message.value;
    const time = document.createElement("p");
    time.setAttribute('class','mytimeStyle');
    time.textContent = getTime()
    msgDiv.appendChild(senderName)
    msgDiv.appendChild(newMessage)
    msgDiv.appendChild(time)
    chatBody.appendChild(msgDiv)
    chatBody.appendChild(msgDiv)
    const msgValue = message.value;
    socket.emit('chatMsg',msgValue,username,colorname);
    message.value ="";
    chatBody.scrollTop = chatBody.scrollHeight;
}
})

message.addEventListener("keypress", function(event) {
    // Se viene premuto "ENTER"
    if (event.key === "Enter") {
      // Triggera il click del bottone
      send.click();
    }
  });


  //funzione che manda a schermo i messaggi provenienti dal server del bot;
  function displayMessageBOT(message){
    const msgDiv = document.createElement("div");
    msgDiv.setAttribute('class','messageBOT msgDiv');
    const senderNameBOT = document.createElement("p");
    senderNameBOT.setAttribute('class','senderNameBOT');
    senderNameBOT.textContent = "BOT"
    const newMessage = document.createElement("p");
    newMessage.innerHTML =  message;
    const time = document.createElement("p");
    time.setAttribute('class','timeStyle');
    time.textContent = getTime()
    msgDiv.appendChild(senderNameBOT)
    msgDiv.appendChild(newMessage)
    msgDiv.appendChild(time)
    chatBody.appendChild(msgDiv)
  }

  //funzione per i messaggi degli utenti
  function displayMessage(message,username,colorname){
    const msgDiv = document.createElement("div");
    msgDiv.setAttribute('class','otherMsg msgDiv');
    const senderName = document.createElement("p");
    senderName.setAttribute('class','senderName');
    senderName.textContent = username;
    senderName.style.color = colorname;
    const newMessage = document.createElement("p");
    newMessage.innerHTML =  message;
    const time = document.createElement("p");
    time.setAttribute('class','timeStyle');
    time.textContent = getTime()
    msgDiv.appendChild(senderName)
    msgDiv.appendChild(newMessage)
    msgDiv.appendChild(time)
    chatBody.appendChild(msgDiv)
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  //ottenere l'orario
  function getTime(){
    let data= new Date()
    let hrs = data.getHours()
    let mins = data.getMinutes()
    if(hrs<=9)
       hrs = '0' + hrs
    if(mins<10)
      mins = '0' + mins
    const postTime= hrs + ':' + mins
    return postTime
  };


  // scegliere random un colore per il visualizzare il nome degli utenti
  socket.on('randomColor', color =>{
    colorname = color;
  });



//codice per la card delle persone online 

  const openCard = document.getElementById('open-card');;
  const card = document.getElementById('card')
  card.style.display = "none"

  //toggle
  openCard.onclick = ()=>
  {
      
      if (card.style.display === "none") {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
  }

  socket.on('showUsers',(users)=>{
      outputUsers(users);
  });

  function outputUsers(users)
  {

    
    card.innerHTML = 
    `${users.map(user=>
      `<div class="users-online">
        	<span class="online-dot"></span>
          <p class="user-name">${user}</p>
      </div>`
      ).join('')}
      `;

      const onlineCounter = document.createElement('p')
      onlineCounter.textContent = `Online: ${users.length}`;
      onlineCounter.setAttribute('class','online-counter')
      card.appendChild(onlineCounter);
  }