const express = require('express');
const app = express();


const getHome = async (req, res) => {
    try {
       //const message = req.session.msg; delete req.session.msg;

   //console.log(message)
        res.render('./home/index.html', {
            title: "botPDM",
          
        })
    } catch (e) {
        console.error('Error getHome ', e);
    }
}

const getContacto = async (req, res) => {
    try {
       //const message = req.session.msg; delete req.session.msg;
 
   //console.log(message)
        res.render('./home/index.html', {
            title: "bot-PDM"
          
        })
    } catch (e) {
        console.error('Error getHome ', e);
    }
}


module.exports =   {getHome, getContacto }