var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js'); // predict
const cls_model = require('./sdk/cls_model.js'); // classification

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1776541774:AAFWpcu8hxNBxYrwms-dtMJU-OJdxeWMVo0'
const bot = new TelegramBot(token, {polling: true});

state = 0
// main menu bots
bot.onText(/\/start/, (msg) => { 
        bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /Predict`
    );   
    state = 0;
});

bot.onText(/\/predict/, (msg) => { 
        bot.sendMessage(
        msg.chat.id,
        `masukkan nilai i|v contoh 3|3`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if (state == 1){
        s = msg.text.split("|");
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1])
                ]
            ).then((jres1)=>{
            console.log(jres1);
            
            cls_model.classify([parseFloat(s[0]), parseFloat(s[1]), parseFLoat(jres1[0]), parseFloat(jres1[1])]).then((jres2)=>{

                bot.sendMessage(
                    msg.chat.id,
                    `nilai v yang diprediksi adalah ${v} volt`
                    );
                bot.sendMessage(
                    msg.chat.id,
                    `nilai p yang diprediksi adalah ${p} watt`
                    );
                bot.sendMessage(
                    msg.chat.id,
                    `Klasifikasi Tegangan ${jres2}`
                    );
            })
        })
    }else{
        state = 0
    }
})
// routers
r.get('/classify/:i/:r', function(req, res, next) {    
    model.classify(
        [
            parseFloat(req.params.i), // string to float
            parseFloat(req.params.r)
        ]
    ).then((jres)=>{
        cls_model.classify(
            [
                parseFloat (req.params.i),
                parseFloat (req.params.r),
                parseFloat (jres[0]),
                parseFloat (jres[1])
                ]
            ).then((jres_)=>{
            res.json(jres_)
        })
    })
});
module.exports = r;
