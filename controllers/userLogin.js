import user from "../models/user.js";


export const userLogin = async (req, res) => {

    const email = req.body.email;
    const password = req.body.password;
    const user = await user.findOne({ email: email, password: password });
    if(user){
        res.status(200).json({
            success: true,
            message: "User found",
            user
        })
    }else{
        res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
}