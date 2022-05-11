const functionsLibrary = require('./functionsLibrary');
const Gpio = require('onoff').Gpio;

//* -------------------------------------------------

// let activationDesRelay = async () => {
//   try {
//     functionsLibrary.activationRelay(27, 3000);
//   } catch (err) {
//     console.log(err, 'Erreur lors de la mesure du co2');
//   }
// };

// activationDesRelay();

//* -------------------------------------------------

// const attendre = async () => {
//   try {
//     await functionsLibrary.delay(3, 'seconde');
//     console.log('Salut après 3 secondes');
//   } catch (err) {
//     console.log(err);
//   }
// };

// attendre();

//* -------------------------------------------------

// const heure = async () => {
//   try {
//     console.log('Il est :', functionsLibrary.displayTime());
//   } catch (err) {
//     console.log(err);
//   }
// };

// heure();

//* -------------------------------------------------

// const pin = async () => {
//   try {
//     functionsLibrary.getPin(1);
//   } catch (err) {
//     console.log(err);
//   }
// };

// pin();

//* -------------------------------------------------

// const Red = '\u001b[1;31m';
// const Green = '\u001b[1;32m';
// const Yellow = '\u001b[1;33m';
// const Blue = '\u001b[1;34m';
// const Purple = '\u001b[1;35m';
// const Cyan = '\u001b[1;36m';

// console.log(Cyan, 'Couleur');

//* -------------------------------------------------

let relayOn;
let relayOff;

relayOn = new Gpio(27, 'out', console.log('Relay Activé'));

setTimeout(() => {
  relayOff = new Gpio(27, 'in', console.log('Relay Déactivé'));
}, 3000);

//* -------------------------------------------------
