const express = require('express');
const Task = require('../models/task');
const router = express.Router();

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save();
        res.statusCode = 201;
        res.send(task);
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
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
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidations: true});
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