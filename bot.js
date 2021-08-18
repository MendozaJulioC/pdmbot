require('dotenv').config();
const express=require('express');
const app = express();
const port= process.env.PORT;
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.token
process.env.NTBA_FIX_319 = 1;

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

bot.onText(/\/ek0<<7/, function(message, match){
    //  let plan = match[1];
    let chatId= message.chat.id; 
   
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
        bot.sendMessage(msg.chat.id, "<b style='color:red'>Resultados</b>", {parse_mode:"HTML"});

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
});

bot.onText(/\/ejecucionlinea (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    let linea = parseInt(resp)
    request(`https://sse-pdm.herokuapp.com/pi/api/line/financiera/${resp}`, function(error, response,body){
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
           
           //    
           
           
         }
     })
});



// Listening
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});


    

        