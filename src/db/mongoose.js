const mongoose = require('mongoose');
const faker = require('faker');

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const User = mongoose.model('User', {
    name: {type: String, required: true},
    age: {type: Number, validate(value) {
        if (value < 0){
            throw new Error('Age needs to be a positive number');
        }
        }}
});

const Task = mongoose.model('Task', {
    description: {type: String, required: true},
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
    age: Math.floor(Math.random() * 100 + 21)
})

me.save().then(() => {
    console.log(me);
}).catch((error) => {
    console.log(error);
});