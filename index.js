const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database');
const router = require('./router');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

database.authenticate().then(() => console.log("Database is connectd.."))
    .catch((error) => console.log("Error while database is connecting ..", error))

app.use('/', router);
app.use(cors());
app.listen(5000, () => console.log("Server is running on port number : 5000"));