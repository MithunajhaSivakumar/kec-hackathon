const mongoose = require('mongoose');

const inchargeSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true,
        trim: true
    },
    halls: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Hall'
        }
    ],
    phone: { 
        type: String, 
        required: true,
        trim: true
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

const InchargeModel =  mongoose.model('incharge', inchargeSchema);
module.exports = InchargeModel