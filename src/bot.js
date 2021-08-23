require('dotenv').config();
const express=require('express');
const app = express();
const http = require('http')
const reload= require('reload')
//const port= process.env.PORT;

const TelegramBot = require('node-telegram-bot-api');
const token = process.env.token
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


const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", console.log);


/*
bot.on('message', (message) => {
  const chatId = message.chat.id;
  // send a message to the chat acknowledging receipt of their message
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
    bot.sendMessage(msg.chat.id, "Bienvenidos a la Medellín Futuro", {
        "reply_markup":
        {
            "keyboard": 
            [
                ["Avance 🚀 "   , "Cumplimiento ✅", "Proyeccion 🥇"],   
                ["Lineas📊 ", "Ejecución 🛠️", "Alertas 🚨"]
               ,
            ]
        }
    });
 });
 
var request= require('request')
 bot.onText(/\/avance/, function(message, match){
  //  let plan = match[1];
    let chatId= message.chat.id; 
    request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
    request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
    request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
   
    request(`https://sse-pdm.herokuapp.com/pi/api/total-avance-lineas`, function(error, response,body){
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
    request(`https://sse-pdm.herokuapp.com/pa/api/avancefinanciero`, function(error, response,body){
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
        bot.sendMessage(msg.chat.id,"<b style='color:red'>Avance</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
           //  bot.sendMessage(chatId, 'Hola Mundo3!!!')
        })
        
    }

    var cumple = "Cumplimiento";
    if (msg.text.indexOf(cumple) === 0) {
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Cumplimiento</b>", {parse_mode:"HTML"});

        let chatId= msg.chat.id; 
        request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
    }

    var linea = "Lineas";
    if (msg.text.indexOf(linea) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Avance Líneas</b>", {parse_mode:"HTML"});

        let chatId= msg.chat.id; 
        request(`https://sse-pdm.herokuapp.com/pi/api/total-avance-lineas`, function(error, response,body){
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
           //  bot.sendMessage(chatId, 'Hola Mundo3!!!')
        })

    }

    var proyeccion = "Proyeccion";
    if (msg.text.indexOf(proyeccion) ===0 ) {
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        var ordenar=[]; let cortes=[];
        request(`https://sse-pdm.herokuapp.com/pi/api/generalpi`, function(error, response,body){
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
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        request(`https://sse-pdm.herokuapp.com/pa/api/avancefinanciero`, function(error, response,body){
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
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"});
        let chatId= msg.chat.id; 
        avancealertas(chatId)
    }
});

bot.onText(/\/ejecutadolinea (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    let linea = parseInt(resp)
    ejecucionlinea(linea, chatId, resp)
  
});

bot.onText(/\/indicador (.+)/, (msg, match) => {
  

    try {
        const chatId = msg.chat.id;
        const resp = match[1]; // the captured "whatever"
       
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Avance Indicador</b>", {parse_mode:"HTML"});
        request(`https://sse-pdm.herokuapp.com/bot/api/indicador/${resp}`, function(error, response,body){
            if(!error && response.statusCode==200){
                bot.sendMessage(chatId, "<b>Resultado Indicador: </b>"+resp, {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                        var alerta=''
                        if(res.data[0].avance_cuatrienio != null){
                            let avanceIndicador= (parseFloat(res.data[0].avance_cuatrienio)*100).toFixed(2)
                            if(res.data[0].semafav==1){ alerta='🔴'}else if(res.data[0].semafav==3){alerta='🟢'}else if(es.data[0].semafav==2){alerta='🟠'}else{alerta='🔵'}
                            bot.sendMessage(chatId, 
                         
                                '\nIndicador <strong> '+res.data[0].nom_indicador+ '</strong>'
                               
                                +'\n<strong>Definición:</strong>\n '+res.data[0].defincion
                                +'\nMeta Plan <strong> '+res.data[0].meta_plan+'</strong>'
                                +'\nUnidad<strong> '+res.data[0].unidad+'</strong>'
                                +'\nLB<strong> '+res.data[0].lb_ind+'</strong>'
                                +'\nResponsable<strong> '+res.data[0].responsable_plan+'</strong>'
                                +'\nObs. Seguimiento<strong> '+res.data[0].observaciones+'</strong>'
                                +'\nAvance Indicador <strong> '+avanceIndicador+'%</strong>'
                                +'\nDesempeño <strong> '+alerta+'</strong>'

                                //+'\n%Ejecución Línea <strong> '+(por_ejec).toFixed(2)+'%</strong>'
                                , {parse_mode:'HTML'}) 
                            
                        }else{
                            bot.sendMessage(chatId, "<b>El Indicador no existe en este Plan</b>", {parse_mode:"HTML"})
                        }
                    } )
               
             }
         })

         
    } catch (error) {
        console.error('Error :', error);
        
    }
  
});


async function ejecucionlinea (linea, chatId, resp){
    try {

        request(`https://sse-pdm.herokuapp.com/pi/api/line/financiera/${linea}`, function(error, response,body){
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
        request(`https://sse-pdm.herokuapp.com/pi/api/semaforo-corte/alertas`, function(error, response,body){
            if(!error && response.statusCode==200){
               let ordenar=[]
               
                    bot.sendMessage(chatId, "<b>Alerta Avances Dep: </b>" , {parse_mode:"HTML"})
                    .then(function(msg){
                        var res=JSON.parse(body);
                        var icono=""
                        var avance=0
                        for (let index = 0; index < res.data.length; index++) {
                            avance= (parseFloat(res.data[index].avance)).toFixed(2)
                            //console.log(avance);
                            if(avance<=22.50){icono='🔴'}else if (avance>=33.75){icono='🟢'} else {icono='🟠'}    
                            ordenar.push({
                                "cod_dep": res.data[index].cod_dep,
                                "nombre":res.data[index].nom_cortp,
                                "avance": avance,
                                "pic": icono 
                            })
                            ordenar.sort((a, b) =>  b.avance-a.avance )     
                        }
                      
                        for (let index = 0; index < ordenar.length; index++) {
                            if (ordenar[index].avance>0) {
                                /*
                                bot.sendMessage(chatId,
                                '\nDep <strong> '+ordenar[index].nombre+'</strong>'
                                +'\nAvance <strong> '+ordenar[index].avance+'%</strong>'
                                +'\nEstado <strong> '+ordenar[index].pic+'</strong>'
                                ,{parse_mode:'HTML'})                       */
                                bot.sendMessage(chat.id, "Bienvenidos a la Medellín Futuro", {
                                    "reply_markup":
                                    {
                                        "keyboard": 
                                        [
                                            ["Alto"   , "Medio", "Bajo"]
                                          
                                           ,
                                        ]
                                    }
                                });
                            }
                        }
                    } )


          

        }
    })
    } catch (error) {console.error('Error: ', error);}
}

 



module.exports =app;
// Listening

const server = http.createServer(app)
server.listen(process.env.PORT||7800,()=>console.log('Servidor activo...'))
reload(app)
  

    