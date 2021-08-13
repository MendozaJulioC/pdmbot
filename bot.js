

require('dotenv').config();
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.token
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
bot.on("polling_error", console.log);
/*
bot.on('message', (message) => {
  const chatId = message.chat.id;

  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});
*/
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

   bot.onText(/\/start/, (msg) => {

    bot.sendMessage(msg.chat.id, "Welcome", {
        "reply_markup":
        {
            "keyboard": 
            [
                ["Avance", "Cumplimiento", "Proyeccion"],   
                ["Lineas"]
               ,
            ]
        }
    });
    
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
        