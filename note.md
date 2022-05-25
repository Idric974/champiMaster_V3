//! -------------------------------------------------
const SerialPort = require('serialport');

SerialPort.list((err, ports) => {
console.log(ports)  
})

var myPort = new SerialPort('COM3', {
baudRate:9600
})

myPort.on('open', onOpen);
myPort.on('data', onData);
myPort.write('M01');

function onOpen(){
console.log("Open connection");
}

function onData(data){
console.log("on Data " + data);
}

while(true){
console.log(myPort.read())
}
