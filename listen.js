const { PORT = 9090 } = process.env;
const app = require('./app.js');

app.listen(PORT, err => {
    if (err) throw err;
    console.log(`Listening on ${PORT}`);
})
