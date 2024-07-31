const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    //TODO deprecated because siginng and handling does not work
    // const token = req.header('Authorization');
    // if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

    // try {
    //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //     req.user = decoded;
    // } catch (ex) {
    //     res.status(400).json({ message: 'Invalid token.' });
    // }
    next();
};
