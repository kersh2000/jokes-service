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

app.post('/jokes', async (req, res, next) => {
  try {
    const entry = await Joke.create({
      tags: req.body.tags,
      joke: req.body.joke
    })
    res.status(200).send(entry)
  } catch (error) {
    console.error(error)
    next(error)
  }
})

app.delete('/jokes/:id', async (req, res, next) => {
  try {
    await Joke.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).send("Joke successfully deleted from the database.")
  } catch (error) {
    console.error(error)
    next(error)
  }
})

app.put('/jokes/:id', async (req, res, next) => {
  try {
    const entry = await Joke.findByPk(req.params.id)
    await entry.update({tags: req.body.tags, joke: req.body.joke})
    res.status(200).send("Successfully update joke in the database.")
  } catch (error){
    console.error(error)
    next(error)
  }
})

// we export the app, not listening in here, so that we can run tests
module.exports = app;
