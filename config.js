const config = {
    PORT: Number(process.env.PORT),
    JWT_SECRET: process.env.JWT_SECRET,
    MYSQL_URL: process.env.MYSQL_URL,
    REDIS_URL: process.env.REDIS_URL,
    SG_KEY: process.env.SG_KEY,
}

module.exports = config;