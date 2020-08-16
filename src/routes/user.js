const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save();
        const token = await user.generateAuthToken()
        res.statusCode = 201;
        res.send({user, token});
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isAllowedOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isAllowedOperation) {
        res.statusCode = 400;
        return res.send({error: 'Not a valid update'})
    }
    try {
        updates.forEach((update) => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.statusCode = 400;
        res.send(e);
    }
});

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove();
        res.send(req.user);
    } catch (e) {
        res.statusCode = 500;
        res.send(e);
    }
});

router.post('/users/me/avatar', upload.single('avatar'), async (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.statusCode = 400;
    res.send({error: error.message});
})

module.exports = router;