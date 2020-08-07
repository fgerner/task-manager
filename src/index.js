const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.statusCode = 201;
        res.send(user);
    }).catch((e) => {
        res.statusCode = 400;
        res.send(e);
    });
});

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users);
    }).catch((e) => {
        res.statusCode = 500;
        res.send(e);
    });
});

app.get('/users/:id', (req, res) => {
    const _id = req.params.id;
    User.findById(_id).then((user) => {
        if (!user) {
            res.statusCode = 404;
            return res.send('User not found');
        }
        res.send(user);
    }).catch((e) => {
        res.statusCode = 500;
        res.send(e);
    })

})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.statusCode = 201;
        res.send(task);
    }).catch((e) => {
        res.statusCode = 400;
        res.send(e);
    });
});

app.get('/tasks', (req, res) => {
    Task.find().then((tasks) => {
        res.send(tasks);
    }).catch((e) => {
        res.statusCode = 500;
        res.send(e);
    })
});

app.get('/tasks/:id', (req, res) => {
    Task.findById(req.params.id).then((task) => {
        if (!task) {
            res.statusCode = 404;
            return res.send('Task not found.');
        }
        res.send(task);
    }).catch((e) => {
        res.statusCode = 500;
        res.send(e);
    })
})

app.listen(port, () => {
    console.log('Server is running on port' + port);
});