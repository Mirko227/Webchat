//requires
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { join } = require('path');
const { joinChat , userLeave, randomColor, getUsers} = module.require('./functions');



//istanze
const app = express();
const server = http.createServer(app)
const io = socketio(server)


//cartella public che contiene i file che mando all'utente.
//tutti i miei file, e quindi le richiste partono riferendomi ai file di /public/ implicitamente se questi si trovano li dentro
app.use(express.static(path.join(__dirname , 'public')));

app.get('/chat.html',(req,res) =>{
   
    if(req.query.username){
        res.sendFile('/chat.html',{root: __dirname})
    }
    else{
        res.redirect(401, '/');
    }
   
});

//La porta su cui avvio il server
const PORT = 3000 || process.end.PORT;


//listener sulla connessione al server
io.on('connection', socket =>{
   
    
    //genero un colore nuovo ad ogni nuova connessione.
    color = randomColor();
    socket.emit('randomColor',color);
    
    //messaggio solo per il client corrente. (BOT)
    socket.emit('messageBOT', 'Welcome to Webchat');   

    socket.on('join',username =>{
        const user = joinChat(socket.id,username);
        io.emit('showUsers',(userList=getUsers()));
        //messaggio in broadcast quando un nuovo utente si connette. (BOT)
        socket.broadcast.emit('messageBOT',`${user.username} has joined the Webchat`);
    });


    //quando arriva il messaggio di un utente poi lo mando in broadcast (a tutti tranne me).
    socket.on('chatMsg', (msgValue,username,colorname) =>
        {  
            socket.broadcast.emit('message',msgValue,username,colorname);
    });
    
   

    //messaggio quando un utente si disconnette.
    socket.on('disconnect', ()=>
    {
        const user = userLeave(socket.id);
        if(user)
        {  
            io.emit('messageBOT',`${user.username} has left the chat`);
        }
        io.emit('showUsers',(userList=getUsers()));
    });
    
});



//server in ascolto sulla porta "PORT=3000"
server.listen(PORT, () => console.log(`server running on port ${PORT}`));




