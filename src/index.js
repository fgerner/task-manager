const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/users', async (req, res) => {
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

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.get('/users/:id', async (req, res) => {
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

app.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isAllowedOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isAllowedOperation) {
        res.statusCode = 400;
        return res.send({error: 'Not a valid update'})
    }
    const _id = req.params.id;
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true});
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

app.post('/tasks', async (req, res) => {
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

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.send(tasks);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

app.get('/tasks/:id', async (req, res) => {
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
})

app.listen(port, () => {
    console.log('Server is running on port' + port);
});