const jwt = require('jsonwebtoken');
const response = require('../utils/responceHandler');
const User = require('../model/User');

const authMiddleware = async (req, res, next) =>{
    const authToken = req?.cookies?.auth_token;
    if(!authToken) return response(res,401, 'Authentication required! Please provide a valid token.');

    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRET);
        
        const user = await User.findById(decode.userId).select('_id username email gender profilePicture coverPhoto role bio');
        if (!user) {
            return res.status(401).json({ message: 'Invalid authentication token' });
        }
        req.user = {
            userId: user._id.toString(),
            username: user.username,
            email: user.email,
            gender: user.gender,
            profilePicture: user.profilePicture,
            coverPhoto: user.coverPhoto,  // Ensure cover photo is included
            role: user.role, // Ensure the role is included
            bio: user.bio // Ensure bio is included
        };

        // req.user = decode;
        next();
    } catch (error) {
        console.error(error)
        return response(res,401, 'Invalid token or expired. Please try again')
    }
}

module.exports = authMiddleware;