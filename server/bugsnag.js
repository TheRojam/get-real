Meteor.startup(function () {
/*  import bugsnag from '@bugsnag/js'*/
//  const bugsnag = Npm.require('@bugsnag/js');
//  const bugsnagClient = bugsnag('2395b223634eeaf999c05e55b2d65b8f');
/*  module.exports  = bugsnagClient;*/
/*  export { bugsnagClient };*/
});


// to test bugsnag:
// bugsnagClient.notify(new Error('Test error'));
// should work client and server

const bugsnag = Npm.require('@bugsnag/js');
const bugsnagClient = bugsnag('2395b223634eeaf999c05e55b2d65b8f');

const notify = function(message, stack) {
	if (typeof stack === 'string') {
		message += ` ${ stack }`;
	}
	let options = {};
	//if (Info) {
	//	options = { app: { version: Info.version, info: Info } };
	//}
	const error = new Error(message);
	error.stack = stack;
	bugsnagClient.notify(error, options);
};

process.on('uncaughtException', Meteor.bindEnvironment((error) => {
	notify(error.message, error.stack);
	throw error;
}));

const originalMeteorDebug = Meteor._debug;
Meteor._debug = function(...args) {
	notify(...args);
	return originalMeteorDebug(...args);
};