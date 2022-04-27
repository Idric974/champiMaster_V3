let pendingRequest = [];
let etat = 0;

async function getCo2(room) {
  try {
    return await new Promise((resolve, reject) => {
      pendingRequest.push({ room: room, resolve: resolve });
      if (etat == 0) {
        etat = 1;
        launchProcessCO2();
      }
    });
  } catch (err) {
    console.log('Erreur : co2Manager.js getCo2', err);
  }
}

async function launchProcessCO2() {
  let request = pendingRequest[0];

  let co2 = 0;
  let co2Room = 0;

  try {
    console.log(displayTime(), 'Pompe air salle champ: ', request.room);

    activationRelay(request.room, 102);
    await delay(1, 'seconde');
    activationRelay(38, 100);
    co2Room = await mesureCO2(90);
    await delay(15, 'seconde');

    console.log(displayTime(), 'Pompe air ext');
    activationRelay(7, 25);
    await delay(1, 'seconde');
    activationRelay(38, 20);
    co2 = await mesureCO2(10);
    await delay(15, 'seconde');

    console.log(displayTime(), 'Envoie valeur : ', co2Room - 500);
    console.log(displayTime(), 'Fin demande co2: ', request.room);
    if (co2 > 0 && co2 < 4000) {
      co2Room -= 500;
      request.resolve(co2Room);
      pendingRequest.shift();

      if (pendingRequest.length > 0) {
        launchProcessCO2();
      } else {
        etat = 0;
      }
    }
  } catch (err) {
    console.log(err, 'Erreur lors de la mesure du co2');
    request.reject();
    pendingRequest.shift();

    if (pendingRequest.length > 0) {
      launchProcessCO2();
    } else {
      etat = 0;
    }
  }
}

function getPin(pin) {
  let relayPinGPIO = 0;

  switch (parseInt(pin)) {
    case 1:
      relayPinGPIO = 32;
      break;

    case 2:
      relayPinGPIO = 22;
      break;

    case 3:
      relayPinGPIO = 16;
      break;

    case 4:
      relayPinGPIO = 18;
      break;

    case 5:
      relayPinGPIO = 29;
      break;

    case 6:
      relayPinGPIO = 31;
      break;

    case 7:
      relayPinGPIO = 37;
      break;

    default:
      relayPinGPIO = pin;
      break;
  }

  return relayPinGPIO;
}

//! Activation Relay.

function activationRelay(relay, duree = 100) {
  let relayPinGPIO = getPin(relay);

  console.log(displayTime(), 'Debut activation relay (' + relay + ')');

  const { spawn } = require('child_process');

  const python = spawn('python', ['relayActivation.py', relayPinGPIO, duree]);

  python.stdout.on('data', (data) => {
    console.log(displayTime(), 'Fin activation relay (' + relayPinGPIO + ')');
  });

  python.on('close', (data) => {});
}

//! -------------------------------------------------

function mesureCO2(nbMesure = 90) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    let python = null;

    if (process.platform == 'win32') {
      python = spawn('python', ['testScript.py', nbMesure]);
    } else {
      python = spawn('python', ['K-30.py', nbMesure]);
    }

    python.stdout.on('data', (data) => {
      resolve(data.toString());
    });
  }).catch((err) => {
    console.log('mesureCO2', err);
  });
}

let delay = (duree, unite = 'millis') => {
  switch (unite) {
    case 'minute':
      duree = duree * 60 * 1000;
      break;

    case 'seconde':
      duree = duree * 1000;
      break;
  }

  return new Promise((resolve, reject) => {
    setTimeout(resolve, duree);
  });
};

function displayTime() {
  var str = '';

  var currentTime = new Date();
  var hours = currentTime.getHours();
  var minutes = currentTime.getMinutes();
  var seconds = currentTime.getSeconds();

  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  str += hours + ':' + minutes + ':' + seconds + ' ';

  return str;
}

module.exports = { getCo2: getCo2 };
