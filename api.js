const express = require('express');

const app = express();

const PORT = process.env.PORT || 8877;

app.get("/", (req,res) => {
    res.json({msg: "Olá, Carlos Alberto!, Estamos trabalhando no desenvolvimento de nossa própria API para as aplicações da TRIX SOLAR"})
})

app.listen(PORT, () => {
    console.log('teste...');
})
