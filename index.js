let express = require('express');
let PORT = process.env.PORT || 3000;

let app = express();

let server = app.listen(PORT);

app.use(express.static("public"));
