require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/UserModel');
const Restaurant = require('./models/RestaurantModel');
const Branch = require('./models/BranchModel');
const Menu = require('./models/MenuModel');
const Order = require('./models/OrderModel');
const Review = require('./models/ReviewModel');


mongoose.connect(`${process.env.DB_URL}?retryWrites=false`).then(() => {
  console.log("DB connection successfully");
}).catch(() => {
  console.log("DB connection failed ")
});
console.log("seeder started")
runSeeder();

async function runSeeder() {
  await User.deleteMany();
  await Branch.deleteMany();
  await Menu.deleteMany();
  await Restaurant.deleteMany();
  await Order.deleteMany();
  await Review.deleteMany();

  const users = [];
  for (let i = 0; i < 100; i++) {

    const randomLatitude = Math.random() * 180 - 90;
    const randomLongitude = Math.random() * 360 - 180;

    const sampleUser = new User({
      username: `user${i + 1}`,
      password: `password${i + 1}`,
      email: `user${i + 1}@example.com`,
      age: 25 + i,
      gender: i % 2 === 0 ? 'Male' : 'Female',
      profileImage: `avatar-profile-image-${i + 1}.jpg`,
      addresses: [
        {
          city: `City${i + 1}`,
          district: `District${i + 1}`,
          street: `Street${i + 1}`,
          location: {
            type: 'Point',
            coordinates: [randomLongitude, randomLatitude],
          },
        },
      ],
    });

    users.push(sampleUser);
  }

  const branches = [];
  for (let i = 1; i <= 100; i++) {
    const randomLatitude = Math.random() * 180 - 90;
    const randomLongitude = Math.random() * 360 - 180;

    let branchName = `Branch name ${i}`;

    if ([4].includes(i)) {  // Problem3 için 
      branchName = "Voco Fast Food";
    }

    const branch = new Branch({
      branchName: branchName,
      city: `City ${i}`,
      district: `District ${i}`,
      street: `Street ${i}`,
      location: {
        type: 'Point',
        coordinates: [randomLongitude, randomLatitude],
      },
    });

    branches.push(branch);
  }

  const menus = [];
  for (let i = 1; i <= 200; i++) {
    const menu = new Menu({
      itemName: `Menu Item ${i}`,
      price: i * 5,
      content: `Content for Menu Item ${i}`,
      coverImage: `avatar-cover-image-${i}.jpg`,
    });

    menus.push(menu);
  }

  const restaurants = [];
  for (let i = 1; i <= 50; i++) {


    let description = `Description for Restaurant ${i}`;

    if ([4, 8, 12, 27, 39, 47].includes(i)) {  // Problem2 için 
        description += " lahmacun";
    }

    if ([28,30,45].includes(i)) {  // Problem5 için 
      description += " fast";
  }

    let restaurantType = [`Type${i}`, `Type${i + 1}`];

    if ([4, 8, 12, 27, 39, 47].includes(i)) {  // Problem5 için 
      restaurantType = [`fast food`, `Type${i + 1}`];
    }

    if ([5, 10, 11].includes(i)) {  // Problem5 için 
      restaurantType = [`ev yemekleri`, `Type${i + 1}`];
    }

    const restaurant = new Restaurant({
      name: `Restaurant ${i}`,
      description: description,
      logo: `avatar-logo-${i}.jpg`,
      branches: branches.slice((i - 1) * 2, i * 2),
      menus: menus.slice((i - 1) * 4, i * 4),
      restaurantType:restaurantType,
    });

    restaurants.push(restaurant);
  }


  await User.insertMany(users);
  await Branch.insertMany(branches);
  await Menu.insertMany(menus);
  await Restaurant.insertMany(restaurants);

  const reviews = [];
  const orders = [];
  const allRestaurant = await Restaurant.find().populate('branches').populate('menus');

  for (let i = 1; i <= 60; i++) {

    const randRestMath = Math.floor(Math.random() * restaurants.length);

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRestaurant = allRestaurant[randRestMath];
    const randomBranch = allRestaurant[randRestMath].branches[Math.floor(Math.random() * allRestaurant[randRestMath].branches.length)];
    const randomMenu = allRestaurant[randRestMath].menus[Math.floor(Math.random() * allRestaurant[randRestMath].menus.length)];

    const order = new Order({
      user: {
        userId: randomUser._id,
        username: randomUser.username,
        email: randomUser.email,
        age: randomUser.age,
        gender: randomUser.gender,
        profileImage: randomUser.profileImage,
        address: randomUser.addresses[0],
      },
      restaurant: {
        restaurantId: randomRestaurant._id,
        name: randomRestaurant.name,
        description: randomRestaurant.description,
        logo: randomRestaurant.logo,
        branch: {
          branchId: randomBranch._id,
          branchName: randomBranch.branchName,
          city: randomBranch.city,
          district: randomBranch.district,
          street: randomBranch.street,
          location: randomBranch.location,
        },
        restaurantType: randomRestaurant.restaurantType,
      },
      items: [
        {
          itemId: randomMenu._id,
          itemName: randomMenu.itemName,
          content: randomMenu.content,
          coverImage: randomMenu.coverImage,
          price: randomMenu.price,
          quantity: Math.floor(Math.random() * 5) + 1,
        },
      ],
      orderDate: new Date(),
      is_review: true,
    });

    orders.push(order);

    await delay(30);

    const review = new Review({
      orderId:order,
      userId: order.user.userId,
      restaurantId: order.restaurant.restaurantId,
      branchId: order.restaurant.branch.branchId,
      comment: `User comment-${i}`,
      rating: Math.floor(Math.random() * 10) + 1,
    });

   
    await Review.insertMany(review);
  }


  await Order.insertMany(orders);


  mongoose.disconnect();
  console.log("db disconnect and seeder completed successfully");
}


function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}