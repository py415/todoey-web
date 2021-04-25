// Setup dependencies
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
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
mongoose.set("useFindAndModify", false);

// Setup item schema
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

const defaultItems = [item1, item2, item3];

// Setup list schema
const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const List = mongoose.model("List", listSchema);

let day = date.getDate();

// GET home route
app.get("/", (req, res) => {
  // Find all items in database
  Item.find({}, function (err, foundItems) {
    // Check if item database is empty
    if (foundItems.length === 0) {
      // Insert default items
      Item.insertMany(defaultItems, function (err, item) {
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

// GET customListName route
app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // Create new custom list name route
        const list = List({
          name: customListName,
          items: defaultItems,
        });

        list.save(function (err, result) {
          res.redirect("/" + customListName);
        });
      } else {
        // Render custom name page
        res.render("pages/list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// POST home route
app.post("/", (req, res) => {
  // Fetch newItem from text input field
  let itemName = req.body.newItem;
  let listName = req.body.list;

  // Create new to do list item
  const item = Item({
    name: itemName,
  });

  if (listName === day) {
    // Add new item to mongoDB
    item.save(function (err, result) {
      // Redirect page back to home route to show updated to do list
      res.redirect("/");
    });
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save(function (err, result) {
        res.redirect("/" + foundList.name);
      });
    });
  }
});

// POST delete route
app.post("/delete", (req, res) => {
  // Find item id connected to checkbox
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == day) {
    Item.findByIdAndDelete(checkedItemId, function (err, item) {
      if (err) {
        console.log(err);
      } else {
        console.log("Deleted: ", item);
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, list) => {
        res.redirect("/" + listName);
      }
    );
  }
});

// Listen for app on localhost port
app.listen(port, () => {
  console.log("Server is running on port", port);
});
