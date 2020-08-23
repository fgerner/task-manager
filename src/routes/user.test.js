const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const userOneId = new mongoose.Types.ObjectId();

const userOne = {
    _id: userOneId,
    name: 'John',
    email: 'john@example.com',
    password: '123456789',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

afterEach(() => {
});

describe('user', () => {

    describe('create user', () => {
        test('should signup new user', async () => {
            const response = await request(app).post('/users').send({
                name: 'Fred',
                email: 'fred.gerner@example.com',
                password: 'shitz001'
            }).expect(201);

            const user = await User.findById(response.body.user._id);
            expect(user).not.toBeNull();

            expect(response.body).toMatchObject({
                user: {
                    name: 'Fred',
                    email: 'fred.gerner@example.com'
                },
                token: user.tokens[0].token
            });
            expect(user.password).not.toBe('shitz001');
        });
    });
    describe('authenticate user', () => {
        test('should login existing user', async () => {
            const response = await request(app).post('/users/login').send({
                email: userOne.email,
                password: userOne.password
            }).expect(200);
            const user = await User.findById(response.body.user._id);
            expect(user.tokens.length).toBe(2);
            expect(response.body.token).toBe(user.tokens[1].token);
        });
        test('should not login user with invalid password', async () => {
            await request(app).post('/users/login').send({
                email: userOne.email,
                password: 'somethingElse'
            }).expect(400);
        });
        test('should not login user with invalid username', async () => {
            await request(app).post('/users/login').send({
                email: 'badguy@mail.com',
                password: userOne.password
            }).expect(400);
        });
    })
    describe('get user', () => {
        test('should return user profile', async () => {
            await request(app).get('/users/me')
                .set('authorization', `Bearer ${userOne.tokens[0].token}`)
                .send()
                .expect(200);
        });
        test('should not return user profile for unauthenticated user', async () => {
            await request(app).get('/users/me')
                .send()
                .expect(401);
        });
    })
    describe('update user', () => {
        it('should update user', async () => {
            const response = await request(app).patch('/users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    name: 'Finneman'
                })
                .expect(200)
            expect(response.body.name).toEqual('Finneman');
            const user = await User.findById(userOneId);
            expect(user.name).toEqual('Finneman')
            expect(user.email).toEqual(userOne.email);
        });
        it('should not update user with invalid properties', async () => {
            const response = await request(app).patch('/users/me')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .send({
                    weight: 69
                })
                .expect(400)
        })
    })
    describe('delete user', () => {
        test('should delete user profile', async () => {
            await request(app).delete('/users/me')
                .set('authorization', `Bearer ${userOne.tokens[0].token}`)
                .send()
                .expect(200);
            const user = await User.findById(userOne._id);
            expect(user).toBeNull();
        });
        test('should not delete user profile for unauthenticated user', async () => {
            await request(app).delete('/users/me')
                .send()
                .expect(401);
        });
    });
    describe('user avatar', () => {
        it('should upload image', async () => {
            await request(app)
                .post('/users/me/avatar')
                .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
                .attach('avatar', 'src/routes/fixtures/profile-pic.jpg')
                .expect(200)
            const user = await User.findById(userOneId);
            expect(user.avatar).toEqual(expect.any(Buffer));
        })
    })
});


