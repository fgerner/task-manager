const mongoose = require('mongoose');

const User = require('../models/users');

const faker = require('faker');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const Task = mongoose.model('Task', {
    description: {type: String, required: true, trim: true},
    completed: {type: Boolean, default: false}
});

// const task = new Task({
//     description: faker.lorem.sentence(),
//     completed: faker.random.boolean()
// })
//
// task.save().then(() => {
//     console.log(task);
// }).catch((error) => {
//     console.log(error);
// })

// const me = new User({
//     name: faker.name.firstName(),
//     password: faker.lorem.words(2),
//     email: faker.internet.email(),
//     age: Math.floor(Math.random() * 79 + 21)
// })
//
// me.save().then(() => {
//     console.log(me);
// }).catch((error) => {
//     console.log(error);
// });