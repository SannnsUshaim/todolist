import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config()

export const db = mysql.createConnection({
    url: process.env.DATABASE_URL
})