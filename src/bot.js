require('dotenv').config();
const express=require('express');
const app = express();
const http = require('http')
const reload= require('reload')
//const port= process.env.PORT;

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.AWS_TOKEN
const EventEmitter = require('events');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs' );
app.use(express.static(path.join(__dirname, 'public')));

const emitter = new EventEmitter();
emitter.once('log', () => console.log('log once'));
const listeners = emitter.rawListeners('log');
const logFnWrapper = listeners[0];
logFnWrapper.listener();
logFnWrapper();

emitter.on('log', () => console.log('log persistently'));
const newListeners = emitter.rawListeners('log');
newListeners[0]();
emitter.setMaxListeners(0)
emitter.emit('log');
process.env.NTBA_FIX_319 = 1;

var livereload = require('livereload');
var liveReloadServer = livereload.createServer();
liveReloadServer.watch(__dirname + "/public");

const  connectLiveReloadServer  = require('connect-livereload');
app.use(connectLiveReloadServer());

var cortebot =''
const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", console.log);


/*
bot.on('message', (message) => {
  const chatId = message.chat.id;
  // send a message to the chat acknowledging receipt of their message
  //probando el repositorio actual
  bot.sendMessage(chatId, 'Received your message');
});
*/

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
})

liveReloadServer.server.once("connection",()=>{
        setTimeout(()=>{liveReloadServer.refresh("/")
    }, 3000)
})

bot.onText(/\/start/, (msg) => { 
        home(msg)


 });

 async function home(msg){
    bot.sendMessage(msg.chat.id, "Bienvenidos a la Medellín Futuro", {
        "reply_markup":
        {
            "keyboard": 
            [
                ["Avance 🚀 "],   
                ["Cumplimiento ✅"],
                [ "Proyeccion 🥇"],
                ["Lineas📊 "],
                ["Ejecución 🛠️"]
               
            ]
        }
    });
    onPhotoText(msg)
 }

  function onPhotoText(msg) {
    // From file path
    const photo = `${__dirname}/res/guia.jpg`;
    bot.sendPhoto(msg.chat.id, photo, {
        caption: `Hola!!`,

    });
 // getChatMermber(msg)
  };


  function getChatMermber(msg)
  {
     /* bot.getMe().then(function (info){
          console.log(`
          ${info.id} is ready, the username is @${info.username}
          
          `);
      })

      */
  }


 
var request= require('request');
const { getuid } = require('process');
 bot.onText(/\/avance/, function(message, match){
  //  let plan = match[1];
    let chatId= message.chat.id; 
    request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                var ordenar=[]; let cortes=[];
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].tipo_corte=='N') {
                      let fecha =(res.data[index].corte).substr(0,10) 
                      ordenar.push([res.data[index].avance])
                      cortes.push([fecha])
                      bot.sendMessage(chatId,  'Corte: '+cortes[index]+ ' \nAvance <strong> '+ordenar[index]+'% </strong>', {parse_mode:'HTML'}) 
                    }
                }
            } )
         }
     })
 });

 bot.onText(/\/cumplimiento/, function(message, match){
    //  let plan = match[1];
    let chatId= message.chat.id; 
    request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                var ordenar=[]; let cortes=[];
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].tipo_corte=='N') {
                      let fecha =(res.data[index].corte).substr(0,10) 
                      ordenar.push([res.data[index].cumplimiento])
                      cortes.push([fecha])
                      bot.sendMessage(chatId,  'Corte: '+cortes[index]+ ' \nCumplimiento <strong> '+ordenar[index]+'% </strong>', {parse_mode:'HTML'}) 
                    
                    }
                }
                
            } )
         }
    })
});

bot.onText(/\/proyeccion/, function(message, match){
    //  let plan = match[1];
    let chatId= message.chat.id; 
    var ordenar=[]; let cortes=[];
    request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, "<b style='color:red'>Proyección</b>", {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                
                for (let index = 0; index < res.data.length; index++) {
                    if (res.data[index].tipo_corte=='P') {
                        let fecha =(res.data[index].corte).substr(0,10) 
                        ordenar.push([(res.data[index].cumplimiento).substr(0,5)])
                        cortes.push([fecha])
                        bot.sendMessage(chatId,  'Corte: '+cortes+ ' \nProyección <strong> '+ordenar+'% </strong>', {parse_mode:'HTML'}) 
                      }
                     
                }
             
            } )
         }
    })
});

bot.onText(/\/lineas/, function(message, match){
    //  let plan = match[1];
    let chatId= message.chat.id; 
    bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
    request(`https://api.avanzamedellin.info/pi/api/total-avance-lineas`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, "<b>Lineas PDM</b>", {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                var ordenar=[]; let nombre=[];let codigo=[];
                for (let index = 0; index < res.data.length; index++) {
                   //let fecha =(res.data[index].corte).substr(0,10) 
                   codigo.push([res.data[index].cod_linea])    ;
                   nombre.push([res.data[index].nom_linea])
                   let avancelinea= (res.data[index].avance_linea).substr(0,5)
                   ordenar.push([avancelinea])
                   bot.sendMessage(chatId, ' \nNombre <strong> '+nombre[index]+'</strong>' +'\nAvance <strong> '+ordenar[index]+'% </strong>', {parse_mode:'HTML'})
                    
                }
                
            } )
         }
    })
});

bot.onText(/\/ejecucion/, function(msg, match){
    //  let plan = match[1];
    let chatId= msg.chat.id; 
    request(`https://api.avanzamedellin.info/pa/api/avancefinanciero`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, "<b>Finanzas Proyectos de Inversión</b>", {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                
                   let poai =((res.data[0].poai))
                   let pptoajustado=(((res.data[0].pptoajustado)))
                   let pptoejecutado=(((res.data[0].pptoejecutado)))
                   let compromisos=(((res.data[0].compromisos)))
                   let disponible=(((res.data[0].disponible)))
                   let ordenado=(((res.data[0].ordenado)))
                   let porc_ejecutado= ((parseFloat(pptoejecutado)/parseFloat(pptoajustado))*100).toFixed(2)
                   let total=(((res.data[0].total)))

                   //let avancelinea= (res.data[index].avance_linea).substr(0,5)
                   //ordenar.push([avancelinea])
                  bot.sendMessage(chatId,   ' \nPOAI <strong>'+formatter.format(poai)+'</strong>'
                                            +'\nPpto. Ajustado <strong> '+formatter.format(pptoajustado)+'</strong>'
                                            +'\nPpto. Ejecutado <strong> '+formatter.format(pptoejecutado)+'</strong>'
                                            +'\nCompromisos <strong> '+formatter.format(compromisos)+'</strong>'
                                            +'\nDisponibles <strong> '+formatter.format(disponible)+'</strong>'
                                            +'\nOrdenado <strong> '+formatter.format(ordenado)+'</strong>'
                                            +'\n---------------------'
                                            +'\nTotal <strong> '+formatter.format(total)+'</strong>'
                                            +'\n%Ejecución <strong> '+porc_ejecutado+'%</strong>'
                                            +'\n(cifras en millones de pesos)'
                                         
                                            ,{parse_mode:'HTML'})
              
               
                
            } )
         }
    })

    
});



bot.on('message', (msg) => {
    var avance = "Avance";
    if (msg.text.indexOf(avance) === 0) {
        bot.sendMessage(msg.chat.id,"<b>Avance</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Resultados</b>", {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var avances=[]; let cortes=[];
                    for (let index = 0; index < res.data.length; index++) {
                        if (res.data[index].tipo_corte=='N') {
                           let fecha =(res.data[index].corte).substr(0,10) 
                           let avance= parseFloat(res.data[index].avance).toFixed(2)
                           let id =parseInt(res.data[index].id)
                           avances.push({
                              "id": id,
                              "fecha": fecha,
                              "avance":avance
                            })
                        }
                    }
                    avances.sort((a, b) =>  b.id - a.id )     
                    for (let index = 0; index < avances.length; index++) {
                        bot.sendMessage(chatId,
                        '\nCorte <strong> '+avances[index].fecha+'</strong>'
                        +'\nAvance <strong> '+avances[index].avance+'%</strong>'
                        ,{parse_mode:'HTML'})                       
                    }
                } )
             }
           //  bot.sendMessage(chatId, 'Hola Mundo3!!!')
        })
        
    }

    var cumple = "Cumplimiento";
    if (msg.text.indexOf(cumple) === 0) {
        bot.sendMessage(msg.chat.id, "<b>Cumplimiento</b>", {parse_mode:"HTML"});

        let chatId= msg.chat.id; 
        request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var cumple=[]; let cortes=[];
                    for (let index = 0; index < res.data.length; index++) {
                        if (res.data[index].tipo_corte=='N') {
                           let fecha =(res.data[index].corte).substr(0,10) 
                           let cumplimiento= parseFloat(res.data[index].cumplimiento).toFixed(2)
                           let id =parseInt(res.data[index].id)
                           cumple.push({
                              "id": id,
                              "fecha": fecha,
                              "cumplimiento":cumplimiento
                            })
                        }
                    }
                    cumple.sort((a, b) =>  b.id - a.id )     
                    for (let index = 0; index < cumple.length; index++) {
                        bot.sendMessage(chatId,
                        '\nCorte <strong> '+cumple[index].fecha+'</strong>'
                        +'\nCumplimiento <strong> '+cumple[index].cumplimiento+'%</strong>'
                        ,{parse_mode:'HTML'})                       
                    }
                } )
            }
        })
    }

    var linea = "Lineas";
    if (msg.text.indexOf(linea) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Avance Líneas</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        request(`https://api.avanzamedellin.info/pi/api/total-avance-lineas`, function(error, response,body){
            if(!error && response.statusCode==200){ bot.sendMessage(chatId, `<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var ordenar=[]; let nombre=[];let codigo=[];
                    for (let index = 0; index < res.data.length; index++) {
                        //let fecha =(res.data[index].corte).substr(0,10) 
                        codigo.push([res.data[index].cod_linea])    ;
                        nombre.push([res.data[index].nom_linea])
                        let avancelinea= (res.data[index].avance_linea).substr(0,5)
                        ordenar.push([avancelinea])
                        bot.sendMessage(chatId, ' \nNombre <strong> '+nombre[index]+'</strong>' +'\nAvance <strong> '+ordenar[index]+'% </strong>', {parse_mode:'HTML'})
                        
                    }
                    
                    
                } )
             }
           //  bot.sendMessage(chatId, 'Hola Mundo3!!!')
        })

    }

    var proyeccion = "Proyeccion";
    if (msg.text.indexOf(proyeccion) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        var ordenar=[]; let cortes=[];
        request(`https://api.avanzamedellin.info/pi/api/generalpi`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b style='color:red'>Proyección</b>", {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    
                    for (let index = 0; index < res.data.length; index++) {
                        if (res.data[index].tipo_corte=='P') {
                            let fecha =(res.data[index].corte).substr(0,10) 
                            ordenar.push([(res.data[index].cumplimiento).substr(0,5)])
                            cortes.push([fecha])
                            bot.sendMessage(chatId,  'Corte: '+cortes+ ' \nProyección <strong> '+ordenar+'% </strong>', {parse_mode:'HTML'}) 
                          }
                         
                    }
                 
                } )
             }
          
        })

    }

    var ejecucion = "Ejecución";
    if (msg.text.indexOf(ejecucion) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b>Resultados</b>", {parse_mode:"HTML"});
        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
        let chatId= msg.chat.id; 
        request(`https://api.avanzamedellin.info/pa/api/avancefinanciero`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Finanzas Proyectos de Inversión</b>", {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    
                       let poai =((res.data[0].poai))
                       let pptoajustado=(((res.data[0].pptoajustado)))
                       let pptoejecutado=(((res.data[0].pptoejecutado)))
                       let compromisos=(((res.data[0].compromisos)))
                       let disponible=(((res.data[0].disponible)))
                       let ordenado=(((res.data[0].ordenado)))
                       let porc_ejecutado= ((parseFloat(pptoejecutado)/parseFloat(pptoajustado))*100).toFixed(2)
                       let total=(((res.data[0].total)))
    
                       //let avancelinea= (res.data[index].avance_linea).substr(0,5)
                       //ordenar.push([avancelinea])
                      bot.sendMessage(chatId,   ' \nPOAI <strong>'+formatter.format(poai)+'</strong>'
                                                +'\nPpto. Ajustado <strong> '+formatter.format(pptoajustado)+'</strong>'
                                                +'\nPpto. Ejecutado <strong> '+formatter.format(pptoejecutado)+'</strong>'
                                                +'\nCompromisos <strong> '+formatter.format(compromisos)+'</strong>'
                                                +'\nDisponibles <strong> '+formatter.format(disponible)+'</strong>'
                                                +'\nOrdenado <strong> '+formatter.format(ordenado)+'</strong>'
                                                +'\n---------------------'
                                                +'\nTotal <strong> '+formatter.format(total)+'</strong>'
                                                +'\n%Ejecución <strong> '+porc_ejecutado+'%</strong>'
                                                +'\n(cifras en millones de pesos)'
                                             
                                                ,{parse_mode:'HTML'})
                  
                   
                    
                } )
             }
        })

    }

    var alertas = "Alertas";
    if (msg.text.indexOf(alertas) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b>Resultados</b>", {parse_mode:"HTML"});
        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
        let chatId= msg.chat.id; 
        avancealertas(chatId)
    }

    var alto="Alto";
    const chatId = msg.chat.id;
    if (msg.text.indexOf(alto)===0) {
        bot.sendMessage(msg.chat.id,"<b>Dependencias Desempeño Alto </b>", {parse_mode:"HTML"});  
        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
        request(`https://api.avanzamedellin.info/pi/api/semaforo-corte/alertas`, function(error, response,body){
            if(!error && response.statusCode==200){
               let ordenaralto=[]
                bot.sendMessage(chatId, "<b>Alerta Avances Dep: </b>" , {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var icono=""
                    var avance=0
                    for (let index = 0; index < res.data.length; index++) {
                        avance= (parseFloat(res.data[index].avance)).toFixed(2)
                        //console.log(avance);
                        if (avance>=41.25){icono='🟢'
                            ordenaralto.push({
                                "cod_dep": res.data[index].cod_dep,
                                "nombre":res.data[index].nom_cortp,
                                "avance": avance,
                                "pic": icono 
                            })
                        }
                        ordenaralto.sort((a, b) =>  b.avance-a.avance )     
                    }
                    for (let index = 0; index < ordenaralto.length; index++) {
                        if (ordenaralto[index].avance>0) {
                            bot.sendMessage(chatId,
                            '\nDep <strong> '+ordenaralto[index].nombre+'</strong>'
                            +'\nAvance <strong> '+ordenaralto[index].avance+'%</strong>'
                            +'\nEstado <strong> '+ordenaralto[index].pic+'</strong>'
                            ,{parse_mode:'HTML'})                       
                        }
                    }
                })
            }
        })
    }
    var medio="Medio";
    if (msg.text.indexOf(medio)===0) {
        bot.sendMessage(msg.chat.id,"<b>Dependencias Desempeño Medio </b>", {parse_mode:"HTML"});
        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
        request(`https://api.avanzamedellin.info/pi/api/semaforo-corte/alertas`, function(error, response,body){
            if(!error && response.statusCode==200){
                let ordenarmedio=[]
                bot.sendMessage(chatId, "<b>Alerta Avances Dep: </b>" , {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var icono=""
                    var avance=0
                    for (let index = 0; index < res.data.length; index++) {
                        avance= (parseFloat(res.data[index].avance)).toFixed(2)
                        //console.log(avance);
                        /*if(avance<=22.50){icono='🔴'}else*/ 
                        if ((avance>27.50) &&( avance < 41.25) )
                        {
                            ordenarmedio.push({
                                "cod_dep": res.data[index].cod_dep,
                                "nombre":res.data[index].nom_cortp,
                                "avance": avance,
                                "pic":   '🟠'
                            })
                        }
                        ordenarmedio.sort((a, b) =>  b.avance-a.avance )     
                    }
                    for (let index = 0; index < ordenarmedio.length; index++) {
                        if (ordenarmedio[index].avance>0) {
                            bot.sendMessage(chatId,
                            '\nDep <strong> '+ordenarmedio[index].nombre+'</strong>'
                            +'\nAvance <strong> '+ordenarmedio[index].avance+'%</strong>'
                            +'\nEstado <strong> '+ordenarmedio[index].pic+'</strong>'
                            ,{parse_mode:'HTML'})                       
                        }
                    }
                   
                })
            }
        })
    }
    var bajo="Bajo";
    if (msg.text.indexOf(bajo)===0) {
        bot.sendMessage(msg.chat.id,"<b>Dependencias Desempeño Bajo </b>", {parse_mode:"HTML"});  
        request(`https://api.avanzamedellin.info/pi/api/semaforo-corte/alertas`, function(error, response,body){
            if(!error && response.statusCode==200){
                let ordenarbajo=[]
                bot.sendMessage(chatId, "<b>Alerta Avances Dep: </b>" , {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    var icono=""
                    var avance=0
                    for (let index = 0; index < res.data.length; index++) {
                        avance= (parseFloat(res.data[index].avance)).toFixed(2)
                        //console.log(avance);
                        if(avance<=27.50){
                            ordenarbajo.push({
                                "cod_dep": res.data[index].cod_dep,
                                "nombre":res.data[index].nom_cortp,
                                "avance": avance,
                                "pic":   icono='🔴'
                            })
                        }
                        ordenarbajo.sort((a, b) =>  b.avance-a.avance )     
                    }
                    for (let index = 0; index < ordenarbajo.length; index++) {
                        if (ordenarbajo[index].avance>0) {
                            bot.sendMessage(chatId,
                            '\nDep <strong> '+ordenarbajo[index].nombre+'</strong>'
                            +'\nAvance <strong> '+ordenarbajo[index].avance+'%</strong>'
                            +'\nEstado <strong> '+ordenarbajo[index].pic+'</strong>'
                            ,{parse_mode:'HTML'})                       
                        }
                    }
                })
            }
        })
    }

    var start= "start";
    if (msg.text.indexOf(start)===0) {
        home(start)
    }
});

bot.onText(/\/ejecutadolinea (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    let linea = parseInt(resp)
    bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b>`, {parse_mode:"HTML"});   
    ejecucionlinea(linea, chatId, resp)
  
});


async function corteactual()
{
    try {
        request(`https://api.avanzamedellin.info/pi/api/avance/corte`, function(error,response, body){
            if (!error && response.statusCode==200) {
                let res=JSON.parse(body);
                cortebot= res.data[0].corte.substr(0,10)
                return cortebot
            }
        })
    } catch (error) {
        console.error('Error corteactual: ', error);
    }
}



bot.onText(/\/indicador (.+)/, (msg, match) => {
    try {
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
       // https://api.avanzamedellin.info/pi/api/avance/corte
        bot.sendMessage(msg.chat.id, "<b >Avance Indicador</b>", {parse_mode:"HTML"});
        bot.sendMessage(msg.chat.id, `<b>${cortebot}</b>`, {parse_mode:"HTML"});
        request(`https://api.avanzamedellin.info/bot/api/indicador/${resp}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Resultado Indicador: </b>"+resp, {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                        var alerta=''
                        if(res.data[0].avance_cuatrienio != null){
                            let avanceIndicador= (parseFloat(res.data[0].avance_cuatrienio)*100).toFixed(2)
                            if(res.data[0].semafav==1){ alerta='🔴'}else if(res.data[0].semafav==3){alerta='🟢'}else if(res.data[0].semafav==2){alerta='🟠'}else{alerta='🔵'}
                            bot.sendMessage(chatId, 
                                '\nIndicador: <strong> '+res.data[0].nom_indicador+ '</strong>'
                                +'\n'
                                +'\n<strong>Definición:</strong>\n '+res.data[0].definicion
                                +'\n'
                                +'\nMeta Plan: <strong> '+res.data[0].meta_plan+'</strong>'
                                +'\nUnidad: <strong> '+res.data[0].unidad+'</strong>'
                                +'\nLB: <strong> '+res.data[0].lb_ind+'</strong>'
                                +'\nResponsable:<strong> '+res.data[0].responsable_plan+'</strong>'
                                +'\nResponsable Reporte:<strong> '+res.data[0].responsable_plan+'</strong>'
                                +'\n'
                                +'\nObservaciones Seguimiento: <strong> '+res.data[0].observaciones_indicador+'</strong>'
                                +'\n<strong>***********************************</strong>'
                                +'\nAvance Indicador: <strong> '+avanceIndicador+'%</strong>'
                                +'\nDesempeño: <strong> '+alerta+'</strong>'
                                +'\n<strong>***********************************</strong>'
                                +'\nObservación Ficha Metodológica  Indicador : <strong> '+res.data[0].observaciones+'</strong>'
                                , {parse_mode:'HTML'}) 
                        }else{
                            bot.sendMessage(chatId, "<b>El Indicador no existe en este Plan</b>", {parse_mode:"HTML"})
                        }
                    } )
            }
        })

         
    } catch (error) {
        console.error('Error Indicador :', error);
        
    }
  
});


async function ejecucionlinea (linea, chatId, resp){
    try {
      
        request(`https://api.avanzamedellin.info/pi/api/line/financiera/${linea}`, function(error, response,body){
            if(!error && response.statusCode==200){
               
                    bot.sendMessage(chatId, "<b>Finanzas Línea: </b>"+resp, {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                        if(res.data[0].pptoajustado != null){
                            let por_ejec=(parseFloat(res.data[0].ejecutado)/parseFloat(res.data[0].pptoajustado)*100)
                            bot.sendMessage(chatId,  '\nPpto Ajustado <strong> '+ formatter.format(res.data[0].pptoajustado)+'</strong>'+ '\nppto Ejecutado <strong> '+formatter.format(res.data[0].ejecutado)+ '</strong>'+'\n%Ejecución Línea <strong> '+(por_ejec).toFixed(2)+'%</strong>', {parse_mode:'HTML'}) 
                            //bot.sendMessage(chatId, 'hola '+body);
                        }else{
                            bot.sendMessage(chatId, "<b>La Línea no existe en este Plan</b>", {parse_mode:"HTML"})
                        }
                    } )
               
             }
         })
    } catch (error) {
        console.error('Error :', error);
        
    }
  
}

async function avancealertas(chatId){
    try {
        bot.sendMessage(chatId, "Alerta Avances Desempeño Dependencias", {
            "reply_markup":
            {
                "keyboard": 
                [
                   ["Alto 🟢" ] ,
                   [ "Medio 🟠" ],
                   ["Bajo 🔴"] ,
                   ["/start 🏠"],
                ]
            }
        });
    } catch (error) {console.error('Error: ', error);}
}

bot.onText(/\/valstat (.+)/, (msg, match) => {
    try {
        const chatId =  msg.chat.id;
        const resp = (match[1]); // the captured "whatever"
       //resp.toUpperCase()
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Valor Estadístico</b>", {parse_mode:"HTML"});
        request(`https://api.avanzamedellin.info/bot/api/valorestadistico/${resp.toUpperCase()}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Resultado encontrado para : </b>"+resp, {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                        var alerta=''
                        if(res.data[0].cod_dependencia != null){
                        let efiproyect =parseFloat(res.data[0].eficacia_proyecto).toFixed(2)
                          let corte= (res.data[0].corte_ejecucion.substr(0,10))
                            bot.sendMessage(chatId, 
                                '\nDependencia <strong> '+res.data[0].nombre_dep+ '</strong>'
                                +'\n<strong>Línea PDM :</strong> '+res.data[0].cod_linea
                                +'\nComponente PDM :<strong> '+res.data[0].cod_componente+'</strong>'
                                +'\nPrograma PDM : <strong> '+res.data[0].cod_programa+'</strong>'
                                +'\nCod_Proyecto: <strong> '+res.data[0].cod_proyecto+'</strong>'
                                +'\nProyecto : <strong> '+res.data[0].nom_proyecto+'</strong>'
                                +'\nCod valStat:<strong> '+res.data[0].cod_val_stat+'</strong>'
                                +'\nValStat:<strong> '+res.data[0].nom_val_stat+'</strong>'
                                +'\nUnidad de medida:<strong> '+res.data[0].u_medida+'</strong>'
                                +'\nMeta Plan: <strong> '+res.data[0].q_plan+'</strong>'
                                +'\nRealizado: <strong> '+res.data[0].q_real+'</strong>'
                                +'\nEficacia ValStat: <strong> '+res.data[0].eficacia_ve+'%</strong>'
                                +'\nEficacia Proyecto: <strong> '+efiproyect+'%</strong>'
                                 +'\nDescripción: <strong> '+res.data[0].obs_cod_siufp+'</strong>'
                                +'\nObservaciones Seguimiento: <strong> '+res.data[0].obs_val_stat+'</strong>'
                                +'\nCod SUIFP: <strong> '+res.data[0].cod_siufp_catal+'</strong>'
                               
                                +'\nCorte <strong> '+corte+'</strong>'
                                , {parse_mode:'HTML'}) 
                            
                        }else{
                            bot.sendMessage(chatId, "<b>Valor no encontrado</b>", {parse_mode:"HTML"})
                        }
                    } )
               
             }
         })

         
    } catch (error) {
        console.error('Error :', error);
        
    }
  
});


bot.onText(/\/proyecto (.+)/, (msg, match) => { 
  

    try {
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
       
        bot.sendMessage(msg.chat.id, "<b>Proyecto</b>", {parse_mode:"HTML"});
        request(`https://api.avanzamedellin.info/bot/api/proyecto/${resp}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Resultado encontrado para : </b>"+resp, {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                     
                        if(res.data[0].cod_dependencia != null){
                        let porce_financiera =parseFloat((res.data[0].ejec_financiera)*100).toFixed(2);
                        let porc_eficacia =parseFloat((res.data[0].porc_eficacia_proyecto)*100).toFixed(2); 
                        let porc_cumplimiento= (((parseFloat(res.data[0].ejec_financiera) )*0.50 +  (parseFloat(res.data[0].porc_eficacia_proyecto)*0.50))*100).toFixed(2); 
                        if (res.data[0].tipo_proyecto>0) {var tipoproyecto='Presupuesto Participativo' } else{var tipoproyecto='Iniciativa Institucional'}
                        let corte= (res.data[0].corte.substr(0,10))
                            bot.sendMessage(chatId, 
                                '\nProyecto <strong> '+res.data[0].nom_proyecto+ '</strong>'
                                +'\nLínea <strong> '+res.data[0].cod_linea + '</strong>'
                                +'\nComponente:<strong> '+res.data[0].cod_componente+'</strong>'
                                +'\nPrograma: <strong> '+res.data[0].cod_programa+'</strong>'
                                +'\nValores estadísticos:<strong> '+res.data[0].num_valstat+'</strong>'

                                +'\n% Ejec_Financiera:<strong> '+porce_financiera+'%</strong>'
                                +'\n% Eficacia:<strong> '+porc_eficacia+'%</strong>'
                                +'\n% Cumplimiento:<strong> '+porc_cumplimiento+'%</strong>'



                                +'\nPOAI: <strong> '+formatter.format(res.data[0].poai)+'</strong>'
                                +'\nPpto. Ajustado: <strong> '+formatter.format(res.data[0].ppto_ajustado)+'</strong>'
                                +'\nEjecucion: <strong> '+formatter.format(res.data[0].ejecucion)+'</strong>'
                                +'\nCompromisos: <strong> '+formatter.format(res.data[0].compromisos)+'</strong>'
                                +'\nPagos: <strong> '+formatter.format(res.data[0].pagos)+'</strong>'
                                +'\nFacturas: <strong> '+formatter.format(res.data[0].facturas)+'</strong>'
                                +'\nTipo Proyecto: <strong> '+tipoproyecto+'</strong>'
                                +'\nCorte <strong> '+corte+'</strong>'
                                , {parse_mode:'HTML'}) 
                            
                        }else{
                            bot.sendMessage(chatId, "<b>Valor no encontrado</b>", {parse_mode:"HTML"})
                        }
                    } )
               
             }
         })

         
    } catch (error) {
        console.error('Error :', error);
        
    }
  
});


bot.onText(/\/geoinversion/, function(msg, match){
    //  let plan = match[1];
    let chatId= msg.chat.id; 
    let inversion=[];
    request(`https://api.avanzamedellin.info/geo/api/territorio`, function(error, response,body){
        if(!error && response.statusCode==200){
            bot.sendMessage(chatId, `<b>Inversión Pública en el Territorio</b>\nCorte ${cortebot}`, {parse_mode:"HTML"})
            .then(function(msg){
                var res=JSON.parse(body);
                if(!error && response.statusCode==200){
                    for (let index = 0; index < res.data.length; index++) {

                            inversion.push({
                                "codcomuna": res.data[index].cod_comuna,
                                "nom_comuna": res.data[index].nombre,
                                "localizada":res.data[index].localizada,
                                "ciudad": res.data[index].ciudad,
                                "pp":res.data[index].pp,
                                "total":res.data[index].total,
                                "poblacion": res.data[index].poblacion

                            })

                    }
                    inversion.sort(function (a, b) {
                        if (a.codcomuna > b.codcomuna) {
                          return 1;
                        }
                        if (a.codcomuna < b.codcomuna) {
                          return -1;
                        }
                        return 0;
                      });
                   // console.log(inversion);

                  for (let index = 0; index < inversion.length; index++) {
                     
                    bot.sendMessage(chatId, 
                        ' \nTerritorio <strong>'+(inversion[index].nom_comuna)+'</strong>'
                        + '\nInversión Localizada : <strong> '+formatter.format(inversion[index].localizada)+'</strong>' 
                        + '\nInversión Ciudad : <strong> '+formatter.format(inversion[index].ciudad)+'</strong>' 
                        + '\nPresupuesto Participativo : <strong> '+formatter.format(inversion[index].pp)+'</strong>' 
                        + '\nTotal : <strong> '+formatter.format(inversion[index].total)+'</strong>'
                        + '\n <strong>*************************</strong>'
                        + '\nPoblación Territorio : <strong> '+(inversion[index].poblacion)+'</strong>'
                
                     
                    
                      ,{parse_mode:'HTML'})
                      
                  }
                  
                }        
                
            } )
         }
    })

    
});


bot.onText(/\/invercomuna (.+)/, (msg, match) => { 
    try {
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
       
        request(`https://api.avanzamedellin.info/bot/api/territorio/${resp}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Tipo inversión : </b>", {parse_mode:"HTML"})
                .then(function(msg){                       var res=JSON.parse(body);
                    if(res.data[0].cod_comuna != null){
                        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b> \nInversión <strong> ${(res.data[0].nom_comuna)}</strong>`, {parse_mode:"HTML"});   
                        bot.sendMessage(chatId, 
                            '\nInversión Localizada <strong> '+formatter.format(res.data[0].localizada)+ '</strong>'
                            +'\nInversión de Ciudad: <strong> '+formatter.format(res.data[0].ciudad)+'</strong>'
                            +'\nInversión PP: <strong> '+formatter.format(res.data[0].pp)+'</strong>'
                            +'\nTotal: <strong> '+formatter.format(res.data[0].total)+'</strong>'
                           , {parse_mode:'HTML'}) 
                        }else{
                            bot.sendMessage(chatId, "<b>Valor no encontrado</b>", {parse_mode:"HTML"})
                        }
                    } )
                }
            })
    } catch (error) {
        console.error('Error :', error);
        
    }
});

bot.onText(/\/dependencia (.+)/, (msg, match) => { 
    try {
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
       let avancedep=0; let icono='';
       let porc_fisico=0; let porc_ejecucion=0;let noprg=0;
        request(`https://api.avanzamedellin.info/bot/api/dependencias/${resp}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "Resultado", {parse_mode:"HTML"})
                .then(function(msg){
                    var res=JSON.parse(body);
                    if(res.data[0].nombre_dependencia != null){
                        bot.sendMessage(msg.chat.id,`<b>Corte ${cortebot} </b> \nDependencia <strong> ${(res.data[0].nombre_dependencia)}</strong>`, {parse_mode:"HTML"});   
                    
                       avancedep= ((parseFloat(res.data[0].avanceplan))*100).toFixed(3)
                       porc_fisico=((parseFloat(res.data[0].por_ejec_fisicadep))*100).toFixed(3)
                       porc_ejecucion= ((parseFloat(res.data[0].porc_ejec_finandep))*100).toFixed(3)
                       if(res.data[0].num_ind_noprgdep == null){ noprg=0} else { noprg=res.data[0].num_ind_noprgdep}
                        if (avancedep>=47.25){icono='🟢'}else if((avancedep<=27.50)){ (icono='🔴')}else {icono='🟠'}
                        console.log(avancedep);
                       bot.sendMessage(chatId, 
                            '\n% Avance Cuatrenial PDM <strong> '+avancedep+'%\nDesempeño:  '+icono+'</strong>'
                            +'\n% Ejecución Física <strong> '+(porc_fisico)+'%</strong>'
                            +'\n% Ejecución Financiera <strong> '+(porc_ejecucion)+'%</strong>'
                            +'\n<strong>***********************************</strong>'
                            +'\n<strong>Indicadores de Producto</strong>'
                            +'\n<strong>***********************************</strong>'
                            +'\nIndicadores No Programados: <strong> '+(noprg)+'</strong>'
                         
                            +'\nIndicadores Desempeño Bajo : <strong> '+(res.data[0].num_ind_bajodep)+'</strong>'
                            +'\nIndicadores Desempeño Medio : <strong> '+(res.data[0].num_ind_mediodep)+'</strong>'
                            +'\nIndicadores Desempeño Alto : <strong> '+(res.data[0].num_ind_altodep)+'</strong>'

                            +'\n<strong>***********************************</strong>'
                            +'\n<strong>Proyectos</strong>'
                            +'\n<strong>***********************************</strong>'
                            +'\nProyectos Iniciativa Institucional: <strong> '+(res.data[0].num_proy_iidep)+'</strong>'
                            +'\n Proyectos Presupuesto Participativo: <strong> '+(res.data[0].num_proy_ppdep)+'</strong>'
                            +'\nProyectos Saldos no ejecutables: <strong> '+(res.data[0].num_proy_saldonoejecdep)+'</strong>'
                            +'\nProyectos Ejecución saldos pendientes: <strong> '+(res.data[0].num_proy_ejecsaldpenddep)+'</strong>'

                            +'\n<strong>***********************************</strong>'
                            +'\n<strong>Inversión</strong>'
                            +'\n<strong>***********************************</strong>'

                            +'\nPOAI: <strong> '+formatter.format(res.data[0].poaidep)+'</strong>'
                            +'\nPpto. Ajustado: <strong> '+formatter.format(res.data[0].pptoajustadodep)+'</strong>'
                            +'\nPpto. Ejecutado: <strong> '+formatter.format(res.data[0].ejecuciondep)+'</strong>'


                            +'\nInversión Localizada: <strong> '+formatter.format(res.data[0].inver_localizadadep)+'</strong>'
                            +'\nInversión PP: <strong> '+formatter.format(res.data[0].inver_ppdep)+'</strong>'
                            +'\nInversión Ciudad: <strong> '+formatter.format(res.data[0].inver_ciudaddep)+'</strong>'
                            +'\nFortalecimiento Inst.: <strong> '+formatter.format(res.data[0].fort_instdep)+'</strong>'

                            //+'\nTotal: <strong> '+formatter.format(res.data[0].total)+'</strong>'
                           , {parse_mode:'HTML'}) 
                        }else{
                            bot.sendMessage(chatId, "<b>Código de Dependencia no encontrado</b>", {parse_mode:"HTML"})
                        }
                    } )
                }
            })
    } catch (error) {
        console.error('Error :', error);
        
    }
});



corteactual()

module.exports =app;
// Listening

const server = http.createServer(app)
server.listen(process.env.AWS_PORT||7800,()=>console.log('Servidor activo...'))
reload(app)
  

    