import userModel from '../models/userModel.js';

const User = userModel;

export async function createUser(req, res) {
  try {
    res.send({ user: { User, method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function getUser(req, res) {
  try {
    res.send({ user: { User, method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    res.send({ user: { User, method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    res.send({ user: { User, method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
