const express= require("express");
const app=express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const path=require('path');
const port=process.env.PORT || 3000;
const users = {};

const staticpath=path.join(__dirname,"/public");
app.use(express.static(staticpath));
io.on("connection", (socket) => {
    socket.on('new-user-join', (name) => {
        console.log(name);
        users[socket.id] = name;

        socket.broadcast.emit('user-joind', name);
    });
socket.on("send",(message)=>{
    
    socket.broadcast.emit("recieve",{message:message, name:users[socket.id]})
});
});

http.listen(port, () => { console.log("listening") });