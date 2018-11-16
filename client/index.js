"use strict";

const express = require('express');
const bodyParser = require("body-parser");
const NodeApp = require('./components/NodeApp');
const app = new express();
// load routings
// require('./routes/api')(app);
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    if (err) {
        console.log('Invalid Request data');
        res.send('Invalid Request data');
    } else {
        next();
    }
});

const nodeApp = new NodeApp(app);
nodeApp.bootup();

// this.PORT = process.env.PORT || 3000;
// app.listen(this.PORT, () => console.log(`App listening on port ${this.PORT}!`));
