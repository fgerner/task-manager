const request = require('supertest');
const app = require('../app');
const Task = require('../models/task');
const {userOne, userTwo, taskOne, taskTwo, taskThree, setupData} = require('./fixtures/db');

beforeEach(setupData);

describe('task', () => {
    it('should create a task for user', async () => {
        const response = await request(app)
            .post('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send({
                description: 'Test stuff'
            })
            .expect(201);
        const task = await Task.findById(response.body._id);
        expect(task).not.toBeNull();
        expect(task.completed).toEqual(false);
    });
    it('should get user tasks', async () => {
        const response = await request(app)
            .get('/tasks')
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
        expect(response.body.length).toEqual(2);
    });
    it('should not get other users tasks', async () => {
        await request(app)
            .get('/tasks/' + taskThree._id)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(404);
    });
    it('should not delete other users tasks', async () => {
        await request(app)
            .delete('/tasks/' + taskOne._id)
            .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
            .send()
            .expect(404);
        const task = await Task.find({owner: userOne._id});
        expect(task.length).toEqual(2);
    });
    it('should be able to delete task', async () => {
        await request(app)
            .delete('/tasks/' + taskOne._id)
            .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
            .send()
            .expect(200);
        const task = await Task.find({owner: userOne._id});
        expect(task.length).toEqual(1);
        expect(task.id).toEqual(taskTwo.id);
    });
    it('should not delete task if unauthenticated', async () => {
        await request(app)
            .delete('/tasks/' + taskOne._id)
            .send()
            .expect(401);
        const task = await Task.find({owner: userOne._id});
        expect(task.length).toEqual(2);
    });

});