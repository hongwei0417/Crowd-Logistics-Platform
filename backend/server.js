import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import usersRouter from './routes/users'
import driverRouter from './routes/drivers'
import transactionRouter from './routes/transactions'
import { Server } from 'http'
import Socket from 'socket.io'
import start_socket from './modules/socket'
import start_web3 from './modules/web3'

config();

const app = express();
const port = process.env.PORT || 5000;

var server = Server(app);
global.io = Socket(server);
global.clients = {};

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

start_web3();
start_socket();


app.use('/users', usersRouter);
app.use('/drivers', driverRouter);
app.use('/transactions', transactionRouter);


server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
