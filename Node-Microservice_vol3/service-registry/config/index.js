const bunyan = require('bunyan');
const pjs = require('../package.json');

const {name, version} = pjs;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) => bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'debug'),
  },
  production: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'info'),
  },
  test: {
    name,
    version,
    serviceTimeout: 30,
    log: () => getLogger(name, version, 'fatal'),
  },
};