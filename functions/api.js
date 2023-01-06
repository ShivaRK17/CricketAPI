const express = require('express')
const cheerio = require('cheerio')
const axios = require('axios');
const serverless = require("serverless-http")
const app = express()
const PORT = process.env.PORT || 3000;
const url = `https://www.espn.in/cricket/scores`;

const router = express.Router()
  
router.get('/',(req,res)=>{
    res.json({
        "Project":"Cricket API",
        "author":"ShivaRK"
    })
})
router.get('/scores',(req,res)=>{
    let scores = []
    axios.get(url)
        .then((response)=>{
        let html = response.data;
        let $ = cheerio.load(html);
        $('.scoreCollection',html).each(function(){
            let matches = [];
            let match = $(this).find('.cscore');
            let title = $(this).find('.scoreEvent__title').text();
            match.each(function(){
                let overview = $(this).find('.cscore_info-overview').text();
                let status = $(this).find('.cscore_date').text();
                let team1 = {}
                let team2 = {};
                team1.name = ($(this).find('.cscore_item--home').find('.cscore_name--long').text());
                team1.img = ($(this).find('.cscore_item--home').find('.cscore_image').attr('data-src'));
                team1.score = ($(this).find('.cscore_item--home').find('.cscore_score').text());
                
                team2.name = ($(this).find('.cscore_item--away').find('.cscore_name--long').text());
                team2.img = ($(this).find('.cscore_item--away').find('.cscore_image').attr('data-src'));
                team2.score = ($(this).find('.cscore_item--away').find('.cscore_score').text());
                
                let commentry = $(this).find('.cscore_commentary--footer').find('.cscore_notes_game').text();
                matches.push({title,overview,status,team1,team2,commentry})
            })
            scores.push({matches});
        })
        console.log(scores);
        res.json(scores)
    }).catch((err)=>{
        console.log(err);
    }) 
})

app.use('/',router)
// app.use('/.netlify/functions/api',router)

module.exports.handler = serverless(app)
    
// app.listen(PORT,()=>{
//     console.log(`Server listening on port ${PORT}`);
// })


