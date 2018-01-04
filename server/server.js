const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
var app = express();

app.use(express.static(publicPath))

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port:${process.env.PORT || 5000}`)
})
console.log(publicPath)