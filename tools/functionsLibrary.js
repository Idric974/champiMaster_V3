const Gpio = require('onoff').Gpio;
const magenta = '\x1b[35m';

//! Activation des relays.

const activationRelay = (relay, duree) => {
  let convDuree = duree / 1000;
  //   const relay_ON = new Gpio(relay, 'out');

  console.log(
    magenta,
    '[ DEMANDE DE CO2  ] Relay ' +
      relay +
      ' activé' +
      ' pour ' +
      convDuree +
      ' secondes.'
  );

  setTimeout(() => {
    // const relay_OFF = new Gpio(relay, 'in');
    console.log(magenta, '[ DEMANDE DE CO2  ] Relay ' + relay + ' déactivé.');
  }, duree);
};

//! -------------------------------------------------

//! Séléction du pin.

const getPin = (pin) => {
  let relayPinGPIO = 0;

  switch (parseInt(pin)) {
    case 1:
      relayPinGPIO = 12;
      break;

    case 2:
      relayPinGPIO = 25;
      break;

    case 3:
      relayPinGPIO = 23;
      break;

    case 4:
      relayPinGPIO = 24;
      break;

    case 5:
      relayPinGPIO = 5;
      break;

    case 6:
      relayPinGPIO = 6;
      break;

    case 7:
      relayPinGPIO = 26;
      break;

    default:
      relayPinGPIO = pin;
      break;
  }

  return relayPinGPIO;
};

//! -------------------------------------------------

//! Mesure du Co2.

const mesureCO2 = async (nbMesure = 90) => {
  try {
    return await new Promise((resolve, reject) => {
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
    });
  } catch (err) {
    console.log('mesureCO2', err);
  }
};

//! -------------------------------------------------

//! Les delay de temporisation.

const delay = (duree, unite = 'millis') => {
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

//! -------------------------------------------------

//! Affichage de l'heure d'une action.

const displayTime = () => {
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
};

//! -------------------------------------------------

module.exports = { activationRelay, getPin, mesureCO2, delay, displayTime };
