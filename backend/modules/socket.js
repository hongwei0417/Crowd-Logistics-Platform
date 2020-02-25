import { ClientRequest } from "http";

export default async () => {
  io.on('connection', (socket) => {
    socket.on('create', function (data) {
      
      const uid = Object.keys(data);
      socket.join(uid);
      
      Object.assign(clients, data)

      

      console.log(`使用者: [${uid}] 已連線!`);
      console.log(`目前有 ${Object.values(clients).length} 人連線!`);
      console.log(clients)
    });
  });
}

