const express = require('express');
const {results: data} = require('./data')
const fetch = require('node-fetch');
const request = require('request-promise');

async function getInverters(){
  let out = {available:[]};
  await request('https://www.ecori.com.br/tabela/integracao.csv').then(response => {
          const csv = decodeURIComponent(response);
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
  });

})
  return out;
}

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

// Canadian JA Solar, DAH e BYD

app.get('/swera', async (req,res) => {
  const response = await getInverters();
  res.json(response)
});

const modelate =
  (db) => db.map((item) => {
    const data = item.cod.split('.');
    if(data.length === 5 && !item.cod.includes("SE")){
      const [inversor, boards, voltage, board, pot] = data;
      return {...item, inversor, boards, voltage, board, pot: pot*boards};
    }
    else if(data.length === 5 && item.cod.includes("SE")){
      const [inversor, voltage, boards , otimimzer, board] = data;
      const potRegex = board.split(/[A-Z]/);
      const pot = potRegex[potRegex.length - 1] * boards;
      return {...item, inversor, boards, voltage, board, pot};
    }
    else if(data.length === 6 && item.cod.includes("SE")){
      const [inversor, voltage, otimimzers, modelOtimizer, boards, board] = data;
      const potRegex = board.split(/[A-Z]/);
      const pot = potRegex[potRegex.length - 1] * boards;
      return {...item, inversor, boards, voltage, board, pot};
    }
  });

const kits = async() => {
  const {available} = await getInverters();
  const Canadian = available.filter(({cod}) => cod.includes("CND"));
  const DAH = available.filter(({cod}) => cod.includes("DAH"));
  const JA = available.filter(({cod}) => cod.includes("JA"));
  const BYD = available.filter(({cod}) => cod.includes("BYD"));
  
  const CanadianF = modelate(Canadian);
  const DAHF = modelate(DAH);
  const JAF = modelate(JA);
  const BYDF = modelate(BYD);
  const ALL = modelate(available);

  return {ALL,CanadianF,JAF,BYDF,DAHF};
}


app.get('/kits', async (req,res) => {
  res.json(await kits())
})

app.get('/coordinates/:lat,:lon', (req,res) => {
    const response = data[calculateIndex(req.params.lat,req.params.lon)];
    res.json(response)
})

app.listen(PORT, () => {


})
