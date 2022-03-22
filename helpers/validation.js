import jwt from "jsonwebtoken";
const verifyToken = (req, res, next) => {

    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ");
        req.token = bearerToken[1];
        jwt.verify(req.token,process.env.JWT_SECRET,(error,authData)=>{
            if (error) { return res.status(401).json({message:error.message}) }
            req.body.authData = authData
            next()
        })
    } else {
        return res.status(401).json({ message: "please Insert Jwt" });
    }
}
export default verifyToken;