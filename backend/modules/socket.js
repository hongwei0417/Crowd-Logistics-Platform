import { ClientRequest } from "http";

export default async () => {
  io.on('connection', (socket) => {
    var uid;
    socket.on('create', function (data) {
      
      uid = Object.keys(data);
      socket.join(uid); //創建使用者頻道
      
      Object.assign(clients, data) //將使用者加入

      console.log(`使用者: [${uid}] 已連線!`);
      console.log(`目前有 ${Object.values(clients).length} 人連線!`);
      console.log(clients)
    });

    socket.on('disconnect', (reason) => {
      delete clients[uid]
      console.log(`使用者: [${uid}] 已斷線!`);
      console.log(`目前有 ${Object.values(clients).length} 人連線!`);
    });
  });
}

