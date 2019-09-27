let express = require('express');
let PORT = process.env.PORT || 80;

let app = express();

let server = app.listen(PORT);

app.use(express.static("public"));
