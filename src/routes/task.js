const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        await task.save();
        res.statusCode = 201;
        res.send(task);
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id});
        res.send(tasks);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({_id, owner: req.user._id});
        if (!task) {
            res.statusCode = 404;
            return res.send('Task not found.');
        }
        res.send(task);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isAllowedOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isAllowedOperation) {
        res.statusCode = 400;
        return res.send({error: 'Not a valid update'})
    }
    try {
        const task = await Task.findById(req.params.id);
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        if (!task) {
            res.statusCode = 404;
            return res.send('Task not found.');
        }
        res.send(task);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.statusCode = 404;
            return res.send('Task not found.');
        }
        res.send(task);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

module.exports = router;