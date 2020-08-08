const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        res.statusCode = 201;
        res.send(user);
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            res.statusCode = 404;
            return res.send('User not found.');
        }
        res.send(user);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isAllowedOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isAllowedOperation) {
        res.statusCode = 400;
        return res.send({error: 'Not a valid update'})
    }
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        if (!user) {
            res.statusCode = 404;
            return res.send('User not found.');
        }
        res.send(user);
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            res.statusCode = 404;
            return res.send('User not found.');
        }
        res.send(user);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

module.exports = router;