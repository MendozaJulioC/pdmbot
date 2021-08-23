require('dotenv').config();
const app = require('./bot');
const http = require('http')
const morgan = require ('morgan');
const reload= require('reload')

//Settings
//app.set('port',process.env.PORT)
//middlewares
app.use(morgan('dev'));


app.use(require('./routes/index'));


//Star server

/*
const server = http.createServer(app)
server.listen(process.env.PORT||7800,()=>console.log('Servidor activo...'))
reload(app)
*/
