const http = require('http');

const server = http.createServer((req,res)=>{
    res.end('1st Response');
});

server.listen(process.env.PORT || 4201);