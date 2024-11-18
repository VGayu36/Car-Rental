const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    
    const secretKey = process.env.JWT_SECRET || 'this-can-be-any-random-key';

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        
        req.userId = decoded.userId;
        next(); 
    });
};

module.exports = verifyToken;
