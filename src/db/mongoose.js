const mongoose = require('mongoose');
const validator = require('validator');

const faker = require('faker');

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', {
    name: {type: String, required: true, trim: true},
    email: {
        type: String,
        required: true,
        trim: true,
        toLowerCase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid.');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            };
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age needs to be a positive number');
            }
        }
    }
});

const Task = mongoose.model('Task', {
    description: {type: String, required: true, trim: true},
    completed: {type: Boolean, default: false}
});

const task = new Task({
    description: faker.lorem.sentence(),
    completed: faker.random.boolean()
})

task.save().then(() => {
    console.log(task);
}).catch((error) => {
    console.log(error);
})

const me = new User({
    name: faker.name.firstName(),
    password: faker.lorem.words(2),
    email: faker.internet.email(),
    age: Math.floor(Math.random() * 79 + 21)
})

me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log(error);
});