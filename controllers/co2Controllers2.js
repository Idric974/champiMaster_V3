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

let numSalle;
let numSalleCo2;
let relay;
let co2 = 0;
let co2Room = 0;
let etat = 0;
let test = 1;

//! -------------------------------------------------

//! Les tableaux.

let pendingRequest = [];

//! -------------------------------------------------

//! Les fonctions.

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

//! -------------------------------------------------

//! Les requetes.

async function getCo2(numSalle) {
  //
  numSalleCo2 = numSalle;

  try {
    return await new Promise((resolve, reject) => {
      pendingRequest.push({ numSalleCo2: numSalleCo2, resolve: resolve });

      launchProcessCO2();
    });
  } catch (err) {
    console.log('Erreur : co2Manager.js getCo2', err);
    console.log(magenta, '[ DEMANDE DE CO2  ] Demande de CO2 vide');
  }
}

async function launchProcessCO2() {
  let request = pendingRequest[0];

  //* Séléction du pin.

  let findGpio = () => {
    if (numSalleCo2 == 1) {
      relay = 12;
      // console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 2) {
      relay = 25;
      //  console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 3) {
      relay = 23;
      // console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 4) {
      relay = 24;
      //  console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 5) {
      relay = 5;
      //  console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 6) {
      relay = 6;
      //  console.log('GPIO = ', relay);
    } else if (numSalleCo2 == 7) {
      relay = 26;
      //  console.log('GPIO = ', relay);
    }
  };
  findGpio();

  //* -------------------------------------------------

  console.log(
    vert,
    '[ DEMANDE DE CO2  ] ******************** DÉMARRAGE DU CYCLE ******************** '
  );

  console.log(
    magenta,
    '[ DEMANDE DE CO2  ] La demande de la salle "' +
      numSalleCo2 +
      '" a été prise en compte.'
  );

  console.log(
    jaune,
    '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
    'DEMANDE CO2 SALLE :',
    numSalleCo2
  );

  console.log(
    magenta,
    '[ DEMANDE DE CO2  ] Demandes mises dans le pool salle :',
    pendingRequest[0]['numSalleCo2']
  );

  try {
    //! POMPE AIR SALLE.

    console.log(
      cyan,
      '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
      'POMPE AIR SALLE'
    );
    //* Activation du relais de la salle qui demande pour 102 sec.
    if (test === 1) {
      activationRelay(27, 102000); //! <==> Test.
      console.log(
        red,
        '[ DEMANDE DE CO2  ] POMPE AIR SALLE  : MODE = DÉVELOPPEMENT ==> Activation du relais de la salle qui demande pour 102 sec'
      );
    } else {
      activationRelay(relay, 102000);
      //  console.log(red,' [ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE = PRODUCTION ==> Activation du relais de la salle qui demande pour 102 sec');
    }

    //* On attend 1 seconde.
    await functionsLibrary.delay(1, 'seconde');

    //* Activation du relais 20 pour 100 sec.
    activationRelay(20, 100000);

    //* Lancement de la mesure du Co2 pour 90 sec.
    if (test === 1) {
      co2Room = 2500; //! <==> Test.
      console.log(
        red,
        '[ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE = DÉVELOPPEMENT ==> Lancement de la mesure du Co2 pour 90 sec'
      );
    } else {
      co2Room = await functionsLibrary.mesureCO2(90);
      // console.log(red,' [ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE PRODUCTION ==> Lancement de la mesure du Co2 pour 90 sec';
    }

    //* On attend 15 secondes.
    await functionsLibrary.delay(15, 'seconde');

    //? -------------------------------------------------

    //! POMPE AIR EXT.

    console.log(
      cyan,
      '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
      'POMPE AIR EXT'
    );

    //* Activation du relais 4 pour 25 sec.
    if (test === 1) {
      activationRelay(27, 25000); //! <==> Test.
      console.log(
        red,
        '[ DEMANDE DE CO2  ] POMPE AIR EXT : MODE = DÉVELOPPEMENT ==> Activation du relais 4 pour 25 sec'
      );
    } else {
      activationRelay(26, 25000);
      //  console.log(red, [ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE = PRODUCTION ==> Activation du relais 4 pour 25 sec');
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
    } else {
      //
      co2 = await functionsLibrary.mesureCO2(10);
      //  console.log(red,' [ DEMANDE DE CO2  ] POMPE AIR SALLE : MODE = PRODUCTION ==> Lancement de la mesure du Co2 pour 10 sec');
    }

    //* On attend 15 secondes.
    await functionsLibrary.delay(15, 'seconde');

    //? -------------------------------------------------

    //! ENVOIE VALEUR.

    console.log(
      cyan,
      '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
      'ENVOIE VALEUR : ',
      co2
    );

    //* Envoie du taux de Co2 au front.
    request.resolve(co2);

    //* Suppression de la demande en cours dans le pool.
    pendingRequest = [];

    console.log(cyan, '[ DEMANDE DE CO2  ] ETAT DU POOL :', pendingRequest);

    //? -------------------------------------------------
  } catch (err) {
    console.log(err, 'Erreur lors de la mesure du co2');
    // request.reject();
    pendingRequest = [];
  }
}

//? Export de la fonction.

module.exports = {
  getCo2: getCo2,
};
