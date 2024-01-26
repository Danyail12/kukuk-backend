import { sendMail } from "../utils/sendMail";



export const courseRequest = async (req, res) => {
    res.status(200).json({ success: true, message:
        
        "Course Requested Successfully" });
}


export const contact = async (req, res) => {

    const {name,email,message} = req.body;
    const to = process.env.my_mail;
    const subject = "Contact Request";
    const text = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;

    await sendMail(to, subject, text);
    res.status(200).json({ success: true, message:
        
        "Contact Requested Successfully" });
}


export const adminStats = async (req, res) => {
    
}