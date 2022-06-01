// temps = 3:12

//! Les constantes.

const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const jaune = '\x1b[33m';
const vert = '\u001b[1;32m';
const Gpio = require('onoff').Gpio;
const functionsLibrary = require('../tools/functionsLibrary');

//! -------------------------------------------------

//! Les variables.

let numSalle;
let relay;
let co2 = 0;
let co2Room = 0;

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

function getCo2(numSalle) {
  //
  //? 1) Reception de la demand de Co2.

  const maPromesse = new Promise((resolve, reject) => {
    //
    if (numSalle) {
      //

      console.log(
        vert,
        '[ DEMANDE DE CO2  ] ***********************************************************'
      );

      console.log(
        magenta,
        '[ DEMANDE DE CO2  ] La demande de la salle "' +
          numSalle +
          '" a été prise en compte.'
      );

      resolve();
    } else {
      //
      res.status(200).json({
        message: 'La demande de CO2 reçue est vide ',
      });

      console.log(magenta, '[ DEMANDE DE CO2  ] Demande de CO2 vide');

      reject();
    }
  });

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //? Validateur.

  let action = async () => {
    let go = await maPromesse;
    return go;
  };

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //? Processus de traitement des demandes..

  action()
    //
    //* Mettre les valeurs dans un tableau.

    .then(() => {
      pendingRequest.push(numSalle);
      console.log(
        magenta,
        '[ DEMANDE DE CO2  ] Demandes mises dans le pool :',
        pendingRequest
      );
    })

    //* -------------------------------------------------

    //* Séléction du pin.

    .then(() => {
      let findGpio = () => {
        if (numSalle == 1) {
          relay = 12;
          // console.log('GPIO = ', relay);
        } else if (numSalle == 2) {
          relay = 25;
          //  console.log('GPIO = ', relay);
        } else if (numSalle == 3) {
          relay = 23;
          // console.log('GPIO = ', relay);
        } else if (numSalle == 4) {
          relay = 24;
          //  console.log('GPIO = ', relay);
        } else if (numSalle == 5) {
          relay = 5;
          //  console.log('GPIO = ', relay);
        } else if (numSalle == 6) {
          relay = 6;
          //  console.log('GPIO = ', relay);
        } else if (numSalle == 7) {
          relay = 26;
          //  console.log('GPIO = ', relay);
        }
      };
      findGpio();
    })

    //* -------------------------------------------------

    //* Boucle sur le tableau.

    .then(() => {
      const launchProcessCO2 = async () => {
        //

        let numSalle = pendingRequest[0];

        console.log(
          jaune,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'DEMANDE CO2 SALLE :',
          numSalle
        );

        //? POMPE AIR SALLE.

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR SALLE'
        );

        //* Activation du relais de la salle qui demande pour 102 sec.
        activationRelay(27, 102000); //! <==> Test.
        // activationRelay(relay, 102000);

        //* On attend 1 seconde.
        await functionsLibrary.delay(1, 'seconde');

        //* Activation du relais 20 pour 100 sec.
        activationRelay(20, 100000);

        //* Lancement de la mesure du Co2 pour 90 sec.
        co2Room = 2500; //! <==> Test.
        // co2Room = await functionsLibrary.mesureCO2(90);

        //* On attend 15 secondes.
        await functionsLibrary.delay(15, 'seconde');

        //? -------------------------------------------------

        //? POMPE AIR EXT.

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR EXT'
        );

        //* Activation du relais 4 pour 25 sec.

        activationRelay(27, 25000); //! <==> Test.
        // activationRelay(4, 25);

        //* On attend 1 seconde.
        await functionsLibrary.delay(1, 'seconde');

        //* Activation du relais 20 pour 20 sec.
        activationRelay(20, 20000);

        //* Lancement de la mesure du Co2 pour 10 sec.
        co2 = 3500; //! <==> Test.
        // co2 = await functionsLibrary.mesureCO2(10);

        //* On attend 15 secondes.
        await functionsLibrary.delay(15, 'seconde');

        //? -------------------------------------------------

        //? ENVOIE VALEUR.

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'ENVOIE VALEUR : ',
          co2Room - 500
        );

        if (co2 > 0 && co2 < 4000) {
          co2Room -= 500;

          //* Envoie du taux de Co2 au front.

          request.resolve(co2Room); //! <======> VALEURE CO2.

          //* Suppression de la demande en cours dans le pool.
          pendingRequest.shift();

          console.log(
            jaune,
            '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
            'FIN DEMANDE CO2 SALLE : ',
            numSalle
          );

          //* Relance de la fonction si le pool n'est pas vide.
          if (pendingRequest.length > 0) {
            launchProcessCO2();
          } else {
            console.log(
              cyan,
              '[ DEMANDE DE CO2  ] ÉTAT DU POOL :',
              pendingRequest
            );
          }
        }

        //? -------------------------------------------------
      };

      launchProcessCO2();
    })

    //* -------------------------------------------------

    .catch(() => {
      console.log(
        magenta,
        '[ DEMANDE DE CO2  ] Catch ==> Erreur dans le processus de traitement des demandes.'
      );
    });

  //? ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}

//? Export de la fonction.

module.exports = {
  getCo2: getCo2,
};
