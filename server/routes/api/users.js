const express = require('express');
const router = express.Router();

const { findUsers, insertUser, deleteUser, updateUser } = require('../../database/db');

// GET(read) users(".../api/users")
router.get('/', async (req, res) => {
  await findUsers((err, users) => {
    if(err) {
      return console.log(err);
    }

    return res.send({ users });
  });
});

// POST(create) user
router.post('/', async (req, res) => {
  try {
    await insertUser({
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      number: req.body.number,
      closestEvent: 'N/A',
      events:[],
      createdAt: new Date()
    });
  
    return res.status(200).send({ success: 'User successfully created!'});
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'There was an error creating user...' });
  }
});

// PUT(update) user
router.put('/edit/:id', async (req, res) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const number = req.body.number;
  const events = req.body.events;


  try {
    await updateUser(req.params.id, { name, surname, email, number, events});

    return res.status(200).send({ success: 'Editing done successfully!'});
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'An error occurred in user modifications...' });
  }
});

// DELETE user
router.delete('/delete/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);

    return res.status(200).send({ success: 'User deleted successfully!'});
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: 'An error occurred while deleting the user...' });
  }
});

module.exports = router;