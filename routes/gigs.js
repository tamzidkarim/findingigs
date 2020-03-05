const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Gig = require('../models/Gig');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//GET gig list
router.get('/', (req, res) =>
  Gig.findAll()
    .then(gigs => {
      res.status(200).render('gigs', {
        gigs,
        allowProtoPropertiesByDefault: true,
        allowedProtoProperties: true,
      });
    })
    .catch(err => {
      console.log(err);

      res.sendStatus(401).json({
        error: err,
      });
    })
);

//DISPLAY ADD GIG FORM
router.get('/add', (req, res) => res.render('add'));

//ADD A GIG
router.post('/add', (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;
  let errors = [];

  if (!title) {
    errors.push({ text: 'Please add a title' });
  }
  if (!technologies) {
    errors.push({ text: 'Please add a technologies' });
  }
  if (!contact_email) {
    errors.push({ text: 'Please add a contact_email' });
  }
  if (!description) {
    errors.push({ text: 'Please add a description' });
  }

  if (errors.length > 0) {
    res.render('add', {
      errors,
      title,
      technologies,
      budget,
      contact_email,
      description,
    });
  } else {
    if (!budget) {
      budget = 'Unknown';
    } else {
      budget = `$${budget}`;
    }

    //MAKE LOWERCASE AND REMOVE SPACE
    technologies = technologies.toLowerCase().replace(/, /g, ',');

    Gig.create({
      title,
      technologies,
      description,
      budget,
      contact_email,
    })
      .then(() => res.redirect('/gigs'))
      .catch(err => console.log(err));
  }
});

//SEARCH FOR GIG
router.get('/search', (req, res) => {
  let { term } = req.query;
  term = term.toLowerCase();
  Gig.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
    .then(gigs => res.render('gigs', { gigs }))
    .catch(err => console.log(err));
});

module.exports = router;
