const Gpio = require('onoff').Gpio;
const magenta = '\x1b[35m';

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

//! Similation de mesure Co2.

let tauxCo2;

let simulationMesureCo2 = () => {
  setTimeout(() => {
    tauxCo2 = 2600;
  }, 90000);
};

//! -------------------------------------------------

module.exports = { mesureCO2, delay, displayTime, simulationMesureCo2 };
