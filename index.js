const express = require('express');
const { Op } = require('sequelize')
const app = express();
const { Joke } = require('./db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/jokes', async (req, res, next) => {
  try {
    // TODO - filter the jokes by tags and content
    const tags = req.query["tags"] || ""
    const content = req.query["content"] || ""
    let jokes = await Joke.findAll({
      where: {
        joke: {
          [Op.substring]: content
        }
      }
    });

    // Fetch jokes with matching content
    let matches = []
    jokes.forEach( joke => {
      const jokeTags = joke["tags"].split(",")
      if (jokeTags.indexOf(tags) !== -1){
        matches.push(joke)
      }
    });

    if (matches.length !== 0) {
      jokes = matches
    }

    res.send(jokes);
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// we export the app, not listening in here, so that we can run tests
module.exports = app;
