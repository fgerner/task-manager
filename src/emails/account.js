const sgMail = require('@sendgrid/mail');
const sendgridApiKey = process.env.MAIL_TOKEN;


sgMail.setApiKey(sendgridApiKey);

const sendWelcomeEmail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'fredrik.gerner@me.com',
            subject: 'Welcome mate',
            text: `Hello ${name}, how are you going!!`
        });
    }catch (e){
        throw new Error(e.message);
    }
}
const sendGoodbyeEmail = (email, name) => {
    try {
        sgMail.send({
            to: email,
            from: 'fredrik.gerner@me.com',
            subject: 'Seeeeya',
            text: `Good bye ${name}, see you later!!`
        });
    }catch (e){
        throw new Error(e.message);
    }
}
module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
};