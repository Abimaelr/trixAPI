const express = require('express');
const {results: data} = require('./data')
const fetch = require('node-fetch');
const csvparser = require('csv-parser');
const fs = require('fs');
const request = require('request');

// fetch('https://www.ecori.com.br/tabela/integracao.csv').then(data => console.log(Object.keys(data.body)))
async function getInverters(){
  const out = {available:[]}
  await request.get('https://www.ecori.com.br/tabela/integracao.csv', async function (error, response, body) {
      if (!error && response.statusCode == 200) {
          const csv = decodeURIComponent(body);
          const csvRows = csv.split('\r\n');
          let csvArr = [];
          csvRows.forEach(row => {csvArr = [...csvArr,row.split(';')]})
          csvArr.shift();
          csvArr.forEach(e => {
            const obj = {
              cod:e[0],
              name:e[1],
              hab:e[2] ,
              inversors:[
                {name: e[3],qnt: e[4]},
                {name: e[5],qnt: e[6]},
                {name: e[7],qnt: e[8]},
              ],
              otimizers: {name: e[9], qnt:e[10]},
              topology: e[11],
              exclude: e[12],
              components:[
                {name: e[13],qnt: e[14]},
                {name: e[15],qnt: e[16]},
                {name: e[17],qnt: e[18]},
                {name: e[19],qnt: e[20]},
                {name: e[21],qnt: e[22]},
                {name: e[23],qnt: e[24]},
                {name: e[25],qnt: e[26]},
                {name: e[27],qnt: e[28]},
                {name: e[29],qnt: e[30]},
                {name: e[31],qnt: e[32]},
                {name: e[33],qnt: e[34]},
                {name: e[35],qnt: e[36]},
                {name: e[37],qnt: e[38]},
                {name: e[39],qnt: e[40]},
                {name: e[41],qnt: e[42]},
                {name: e[43],qnt: e[44]},
                {name: e[45],qnt: e[46]},
                {name: e[47],qnt: e[48]},
                {name: e[49],qnt: e[50]},
                {name: e[51],qnt: e[52]},
                {name: e[53],qnt: e[54]},
              ],
              type: e[55],
              brand: e[56],
              price: e[57],
            }
            out.available = [...out.available, obj]
          })
          
          // return out;
          // Continue with your processing here.
      }
    })
    return out;
}
getInverters().then(a => console.log(a))

const app = express();

const PORT = process.env.PORT || 8877;
function calculateIndex(x,y) {
    const coordinate = [x,y];
    const distances = data.map(({coordinates}) => {
        const x = (coordinates[0] - coordinate[0])**2;
        const y = (coordinates[1] - coordinate[1])**2;
        const result = (x+y)**0.5
        return result;
    })
    const valueMin = Math.min(...distances);
    const index = distances.findIndex((number) => number === valueMin)
    return index;
}

app.get('/inverters', (req,res) => {
  res.json(response)
})

app.get('/coordinates/:lat,:lon', (req,res) => {
    const response = data[calculateIndex(req.params.lat,req.params.lon)];
    res.json(response)
})

app.listen(PORT, () => {


})
