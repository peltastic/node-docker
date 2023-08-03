const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const { MONGO_USER, MONGO_PASSWORD, MONGO_PORT, MONGO_IP, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require("./config/config")
const redis = require("redis")
const redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
})
const RedisStore = require("connect-redis")

const redisStore = new RedisStore({

    client: redisClient
})


const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/useRoutes")

const app = express()

app.use(session({
    store: redisStore,
    secret: SESSION_SECRET
}))

app.use(express.json())

mongoose.connect(`mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`)
.then(() => console.log("successfully conneced to DB"))
.catch(e => console.log(e))

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)

const port = process.env.PORT || 3000

app.get("/", (req, res) => {
    res.send("<h2>Hi Thexxre!!!<h2>")
})

app.listen(port, () => console.log(`listening on port ${port}`))