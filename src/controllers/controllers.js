export const getUserInfo = (req, res) => {
  res.send({ method: req.method, route: '/users/me' });
};

export const updateUserInfo = (req, res) => {
  res.send({ method: req.method, route: '/users/me' });
};

export const getMovieList = (req, res) => {
  res.send({ method: req.method, route: '/movies' });
};

export const updateMovieList = (req, res) => {
  res.send({ method: req.method, route: '/movies' });
};

export const deleteMovieById = (req, res) => {
  res.send({ route: '/movies/:id' });
};
