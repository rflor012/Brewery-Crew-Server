const express       = require('express');
const breweryRouter = express.Router();
const Beer          = require('../models/beer');
const Brewery       = require('../models/brewery');
const mongoose      = require('mongoose');
const User          = require('../models/user');

// All breweries
breweryRouter.get('/breweries', (req, res, next) => {
  Brewery.find()
    .then((allTheBreweries) => {
      res.json(allTheBreweries);
    })
    .catch((err)=> {
      res.json(err);
    });

});

//One Brewery
breweryRouter.get('/breweries/:id', (req, res, next)=>{
  Brewery.findById(req.params.id)
  .populate('beer.beerId')
  .then((breweryFromDB)=>{
     res.json(breweryFromDB)
  })
  .catch((err)=>{
    res.json(err)
  });
});

//Create a brewery
breweryRouter.post('/breweries/create', (req, res, next) => {
  const newBrewery = new Brewery({
    name:         req.body.name,
    address:      req.body.address,
    city:         req.body.city,
    state:        req.body.state,
    zip:          req.body.zip,
    phone:        req.body.phone,
    site:         req.body.site,
    hours:        req.body.hours,
    beers:        req.body.beers
  })
  
  newBrewery.save()
  .then((response)=>{

    let theID
    if(req.user){
      theID = req.user._id
    } else{
      theID=req.body.userId
    }
    User.findById(theID)
    .then((foundUser)=>{
      foundUser.myBrewery = (response._id)
      foundUser.save()
      .then(()=>{
      res.json(response)
      })
      .catch(err => (err))
    })
    .catch(err => (err))
    })
  .catch(err => res.json(err)) 
  })


//view brewery details
breweryRouter.get('/breweries/:id', (req, res , next)=>{
  Brewery.findById(req.params.id)
  .populate('Beer')
  .then((breweryFromDB)=>{
     res.json(breweryFromDB)
  })
  .catch((err)=>{
    res.json(err)
  });
});


//edit a brewery
breweryRouter.post('/breweries/:id/edit', (req, res, next)=>{
  Brewery.findByIdAndUpdate(req.params.id, {
    name:    req.body.name,
    address: req.body.address,
    city:    req.body.city,
    state:   req.body.state,
    zip:     req.body.zip,
    phone:   req.body.phone,
    site:    req.body.site,
    hours:   req.body.hours,
    beers:   req.body.beers
  })
  .then((response)=>{
    res.json(response)
  })
  .catch((err)=>{
    next(err);
  });
});

//delete a brewery
breweryRouter.post('/breweries/:id/delete', (req, res, next)=>{
  Brewery.findById(req.params.id)
  .then((breweryFromDB)=>{
    Beer.remove({_id: {$in: breweryFromDB.beers}})
    .then((beerFromDB)=>{
      console.log('Results from DB from delete beer', beerFromDB)
      Brewery.remove({_id: breweryFromDB._id})
      .then((brewFromDB)=>{
        console.log('Results from DB from delete brewery', brewFromDB)
        if (brewFromDB === null) {
          res.status(400).json({message: "Brewery not found"})
        }
        else {
          res.status(200).json(brewFromDB)
        }
      });
    });
  })
  .catch((err)=>{
    console.log("the error from deleting brewery", err)
    res.status(500).json({message: "nnnnoooooooooooo!"})
  })
});




module.exports = breweryRouter;
