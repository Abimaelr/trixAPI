const express = require('express');
const {results: data} = require('./data')

const app = express();

const PORT = process.env.PORT || 8877;
function calculateIndex(x,y) {
    const coordinate = [x,y];
    const distances = data.map(({coordinates}) => {
        const x = Math.pow((coordinates[0] - coordinate[0]),2);
        const y = Math.pow((coordinates[1] - coordinate[1]),2);
        return Math.sqrt((x+y));
    })
    const valueMin = Math.min(...distances);
    const index = distances.findIndex((number) => number === valueMin)
    return index;
}


app.get('/coordinates/:lat/:lon', (req,res) => {
    const response = data[calculateIndex(req.params.lat,req.params.lon)];
    console.log(response)
    res.json(response)
})

app.listen(PORT, () => {


})
