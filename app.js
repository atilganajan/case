require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connect = require('./db/connect');
const Restaurant = require('./models/RestaurantModel');
const Branch = require('./models/BranchModel');
const Menu = require('./models/MenuModel');
const Review = require('./models/ReviewModel');
const app = express();

// DB Connect
connect();



// problem2
app.get('/problem2', async (req, res) => {
  const restaurantsWithLahmacun = await Restaurant.find(
    { description: { $regex: /lahmacun/i } },
    { branches: 1, _id: 0 }
  );

  const allBranches = [].concat(...restaurantsWithLahmacun.map(item => item.branches));

  const branches = await Branch.find({
    _id: { $in: allBranches },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [39.93, 32.85],
        },
      },
    },
  }).limit(5);

  res.send(branches);

});


// problem3
app.get('/problem3', async (req, res) => {

  const createMenus = async () => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const menu1 = await Menu.create({
        name: 'Küçük boy peynirli pizza',
        price: 50,
      });

      const menu2 = await Menu.create({
        name: 'Orta boy mantarlı pizza',
        price: 100,
      });

      const menu3 = await Menu.create({
        name: 'Hamburger',
        price: 120,
      });


      const restaurant = await Restaurant.findOne({ name: 'Voco Fast Food' }).session(session);

      restaurant.menus.push(menu1, menu2, menu3);
      await restaurant.save();
      await session.commitTransaction();

    } catch (error) {

      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  };

  createMenus().then(() => {
    res.send("successfully")
  }).catch((error) => {
    console.log(error)
    res.send(error)
  });

});


// problem4
app.get('/problem4', async (req, res) => {

  const page = req.query.page ? parseInt(req.query.page) : 1;
  const pageCount = 20;

  const skip = (page - 1) * pageCount;

  const reviews = await Review.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $match: {
        "user.gender": "Male"
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $skip: skip
    },
    {
      $limit: pageCount
    },
    {
      $project: {
        "user.username": 1,
        "user.age": 1,
        "rating": 1
      }
    }
  ]);
 
res.send(reviews);

});



// problem5
app.get('/problem5', async (req, res) => {
  const restaurants = await Restaurant.aggregate([
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "restaurantId",
        as: "reviews"
      }
    },
    {
      $addFields: {
        averageRating: {
          $avg: "$reviews.rating"
        }
      }
    },
    {
      $match: {

        $and: [
          { averageRating: { $gt: 4 } },
          {
            $or: [
              { "restaurantType": { $in: ["fast food", "ev yemekleri"] } },
              { "description": { $regex: /fast/i } }
            ]
          }
        ]
      }
    },
    {
      $project: {
        "name": 1,
        "description":1,
        "restaurantType":1
      }
    }
  ]);
  
  res.send(restaurants);

});



app.listen(process.env.PORT, () => {
  console.log(`Case app listening on port ${process.env.PORT}`)
})