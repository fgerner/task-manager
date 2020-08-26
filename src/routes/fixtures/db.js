const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user');
const Task = require('../../models/task');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@example.com',
    password: '123456789',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
};
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Jill',
    email: 'jill@example.com',
    password: '123abcde',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_SECRET)
    }]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task',
    completed: false,
    owner: userOne._id
};
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task two',
    completed: true,
    owner: userOne._id
};
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test task three',
    completed: false,
    owner: userTwo._id
};

const setupData = async () => {
    await Task.deleteMany();
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupData
}