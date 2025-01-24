import "dotenv/config"
import {app} from "./src/app.js";
import {connectDB} from "./src/db/db.js"
// import https from "https"
// import fs from 'fs'


// const options = {
//     key : fs.readFileSync("./localhost-key.pem"),
//     cert : fs.readFileSync("./localhost.pem")
// }

connectDB().then(()=>{
    try {
        app.listen(process.env.PORT,()=>{
            console.log(`Server connected successfully: http://localhost:${process.env.PORT}`);
        })
        // https.createServer(app).listen(process.env.PORT,()=>{
        //     console.log(`Server connected successfully: https://localhost:${process.env.PORT}`)
        // })
    } catch (error) {
        console.log("mongodb connection failed: ",error);
        process.exit(1);
    }
})