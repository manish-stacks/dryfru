const jwt = require('jsonwebtoken');

const sendToken = async (user, res, StatusCode, mesage) => {
    try {
        const token = jwt.sign({ id: user }, process.env.JWT_SECRET, {
            expiresIn: "10h",
        });

        const options = {
            path: "/",
            expiresIn: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: false,

        };


        res.cookie('token', token, options);

        res.status(StatusCode).json({
            success: true,
            mesage: mesage,
            login: user,
            token: token,
        });
    } catch (error) {
        console.log("Error in generating token:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = sendToken;