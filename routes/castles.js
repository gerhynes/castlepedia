var express = require("express");
var router = express.Router();
var Castle = require("../models/castle");
var middleware = require("../middleware");

//INDEX - show all castles
router.get("/", function(req, res) {
  // Get all castles from DB
  Castle.find({}, function(err, allCastles) {
    if (err) {
      console.log(err);
    } else {
      res.render("castles/index", {
        castles: allCastles
      });
    }
  });
});

//CREATE - add new castles
router.post("/", middleware.isLoggedIn, function(req, res) {
  // get data from form and add to castles array
  var name = req.body.name;
  var image = req.body.image;
  var price = req.body.price;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var newCastle = {
    name: name,
    image: image,
    price: price,
    description: desc,
    author: author
  };
  // Create a new castle and save to DB
  Castle.create(newCastle, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      // redirect back to castles page
      res.redirect("/castles");
    }
  });
});

//NEW - show form to create new castle
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("castles/new");
});

//SHOW - shows more info about one castle
router.get("/:id", function(req, res) {
  // find the castle with the provided id
  Castle.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCastle) {
      if (err) {
        console.log(err);
      } else {
        // render show template with that castle
        res.render("castles/show", { castle: foundCastle });
      }
    });
});

// EDIT Castle route
router.get("/:id/edit", middleware.checkCastleOwnership, function(req, res) {
  Castle.findById(req.params.id, function(err, foundCastle) {
    res.render("castles/edit", { castle: foundCastle });
  });
});

// UPDATE Castle route
router.put("/:id", middleware.checkCastleOwnership, function(req, res) {
  // Find and update the correct castle
  Castle.findByIdAndUpdate(req.params.id, req.body.castle, function(
    err,
    updatedCastle
  ) {
    if (err) {
      res.redirect("/castles");
    } else {
      res.redirect("/castles/" + req.params.id);
    }
  });
  // Redirect to the show page
});

// DESTROY Castle route
router.delete("/:id", middleware.checkCastleOwnership, function(req, res) {
  Castle.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      res.redirect("/castles");
    } else {
      res.redirect("/castles");
    }
  });
});

module.exports = router;
