import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import usersRouter from './routes/users'
import driverRouter from './routes/drivers'
import transactionRouter from './routes/transactions'
import getWeb3 from './getWeb3'
import { Server } from 'http'
import Socket from 'socket.io'

config();

const app = express();
const port = process.env.PORT || 5000;

var server = Server(app);
global.io = Socket(server);

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
  console.log("The database is " + connection.name)
})


const start_web3 = async () => {
  try {
    global.web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    console.log(accounts)
    console.log("Web3 is connecting!")
    return web3;
  } catch(e) {
    console.log(e)
  }
  
}


start_web3();


app.use('/users', usersRouter);
app.use('/drivers', driverRouter);
app.use('/transactions', transactionRouter);


io.on('connection', function (socket) {
  socket.on('load', function (data) {
    console.log(`User [${data.user}] connected!`);
    console.log(socket.id)
  });
});



server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
