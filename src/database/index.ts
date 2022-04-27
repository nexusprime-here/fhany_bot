import chalk from "chalk";
import mongoose from "mongoose";

try {
    mongoose.connect(process.env.MONGO_URI ?? 'mongodb://localhost/test')
} catch(e) {
    console.log(chalk.black.bgRed(`Erro no MongoDB:`));
    console.log(e);
}