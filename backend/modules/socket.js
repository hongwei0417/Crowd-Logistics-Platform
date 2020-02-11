import { ClientRequest } from "http";

export default async () => {
  io.on('connection', (socket) => {
    socket.on('load', function (data) {
      console.log(`User [${Object.keys(data)}] connected!`);
      Object.assign(clients, data)

      console.log(clients)
      console.log(socket.id)
    });
  });
}