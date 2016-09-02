'use strict';

var startup = require('./startup.js');

/*
// uncaughtExceptions should ALWAYS `process.exit(1)`. This is just a
// placeholder for making sure we capture and/or log information about
// the error that occurred.
*/
process.on('uncaughtException', function (err) {
    console.error('AN UNCAUGHT ERROR OCCURRED >>>>>>>>>>>>>>>>>>>>>>>');
    console.error(err.message);

    if (err.innerError) {
        console.log('INTERNAL ERROR MESSAGE >>>>>>>>>>>>>>>>>>>>>>>');
        console.log(err.innerError.message);
        console.log('INTERNAL ERROR STACK >>>>>>>>>>>>>>>>>>>>>>>');
        console.log(err.innerError.stack);
    } else {
        console.log('ERROR STACK >>>>>>>>>>>>>>>>>>>>>>>');
        console.log(err.stack);
    }

    process.exit(1);
});

/*
// Start the Application
*/
startup.init();
