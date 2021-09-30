const express= require("express");
const fs=require('fs');
const app=express();
const http = require("http").Server(app);
const io = require('socket.io')(http);
const port=process.env.PORT || 3000
const path=require('path');
const users = {};
const roomids=[];
const roommember=[];
const staticpath=path.join(__dirname,"/public");
app.use(express.static(staticpath));
io.on("connection", (socket) => {
    socket.on('new-user-join', (name) => {
     
        users[socket.id] = name;

      
    });
socket.on("send",(message,id)=>{
    
    if(roomids.indexOf(id)!=-1){
    

    let roomselectedmember=roommember.filter((x)=>{
        if(x.room==id){return x.socketkey}
    }).map((x)=>x.socketkey)
    console.log(roomselectedmember)
        socket.to(roomselectedmember).emit("recieve",{message:message, name:users[socket.id].username});
    }
 
 
});
socket.on('create-room',(roomid)=>{
    roomids.push(roomid);
    roommember.push({name:users[socket.id].username,room:roomid,socketkey:socket.id});
    console.log(roommember);
})
socket.on('new-member-room',enterroom=>{
   console.log(enterroom);
    if(roomids.indexOf(enterroom)!=-1){
        roommember.push({name:users[socket.id].username,room:enterroom,socketkey:socket.id});

    let roomselectedmember=roommember.filter((x)=>{
        if(x.room==enterroom){return x.socketkey}
    }).map((x)=>x.socketkey)
    console.log(roomselectedmember)
        socket.to(roomselectedmember).emit('user-joind',users[socket.id].username);
    }
})

});

http.listen(port, () => { console.log("listening") });

