const express = require('express');
//const config = require('../config');
const ServiceRegistry = require('./lib/serviceRegistry');

const service = express();

module.exports = (config) => {
    const log = config.log();
    const serviceRegistry = new ServiceRegistry(log)
    if (service.get('env') === 'development') {
        service.use((req, res, next) => {
            log.debug(`${req.method}:${req.url}`);
            return next();
        });
    }

service.put('/register/:servicename/:serviceversion/:serviceport', (req, res) => {
  console.log(">>>>>>>>> Register <<<<<<<<<<<<<<");
  const {servicename, serviceversion, serviceport} = req.params;
  const serviceip = req.socket.remoteAddress.includes('::') ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
  const serviceKey = serviceRegistry.register(servicename, serviceversion, serviceip, serviceport);
  return res.status(200).json({
    statusCode: "200",
    message: "Service registered successfully",
    service: ({
      serviceName: servicename,
      serviceVersion: serviceversion,
      serviceIp: serviceip,
      serviceport: serviceport,
      servicePath: `http://localhost/register/${serviceKey}`
    })
  });
});

service.delete('/unregister/:servicename/:serviceversion/:serviceport', (req, res) => {
  const {servicename, serviceversion, serviceport} = req.params;
  const serviceip = req.socket.remoteAddress.includes('::') ? `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
  const serviceKey = serviceRegistry.unregister(servicename, serviceversion, serviceip, serviceport);
  return res.json({
    statusCode: "200",
    message: "Service unregistered successfully",
    service: ({
      serviceName: servicename,
      serviceVersion: serviceversion,
      serviceIp: serviceip,
      serviceport: serviceport,
      // servicePath: `http://localhost/register/${serviceKey}`
    })
  })
});

service.get('/find/:servicename/:serviceversion', (req, res) => {
  const {servicename, serviceversion} = req.params;
  const serviceKey = serviceRegistry.getService(servicename, serviceversion);
  if(!serviceKey){
    res.status(400).json({
      statusCode: "400",
      message: "No service found"
    })
  } else {
    res.json({
      statusCode: "200",
      message: "Service found successfully",
      service: serviceKey
    })
  }
    
})

     // eslint-disable-next-line no-unused-vars
  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        statusCode: "500",
        message: error.message,
      },
    });
  });
  return service;
};


 