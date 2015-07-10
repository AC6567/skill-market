var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var fs = require('fs');
var slug = require("slug");

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/mob');

var Service = mongoose.model("Service", {
  serviceType: { type: String, required: true },
  cause: { type: String, required: true },
  title: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

Service.on('index', function(err) {
  if (err) {
    console.error(err);
  }
});

var data = [{ serviceType: 'web development', cause: 'breast cancer', amount: '200', description: 'this is where the description will go!' }];

router.get('/', function(req, res, next) {
  fs.readFile('./routes/request.html', 'utf8', function(err, data){
    if(err){
      console.log(err);
      res.status(500).json({ error: 'shit fucked up reading the request file' });
    }
    res.send(data);
  });
});

var servicesUrl = '/services';

router.post(servicesUrl, function(req, res, next){
  var newService = new Service(req.body);
  newService.save(function(err, savedService) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedService:", savedService);
    res.json(savedService);
  });
});

router.get(servicesUrl, function(req, res, next) {
  Service.find({}).sort({ createdAt: 'desc' }).limit(20).exec(function(err, services) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve services" });
    }
    res.json(services);
  });
});

router.get(servicesUrl + '/:id', function(req, res, next) {
  Service.findOne({ _id: req.params.id }).exec(function(err, service) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read service data" });
    }
    if (!service) {
      res.status(404);
    }
    res.json(service);
  });
});

router.patch(servicesUrl + "/:id", function(req, res) {
  Service.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true } ).exec(function(err, updatedService) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read service data" });
    }
    if (!updatedService) {
      res.status(404);
    }
    res.json(updatedService);
  });
});

router.delete(servicesUrl + "/:id", function(req, res) {
  Service.findOneAndRemove({ _id: req.params.id }).exec(function(err, service) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read service data" });
    }
    if (!service) {
      res.status(404);
    }
    res.json({message: 'service deleted'});
  });
});

module.exports = router;
