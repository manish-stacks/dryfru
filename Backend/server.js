const express = require('express');
const cors = require('cors');
const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();
const cookieParser = require('cookie-parser')
const ConnectDB = require('./database/database.config');
const  route  = require('./routes/routes');
const setupBullBoard = require('./bullboard');
const app = express();
const port = process.env.PORT;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});
ConnectDB()
// Redis setup
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`
});
setupBullBoard(app);
const connectRedis = async () => {
    try {
        redisClient.on("error", (error) => {
            console.error(`Error connecting to Redis: ${error}`);
            process.exit(1);
        });
        redisClient.on("ready", () => console.log("Redis is ready"));
        await redisClient.connect();
        await redisClient.ping();
        app.locals.redis = redisClient;
    } catch (error) {
        console.error(`Error connecting to Redis: ${error}`);
        process.exit(1);
    }
};


(async () => {
    await connectRedis();
})();

app.use('/api/v1',route)
app.listen(port, () => {
    console.log(`Bull Board available at http://localhost:${port}/admin/queues`);
    console.log(`Server is running on http://localhost:${port}`);
});
