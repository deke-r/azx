var express = require('express');
var app = express();
const cors=require('cors')
app.use(express.json());
app.use(cors())
app.use(require('./router/routes'));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Database Import--->Database
require('./Db/database');
// Database Import--->Database

app.listen(4000, () => {
    console.log(`Server running on port 4000`);
});
