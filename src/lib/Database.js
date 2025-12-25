
import mongoose from 'mongoose';

const MONGODB_URI = process.env.DATABASE_URL;

if (!MONGODB_URI) {
    throw new Error('Please define the DATABASE_URL environment variable inside .env');
}

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        this.conn = null;
        this.promise = null;
        Database.instance = this;
    }

    async connect() {
        if (this.conn) {
            return this.conn;
        }

        if (!this.promise) {
            const opts = {
                bufferCommands: false,
            };

            this.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
                return mongoose;
            });
        }

        try {
            this.conn = await this.promise;
        } catch (e) {
            this.promise = null;
            throw e;
        }

        return this.conn;
    }
}

const database = new Database();
export default database;
