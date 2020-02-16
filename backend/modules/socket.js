import { ClientRequest } from "http";

export default async () => {
  io.on('connection', (socket) => {
    socket.on('create', function (data) {
      
      const uid = Object.keys(data);
      socket.join(uid);
      console.log(`User [${uid}] connected!`);
      Object.assign(clients, data)

      console.log(clients)
      console.log(socket.id)
    });
  });
}

