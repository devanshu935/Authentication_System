const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
},{
    timestamps: true
});

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15 * 60});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;