const http = require('http');
const debug = require('debug')('node-angular');
const app = require('./backend/app');

const normalizePort = (val)=>{
    var port = parseInt(val,10);

    if(isNaN(port)){
        return val;
    }

    if(port >= 0){
        return port;
    }

    return false;
}

const onError = (err)=>{
    if(err.syscall !== "listen"){
        throw err;
    }
    
    const bind = typeof port === "string" ? "pipe" + port : "port " + port;
    if(error.code === "EACCES"){
        console.error(bind + " requires elevated privages");
        process.exit(1);
        return;
    } else if (error.code === "EADDRINUSE"){
        console.error(bind + " is already in use");
        process.exit(1);
        return;
    } else { throw err }
}

const onListening = ()=>{
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe" + port : "port " + port;
    debug("Listening on " + bind);
}

const port = normalizePort(process.env.PORT || 4201);
app.set('port',port);

const server = http.createServer(app);
server.on("error",onError);
server.on("listening",onListening);
server.listen(port);