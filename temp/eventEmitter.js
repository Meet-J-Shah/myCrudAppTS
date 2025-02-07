// Importing the events module
const EventEmitter = require('events');

 //// Initializing instance of EventEmitter to be used
 //const emitter = new EventEmitter();

// // Creating events
// const person1 = (msg) => {
//     console.log("Message from person1: " + msg);
// };

// const person2 = (msg) => {
//     console.log("Message from person2: " + msg);
// };

// // Registering person1 and person2 with the printEvent
// emitter.addListener('printEvent', person1);
// emitter.addListener('printEvent', person2);

// // Triggering the created event
// emitter.emit('printEvent', "Event occurred");

// // Removing all the listeners associated with the event
// //emitter.removeAllListeners('printEvent');

// // Triggering the event again but no output
// // as all listeners are removed
// emitter.emit('printEvent', "Event occurred");

//order matters

const eventEmitter = new EventEmitter();

eventEmitter.on('data', (data) => {
    console.log('Listener 1 received:', data);
});

eventEmitter.once('data', (data) => {
    console.log('Listener 2 received:', data); //omly caleed once
});

eventEmitter.emit('data', 'Sample data');
eventEmitter.emit('data', 'Sample data'); // for calling multiple time