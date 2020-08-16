const multer = require('multer');

const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            return cb(new Error('Only images please!'));
        }
        cb(undefined, true);
    }
});

module.exports = upload;