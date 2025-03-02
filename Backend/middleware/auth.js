const jwt = require('jsonwebtoken');

exports.protect = async (req, res, next) => {
  try {
   
    const token =
      req.cookies.token || req.body.token || (req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : '');
    
    

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Please Login to Access this',
      });
    }

    try {
    
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};