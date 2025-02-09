import log from "loglevel";
import chalk from "chalk";

//set default log level
log.setLevel(log.levels.INFO);

//customize log formats and levels
const originalFactory = log.methodFactory;

log.methodFactory = function (methodName, logLevel, loggerName) {
	const rawMethod = originalFactory(methodName, logLevel, loggerName);

	return function (message: string) {
		const timestamp = new Date().toISOString();
		let formattedMessage = `${timestamp} [${methodName.toUpperCase()}]: ${message}`;

		//     apply colors using chalk

		switch (methodName) {
			case "info":
				formattedMessage = chalk.blue(formattedMessage);
				break;
			case "error":
				formattedMessage = chalk.red(formattedMessage);
				break;
			case "debug":
				formattedMessage = chalk.green(formattedMessage);
				break;
			default:
				break;
		}

		rawMethod(formattedMessage);
	};
};

//rebuild the logger with the custom factory

log.setLevel(log.getLevel());

export default log;
