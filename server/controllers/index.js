
const fs = require('fs');
const movies = JSON.parse(fs.readFileSync(`${__dirname}/../../data/movies.json`));


const hostIndex = (req, res) => {
  res.render('index');
};

const hostResults = (req, res) => {
  let results = movies;

  if(req.query.title) {
    // const lowerTitle = req.query.title.toLowerCase();
    // results = results.filter(movie => movie.title.toLowerCase().includes(lowerTitle));
    const queryWords = req.query.title
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

      //console.log(queryWords);

      results = results.filter(movie => {
        const titleWords = movie.title.toLowerCase().split(/\s+/);
        return queryWords.some(qWord => 
          titleWords.some(tWord => tWord.includes(qWord))
        );
      });
  }

  // narrowing search per parameter
  if(req.query.year) {
    const year = parseInt(req.query.year, 10);
    results = results.filter(movie => movie.year === year);
  }

  if(req.query.starring) {
    results = results.filter(movie => movie.cast.includes(req.query.starring));
  }

  return res.render('results', {
    search: req.query,
    movies: results,
  });
};

const getData = (req, res) => {
  res.json(movies.filter(x => x.title.toLowerCase() === 'gone with the wind'));
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  results: hostResults,
  getData,
  notFound,
};
