// moviesController
export async function createMovie(req, res) {
  try {
    res.send({ method: req.method, route: '/movies' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getMovies(req, res) {
  try {
    res.send([{ movies: req.method, route: '/movies' }]);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function deleteMovieById(req, res) {
  try {
    res.send({ route: '/movies/:id' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
