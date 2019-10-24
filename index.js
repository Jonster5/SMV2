let PORT = process.env.PORT || 8000;

let express = require('express');

let app = express();

let server = app.listen(PORT);

app.use(express.static('public'));
