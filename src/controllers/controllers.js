export async function getUserInfo(req, res) {
  try {
    res.send({ user: { method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function createUser(req, res) {
  try {
    res.send({ method: req.method, route: '/users/me' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    res.send({ method: req.method, route: '/users/me' });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getMovieList(req, res) {
  try {
    res.send([{ movies: req.method, route: '/movies' }]);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateMovieList(req, res) {
  try {
    res.send({ method: req.method, route: '/movies' });
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
