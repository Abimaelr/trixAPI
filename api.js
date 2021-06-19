const express = require('express');

const app = express();

const PORT = process.env.PORT || 8877;

app.get("/", (req,res) => {
    res.json({msg: "ok"})
})

app.listen(PORT, () => {
    console.log('teste...');
})
