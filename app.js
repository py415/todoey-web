// Setup dependencies
const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const app = express();
const port = 3000;

// Set view engine to EJS
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Setup mongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const itemSchema = mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Buy eggs",
});

const item2 = new Item({
  name: "Buy milk",
});

const item3 = new Item({
  name: "Finish homework",
});

const itemList = [item1, item2, item3];

// GET home route
app.get("/", (req, res) => {
  let day = date.getDate();

  // Find all items in database
  Item.find({}, function (err, foundItems) {
    // Check if item database is empty
    if (foundItems.length === 0) {
      // Insert default items
      Item.insertMany(itemList, function (err, item) {
        if (err) {
          console.log(err);
        } else {
          console.log(item);
        }
      });

      res.redirect("/");
    } else {
      res.render("pages/list", { listTitle: day, newListItems: foundItems });
    }
  });
});

// POST home route
app.post("/", (req, res) => {
  // Fetch newItem from text input field
  let itemName = req.body.newItem;

  // Create new to do list item
  const item = Item({
    name: itemName,
  });

  // Add new item to mongoDB
  item.save();

  // Redirect page back to home route to show updated to do list
  res.redirect("/");
});

// POST delete route
app.post("/delete", (req, res) => {
  // Find item id connected to checkbox
  const checkboxId = req.body.checkbox;

  Item.findByIdAndDelete(checkboxId, function (err, item) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted: ", item);
      res.redirect("/");
    }
  });
});

// GET work route
app.get("/work", (req, res) => {
  res.render("pages/list", { listTitle: "Work", newListItems: workItems });
});

// Listen for app on localhost port
app.listen(port, () => {
  console.log("Server is running on port", port);
});
