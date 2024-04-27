const mongoose = require('mongoose');
// const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
   
    email: {
        type: 'string',
        required: true,
        unique: true,
    },
    pass: {
        type: 'string',
        required: true,
    },
    role: {
        type: String,  // Assuming 'role' is a string
    },
    token:{
        type: String,
        default:null
    }
   

});






// userSchema.pre('save', async function (next) {
//     const user = this;

//     if (user.isModified('pass') || user.isNew) {
//         try {
//             const hashedPass = await bcrypt.hash(user.pass, 10);
//             user.pass = hashedPass;
//             next();
//         } catch (err) {
//             return next(err);
//         }
//     } else {
//         return next();
//     }
// });





const userModel = mongoose.model('signup', userSchema)
module.exports = userModel