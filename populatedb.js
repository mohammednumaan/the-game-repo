#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Category = require("./models/category");

const games = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createGames();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name, desc) {
  const category = new Category({ name: name, description: desc });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}


async function gameCreate(index, name, dev, desc, price, category, stock) {
  const gameDetail = {
    name: name,
    developer: dev,
    description: desc,
    price: price,
    category: category,
    stock: stock
  };

  const game = new Game(gameDetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${name}`);
}


async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Action", "The action game category is an electrifying realm of gaming that thrusts players into adrenaline-charged scenarios filled with intense combat, daring feats, and heart-pounding excitement."),
    categoryCreate(1, "Strategy", "The strategy game category is a captivating world where players immerse themselves in the art of planning, decision-making, and tactical mastery."),
    categoryCreate(2, "Sports", "The sports game category immerses players in the exhilarating world of athletic competition, offering realistic simulations and arcade-style experiences across a wide variety of sports."),
  ]);
}



async function createGames() {
  console.log("Adding Games");
  await Promise.all([
    gameCreate(0,
      "Elden Ring",
      "FromSoftware Inc.",
      "THE NEW FANTASY ACTION RPG. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
      39.99,
      [categories[0]],
      200
    ),
    gameCreate(1,
      "Tekken 8",
      "Bandai Namco Studios Inc.FromSoftware Inc.",
      "Tekken 8 is a fighting game developed by Bandai Namco Studios and Arika.",
      69.99,
      [categories[0]],
      100
    ),
    gameCreate(2,
      "Sid Meier's Civilization VI",
      "Firaxis Games, Aspyr (Mac), Aspyr (Linux)",
      "Sid Meier's Civilization VI is a turn-based strategy 4X video game developed by Firaxis Games and published by 2K.",
      30.15,
      [categories[1]],
      250
    ),

    gameCreate(3,
      "Hearts of Iron IV",
      "Paradox Development Studio	Valve",
      "Victory is at your fingertips! Your ability to lead your nation is your supreme weapon, the strategy game Hearts of Iron IV lets you take command of any nation in World War II; the most engaging conflict in world history.",
      11.99,
      [categories[1]],
      50
    ),
    gameCreate(4, 
      "NBA 2K24",
      "Visual Concepts	",
      "NBA 2K24 is a 2023 basketball video game developed by Visual Concepts Austin and published by 2K, based on the National Basketball Association.",
      9.59,
      [categories[2]],
      300
    ),
    
    gameCreate(5,
      "eFootball™ 2024",
      "KONAMI",
      "The classic action soccer game with the most up-to-date data! Enjoy the fever pitch of 'real soccer' in eFootball™ 2024!",
      11.99,
      [categories[2]],
      456
    )  
  ]);
  
}
