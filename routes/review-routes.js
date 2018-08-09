const express     = require('express');
const router      = express.Router();
const Review      = require ('../models/review');
const User          = require('../models/user')
const Brewery       = require('../models/brewery');
const Beer         = require('../models/beer');


//Delete said review
router.post('/beer/review/:reviewid/delete/:reviewindex', (req, res, next) => {
  const id = req.params.reviewid;
  const reviewindex = req.params.reviewIndex;

  Review.findByIdAndRemove(id)
  .then((response)=>{
    Beer.findById(response.belongsToBeer)
    .then((theBeer)=>{
      theBeer.review.splice(reviewindex, 1)
      theBeer.save()
      .then((blah)=>{
        res.json(response);
      })
    })
  })
  .catch((err)=>{
    next(err);
  });
});


router.get('/breweries/review', (req, res, next)=>{
  Brewery.findById(req.user.favBreweries[0])
  .then((theBrewery)=>{
    res.json(theBrewery.review);
  })

  .catch((err)=>{
    next(err);
  });
});



// //Create a review for that beer
// router.post('/review/create', (req, res, next)=>{
//   const newReview = {
//     author: req.body.author,
//     review: req.body.review
//   }

//   Beer.findById(req.user.myBrewery)
//   .then((theBrewery)=>{
//     theBrewery.review.unshift(newReview)
//     theBrewery.save()
//     .then((response)=>{
//       res.json(response)
//     })
//     .catch((err)=>{
//       res.json(err)
//     })
//   });
// });



//All reviews for that beer
router.get('/review', (req, res, next)=>{
  Review.find()
  .then((allBeerReviews)=>{
    res.json(allBeerReviews);
  })
  .catch((err)=>{
    next(err);
  });
});

//Create a review for that beer
router.post('/beers/:id/review/create', (req, res, next)=>{
  console.log('tha body: ', req.body)
  const newReview = new Review({
    author: req.user.id,
    review: req.body.review,
    rating: req.body.rating,
    belongsToBeer: req.params.id
  })
  newReview.save()
  .then((newReview)=>{
    console.log("this is the req params=============== ", req.params.id)
    console.log("this is the new review=============== ", newReview)

    Beer.findById(req.params.id)
    .then((thatBeerFromDb) => {
      console.log("THE BEER THAT IS HERE------------", thatBeerFromDb);
      thatBeerFromDb.review.push(newReview._id);
      thatBeerFromDb.save();
      res.status(200).json(thatBeerFromDb)
    })
    // res.json(response);
  })
  .catch((err)=>{
    res.json(err)
  })
})

//Edit your review
router.post('/beer/review/:reviewid/edit', (req, res, next) => {
  Review.findByIdAndUpdate(req.params.reviewid, {
    review: req.body.review,
    rating: req.body.rating,
  })
  .then((response) => {
    res.json(response)
  })
  .catch((err) => {
    next(err);
  });
});




module.exports = router;

