import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import * as User from '../models/userModel.js';

dotenv.config();

const JWT_SECRET = process.env.NODE_ENV === 'production'
  ? process.env.JWT_SECRET
  : '123-ABC-XYZ';
export async function createUser(req, res, next) {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ name, email, password });
    res.status(201).send(user);
  } catch (err) {
    res.status(500).send({ error: err.message });
    next(err);
  }
}

export async function getUser(req, res, next) {
  const { id } = req.body;
  try {
    const user = await User.findById(id).orFail(() => {
      res.status(404).send({ message: '404' });
    });
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ error: err });
    }
    next(err);
  }
}

export async function updateUser(req, res, next) {
  const { id, name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true, runValidators: true },
    ).orFail(() => {
      res.status(404).send({ message: '404' });
    });
    res.send(user);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      res.status(400).send({ error: err });
    }
    next(err);
  }
}

export async function login(req, res) {
  try {
    res.send({ user: { User, method: req.method, route: '/users/me' } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}
