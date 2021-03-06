import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from "mongoose"
import upload from "express-fileupload"



import chat from "./websockets/chat.js"
import usersRoutes from "./routes/usersRoutes.js"
import AuthenticationRoute from "./routes/authenticationRoutes.js"
import IncidentRoutes from "./routes/incidentRoutes.js"
import homeRoutes from "./routes/homeRoutes.js"
import favtPlacesRoutes from "./routes/favtPlaceRoutes.js"
import dailyPlanRoutes from "./routes/dailyPlanRoutes.js"


import path, { dirname } from 'path';
import { fileURLToPath } from 'url';//

dotenv.config()

var PORT = process.env.PORT,
DB_URL = process.env.DB_URL

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



mongoose.connect(DB_URL,
{ useNewUrlParser: true, useUnifiedTopology: true },()=>{
    console.log("Db connected");
});

chat.initChat()

const app = express()
app.use(cors())
app.use(express.json())
app.use(upload())
app.use(express.static('public'))


app.use("/api/Authentication", AuthenticationRoute)
app.use("/api/users", usersRoutes)
app.use("/api/incident", IncidentRoutes)
app.use("/api/home", homeRoutes)
app.use("/api/places", favtPlacesRoutes)
app.use("/api/dailyplans", dailyPlanRoutes)


//Backend



app.use(express.static(path.join(__dirname, 'backpanel')));

//For Admin Panel UI
// app.get('/*', function (req, res) {
//     res.sendFile(path.join(__dirname,'backpanel', 'index.html'));
// });
 app.get("/", (req, res) => res.send("Welcome to the ThunderDorm App!"))
 app.all("*", (req, res) => res.status(404).send("You've tried reaching a route that doesn't exist."))


app.listen(PORT, () =>console.log(`Server running on port: http://localhost:${PORT}`))