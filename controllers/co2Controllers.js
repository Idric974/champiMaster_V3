// temps = 3:12

//! Les constantes.

const magenta = '\x1b[35m';
const cyan = '\x1b[36m';
const jaune = '\x1b[33m';
const vert = '\u001b[1;32m';
const functionsLibrary = require('../tools/functionsLibrary');

//! -------------------------------------------------

//! Les variables.

let numSalle;
let co2 = 0;
let co2Room = 0;

//! -------------------------------------------------

//! Les tableaux.

let pendingRequest = [];
// let pendingRequest = ['1', '2', '3', '4', '5', '6'];
// let pendingRequest = ['1', '2'];

//! -------------------------------------------------

exports.getCo2 = async (req, res, next) => {
  //

  //! 1) Reception de la demand de Co2.

  const maPromesse = new Promise((resolve, reject) => {
    numSalle = req.body.numSalle;

    if (req.body.numSalle) {
      //

      console.log(
        magenta,
        '[ DEMANDE DE CO2  ] La demande de la salle "' +
          req.body.numSalle +
          '" a été prise en compte.'
      );

      // res.status(200).json({
      //   message:
      //     'La demande de la salle ' +
      //     req.body.numSalle +
      //     ' a été prise en compte.',
      // });

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

  //! -------------------------------------------------

  //! Validateur.

  let action = async () => {
    let go = await maPromesse;
    return go;
  };

  //! -------------------------------------------------

  //! Processus de traitement des demandes..

  action()
    //
    //* I ) Mettre les valeurs dans un tableau.

    .then(() => {
      pendingRequest.push(numSalle);
      console.log(
        magenta,
        '[ DEMANDE DE CO2  ] Demandes mises dans le pool :',
        pendingRequest
      );
    })

    //* -------------------------------------------------

    //* II ) Boucle sur le tableau.

    .then(() => {
      const launchProcessCO2 = async () => {
        //
        //* -------------------------------------------------

        let numSalle = pendingRequest[0];
        console.log(
          jaune,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'DEMANDE CO2 SALLE :',
          numSalle
        );

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR SALLE'
        );

        functionsLibrary.activationRelay(numSalle, 102);
        await functionsLibrary.delay(1, 'seconde');
        functionsLibrary.activationRelay(38, 100);
        //co2 = await functionsLibrary.mesureCO2(90);
        co2 = 2500;
        await functionsLibrary.delay(15, 'seconde');

        //* -------------------------------------------------

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'POMPE AIR EXT'
        );

        functionsLibrary.activationRelay(7, 25);
        await functionsLibrary.delay(1, 'seconde');
        functionsLibrary.activationRelay(38, 20);
        //co2 = await functionsLibrary.mesureCO2(10);
        co2 = 2500;
        await functionsLibrary.delay(15, 'seconde');

        //* -------------------------------------------------

        console.log(
          cyan,
          '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
          'ENVOIE VALEUR : ',
          co2Room - 500
        );

        if (co2 > 0 && co2 < 4000) {
          co2Room -= 500;

          res.status(200).json({ co2Room });

          console.log(
            cyan,
            '[ DEMANDE DE CO2  ] ÉTAT DU POOL :',
            pendingRequest
          );

          console.log(
            jaune,
            '[ DEMANDE DE CO2  ] ' + functionsLibrary.displayTime(),
            'FIN DEMANDE CO2 SALLE : ',
            numSalle
          );

          pendingRequest.shift();

          console.log(
            vert,
            '[ DEMANDE DE CO2  ] *********************************************'
          );

          // Relance de la fonction si le pool n'est pas vide.

          if (pendingRequest.length > 0) {
            launchProcessCO2();
          } else {
            console.log(
              vert,
              '*** TOUTES LES DEMANDES DE CO2 ONT ÉTÉ TRAITÉES ***'
            );
          }
        }
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

  //! -------------------------------------------------

  //! LIMITE -------------------------------------------------
};
