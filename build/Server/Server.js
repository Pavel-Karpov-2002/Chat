const { v4: uuidv4 } = require('uuid');
var fs = require("fs");
const WebSocket = require('ws');
const { resolve } = require('path');

const wss = new WebSocket.Server({port: 9000});

const clients = {};
const clientsNames = {};

wss.on('connection', function connection(ws) {
  const id = uuidv4();
  clients[id] = ws;


  let JSONString;
  let messages;

  console.log(`User ${id} connected`);
  clients[id].send(id);

  ws.on('message', function incoming(message) {
    try {
      let user = JSON.parse(message);
      if(user.lastMessages != null) {
        try {
          getChatMessages().catch(e => console.log(e)).then(() => sendMessages(user));
        }
        catch (e) {
          console.log(e);
        }

      } else if (user.message != null) {
        sendMessagesToClients(user, id);
      } 
      else if (user.link != null) {
        clientsNames[id] = {...clientsNames.id, link: user.link}
      } 
      else if (user.link == null && user.message == null && user.lastMessages == null) {
        createName (user, clientsNames[id].link);
      } 
    }
    catch (e) {
      console.log(e)
    }
  });

  function sendMessagesToClients(user, id) {
    console.log(clientsNames[id].link + " | " + user.state.name + " (" + user.state.id + ") : " + user.message )
    addMessage(user, clientsNames[id].link);
    for (var key in clients) {
      if (clientsNames[id].link == clientsNames[key].link) {
        clients[key].send(JSON.stringify(user));
      }
    }
  }

  const getChatMessages = () =>
    new Promise((resolve, reject) => 
    {
      getData('Chats/' + clientsNames[id].link + ".json", 'utf8')
      .then(data => { JSONString = data; })
      .catch((fileName) => {
        createFile(fileName, JSON.stringify({historyChat : [] }));
      })
      .then(() => { 
        try {
          messages = JSON.parse(JSONString); 
          return reject();
        }
        catch {
          getData('Chats/' + clientsNames[id].link + ".json", 'utf8');
        }
      })
    });
  
  const getData = (fileName, type) =>
    new Promise((resolve, reject) =>
      fs.readFile(fileName, type, (err, data) => {
        return err ?  reject(fileName) : resolve(data);
      })
    );

  const createFile = (fileName, type) => {
    fs.writeFileSync(fileName, type, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  }
      
  function addMessage(user, link) {
    try{
      messages.historyChat.push({ 
        state: { 
          id: user.state.id,
          name: user.state.name
        }, 
        message: user.message
      });
      fs.writeFileSync('Chats/' + link + ".json", JSON.stringify(messages));
    }
    catch (e){
      console.log(e);
    }
  }
  

  function sendMessages(user) {
    let mess = messages.historyChat.filter((function(el, index) {
      return (index >= messages.historyChat.length - user.lastMessages);
      })).map( (user, index) => { return { ...user, index: index} });

      clients[id].send(JSON.stringify(mess));
  }

  function createName (user, link) 
  {
    let isCreateNick = false;
    for (var client in clientsNames) {
      if (clientsNames[client].link == link && clientsNames[client].name != undefined &&  clientsNames[client].name == user.name) {
        isCreateNick = true;
      }
    } 
    
    if (isCreateNick == false) {
      clientsNames[user.id] = { ...clientsNames[user.id], name: user.name };
      clients[user.id].send("successful");
    }
    else {
      clients[user.id].send("Name is loggining.");
    }
  }

  ws.on("close", () => {
    delete clients[id];
    delete clientsNames[id];
      console.log(`User ${id} disconnected`);
  });
});