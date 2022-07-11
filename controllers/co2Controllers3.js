//! Les constantes.

const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const jaune = '\x1b[33m';
const vert = '\u001b[1;32m';
const red = '\u001b[1;31m';
const Gpio = require('onoff').Gpio;
const functionsLibrary = require('../tools/functionsLibrary');

//! -------------------------------------------------

//! Les variables.

let relay;
let co2 = 0;
let test = 0;

//! -------------------------------------------------

//! Les fonctions.

//? Activation relay.

const activationRelay = (relay, duree) => {
  //

  let convDuree = duree / 1000;

  let relay_ON = new Gpio(relay, 'out'); // ===> Activation relay.

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
    let relay_OFF = new Gpio(relay, 'in'); // ===> Déactivation relay.

    console.log(magenta, '[ DEMANDE DE CO2  ] Relay ' + relay + ' déactivé.');
  }, duree);
};

//? -------------------------------------------------

//? Trouver pin de la salle.

function findGpio(numSalle) {
  return new Promise((resolve, reject) => {
    if (numSalle == 1) {
      relay = 12;
      resolve();
      // console.log('GPIO = ', relay);
    } else if (numSalle == 2) {
      relay = 25;
      resolve();
      //  console.log('GPIO = ', relay);
    } else if (numSalle == 3) {
      relay = 23;
      resolve();
      // console.log('GPIO = ', relay);
    } else if (numSalle == 4) {
      relay = 24;
      resolve();
      //  console.log('GPIO = ', relay);
    } else if (numSalle == 5) {
      relay = 5;
      resolve();
      //  console.log('GPIO = ', relay);
    } else if (numSalle == 6) {
      relay = 6;
      resolve();
      // console.log('GPIO = ', relay);
    } else if (numSalle == 7) {
      relay = 26;
      resolve();
      //  console.log('GPIO = ', relay);
    } else {
      //
      console.log('ERREUR : findGpio');

      reject();
    }
  });
}

//? -------------------------------------------------

//? Messages de lancement du cycle..

function messagesDeLancement(numSalle) {
  return new Promise((resolve, reject) => {
    if (numSalle) {
      console.log(vert, '');

      console.log(
        vert,
        '[ DEMANDE DE CO2  ] ******************** DÉMARRAGE DU CYCLE ******************** '
      );

      console.log(
        jaune,
        '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
        'DEMANDE CO2 SALLE :',
        numSalle
      );

      resolve();
    } else {
      reject();
    }
  });
}

//? -------------------------------------------------

//? Pompe Air Salle.

function pompeAirSalle(numSalle) {
  return new Promise((resolve, reject) => {
    //
    if (numSalle) {
      //
      async function launchProcessCO2PompeAirSalle() {
        //
        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR SALLE'
        );

        //* Activation du relais de la salle qui demande pour 102 sec.

        if (test === 1) {
          //
          activationRelay(27, 102000); //! <==> Test.
          console.log(
            red,
            '[ DEMANDE DE CO2  ] POMPE AIR SALLE  : MODE = DÉVELOPPEMENT ==> Activation du relais de la salle qui demande pour 102 sec'
          );
          //
        } else {
          //
          activationRelay(relay, 102000);
        }

        //* On attend 1 seconde.

        await functionsLibrary.delay(1, 'seconde');

        //* Activation du relais 20 pour 100 sec.

        activationRelay(20, 100000);

        //* Lancement de la mesure du Co2 pour 90 sec.

        if (test === 1) {
          //
          co2Room = 2500; //! <==> Test.

          console.log(
            red,
            '[ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE = DÉVELOPPEMENT ==> Lancement de la mesure du Co2 pour 90 sec'
          );
          //
        } else {
          //
          co2Room = await functionsLibrary.mesureCO2(90);
        }

        //* On attend 15 secondes.

        await functionsLibrary.delay(15, 'seconde');

        resolve();
      }

      launchProcessCO2PompeAirSalle();
      //
    } else {
      //
      console.log('ERREUR : pompeAirSalle');

      reject();
    }
  });
}

//? Pompe Air Ext.

function pompeAirExt(numSalle) {
  return new Promise((resolve, reject) => {
    //
    if (numSalle) {
      //
      async function launchProcessCO2PompeAirExt() {
        //
        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR EXT'
        );

        //* Activation du relais 4 pour 25 sec.

        if (test === 1) {
          //
          activationRelay(27, 25000); //! <==> Test.

          console.log(
            red,
            '[ DEMANDE DE CO2  ] POMPE AIR EXT : MODE = DÉVELOPPEMENT ==> Activation du relais 4 pour 25 sec'
          );
          //
        } else {
          //
          activationRelay(26, 25000);
        }

        //* On attend 1 seconde.

        await functionsLibrary.delay(1, 'seconde');

        //* Activation du relais 20 pour 20 sec.

        activationRelay(20, 20000);

        //* Lancement de la mesure du Co2 pour 10 sec.

        if (test === 1) {
          //
          co2 = 3500; //! <==> Test.

          console.log(
            red,
            '[ DEMANDE DE CO2  ] POMPE AIR EXT : MODE = DÉVELOPPEMENT ==> Lancement de la mesure du Co2 pour 10 sec'
          );
          //
        } else {
          //
          co2 = await functionsLibrary.mesureCO2(10);
        }

        //* On attend 15 secondes.

        await functionsLibrary.delay(15, 'seconde');

        resolve();
      }

      launchProcessCO2PompeAirExt();
      //
    } else {
      //

      console.log('ERREUR : launchProcessCO2PompeAirExt');

      reject();
    }
  });
}

//? -------------------------------------------------

//? Envoie de la valeur au front.

function envoieResultat(numSalle) {
  return new Promise((resolve, reject) => {
    //
    if (numSalle) {
      //
      console.log(
        cyan,
        '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
        'ENVOIE VALEUR : ',
        co2
      );

      resolve();
      //
    } else {
      //

      console.log('ERREUR : envoieResultat');

      reject();
    }
  });
}

//! -------------------------------------------------

//! Exécution de la masure Co2.

async function getCo2(numSalle) {
  try {
    //
    await findGpio(numSalle);

    await messagesDeLancement(numSalle);

    await pompeAirSalle(numSalle);

    await pompeAirExt(numSalle);

    await envoieResultat(numSalle);

    return await new Promise((resolve, reject) => {
      if (numSalle) {
        resolve(co2);
        // console.log('OK OK ', co2);
      } else {
        console.log('ERREUR');
        reject();
      }
    });

    //
  } catch (err) {
    //
    console.log('err :', err);
  }
}

//! -------------------------------------------------

//! Export de la fonction.

module.exports = {
  getCo2,
};

//! -------------------------------------------------
