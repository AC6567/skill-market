var express = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var slug = require("slug");
var router = express.Router();

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/skills');

var Skill = mongoose.model("Skill", {
  name: { type: String, required: true },
  skillTitle: { type: String, required: true },
  skillCategory: { type: String, required: true },
  tradeCategories: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

Skill.on('index', function(err) {
  if (err) {
    console.error(err);
  }
});

// var data = [{ serviceType: 'web development', cause: 'breast cancer', amount: '200', description: 'this is where the description will go!' }];

router.get('/', function(req, res, next) {
  fs.readFile('./routes/request.html', 'utf8', function(err, data){
    if(err){
      console.log(err);
      res.status(500).json({ error: 'Something went wrong! Fix it idiot!' });
    }
    res.send(data);
  });
});

var skillsUrl = '/skills';

router.post(skillsUrl, function(req, res, next){
  var newSkill = new Skill(req.body);
  newSkill.save(function(err, savedSkill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Validation Failed" });
    }
    console.log("savedSkill:", savedSkill);
    res.json(savedSkill);
  });
});

router.get(skillsUrl, function(req, res, next) {
  Skill.find({}).sort({ createdAt: 'desc' })
  .limit(20).exec(function(err, skills) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Could not retrieve skills" });
    }
    res.json(skills);
  });
});

router.get(skillsUrl + '/:id', function(req, res, next) {
  Skill.findOne({ _id: req.params.id }).exec(function(err, Skill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!skill) {
      res.status(404);
    }
    res.json(skill);
  });
});

router.patch(skillsUrl + "/:id", function(req, res) {
  Skill.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true } ).exec(function(err, updatedSkill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!updatedSkill) {
      res.status(404);
    }
    res.json(updatedSkill);
  });
});

router.delete(skillsUrl + "/:id", function(req, res) {
  Skill.findOneAndRemove({ _id: req.params.id }).exec(function(err, skill) {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Could not read skill data" });
    }
    if (!service) {
      res.status(404);
    }
    res.json({message: 'skill deleted'});
  });
});

module.exports = router;
