const dotenv = require("dotenv"); // require package to connect with file
dotenv.config();

const express = require('express'); // express for creating server
const mongoose = require("mongoose");
const methodOverride = require("method-override"); // new to be able to use method for form-usually just takes get and post
const morgan = require("morgan"); //new

const app = express();//instance to use the server

mongoose.connect(process.env.MONGODB_URI);

// See if necessary
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const Car = require("./models/car.js"); // to use model

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method")); // new to use it in form
app.use(morgan("dev")); //new
app.use(express.static('public'));


app.get("/", async (req, res) => {
    res.render("home.ejs");//rendering the view
  });
  
app.get("/cars/new", (req, res) => {
    res.render("cars/new.ejs");
});

app.get("/cars", async (req, res) => {
    const allCars = await Car.find();
    res.render("cars/index.ejs", { 
        cars: allCars 
    });// sending to ejs cars:all Cars to use it
  });


app.get("/cars/:carId", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/show.ejs", { car: foundCar });
});


// POST /cars
app.post("/cars", async (req, res) => {
    // when receiving the req.body is the object with the data received
    if (req.body.isReadyToUse === "on") {// transforming on to boolean
      req.body.isReadyToUse = true;
    } else {
      req.body.isReadyToUse = false;
    }
    await Car.create(req.body); // using a model to create car
    res.redirect("/cars"); 
  });

app.delete("/cars/:carId", async (req, res) => {
    await Car.findByIdAndDelete(req.params.carId);
    res.redirect("/cars");
});

// EDIT
app.get("/cars/:carId/edit", async (req, res) => {
    const foundCar = await Car.findById(req.params.carId);
    res.render("cars/edit.ejs", {
      car: foundCar,
    });
});

//UPDATE AFTER EDITING
app.put("/cars/:carId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToUse === "on") {
      req.body.isReadyToUse = true;
    } else {
      req.body.isReadyToUse = false;
    }
    
    // Update the car in the database
    await Car.findByIdAndUpdate(req.params.carId, req.body);
  
    // Redirect to the car's show page to see the updates
    res.redirect(`/cars/${req.params.carId}`);
  });

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
