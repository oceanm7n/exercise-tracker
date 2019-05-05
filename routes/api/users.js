const express = require('express');
const router = express.Router();

// Importing a model
const User = require('../../models/User');

// GET /api/exercise/users : Get all users
router.get('/users', (req, res) => {
    User
        .find()
        .select({"username": 1, "_id": 1})
        .then((docs) => {
            res.json(docs);
        })
})

// POST /api/exercise/new-user : Create a new user @access
router.post('/new-user', (req, res) => {
    const newUsername = req
        .body
        .uname
        .replace(/^\s+|\s+$/g, '');
    let regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
    if (regex.test(newUsername)) {
        User
            .find({username: newUsername})
            .then(docs => {
                // Username is unique => save it to the DB as a new user
                if (docs.length === 0) {
                    let newUser = new User({username: newUsername});
                    newUser
                        .save()
                        .then((doc) => res.json({username: doc.username, '_id': doc._id}))
                        .catch(err => {
                            console.log(err);
                            res.json({'status': 'error'})
                            // Username is already in the DB => reject
                        })
                } else {
                    res.json({'status': 'Username is already taken'})
                }
            })
            .catch(err => console.log(err));
    } else {
        res.json({'status': 'Bad username'})
    }
});

// POST /api/exercise/add : Add an exercise
router.post('/add', (req, res) => {
    const userId = req.body.uid;
    const description = req.body.desc;
    const duration = req.body.duration;
    const date = req.body.date;
    User
        .findById(userId)
        .then(doc => {
            doc
                .exercises
                .push({description: description, duration: duration});

            console.log(JSON.stringify(doc.exercises));
            doc.save();
            res.json(doc);
        })
        .catch(err => {
            res.json({'status': 'No such ID'})
            console.log(err);
        });
})

// GET /api/exercise/delete-all-users : Delete all users
router.get('/delete-all-users', (req, res) => {
    User
        .remove({})
        .then(() => res.json({'status': 'Successful'}))
        .catch(err => console.log(err));
})

// GET /api/exercise/log/:userId : Get an array log of all exercises and a total number of them
router.get('/log/:userId', (req, res) => {
    const userId = req.params.userId;
    const from = req.query.from;
    const to = req.query.to;
    const limit = req.query.limit;
    User
        .findById(userId)
        .select({"username":1, "exercises": 1, "_id": 0})
        .then(doc => {
            const resJson = {username: doc.username, count: doc.exercises.length, exercises: doc.exercises};
            res.json(resJson);
        })
        .catch(err => {
            res.json({'status': 'No such ID'})
            console.log(err);
        });
})
module.exports = router;