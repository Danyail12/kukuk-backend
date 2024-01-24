import User from "../models/user.js";


export const userLogin = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;
    
        const user = await User.findOne({ email: email });
    
        if (!user) {
          return res.send({ message: 'Login Failed' });
        }
    
        
        const isPasswordValid = user.password === password;
    
        if (!isPasswordValid) {
          return res.send({ message: 'Login Failed' });
        }
    
        const token = jwt.sign({ data: user }, 'MYKEY', { expiresIn: '1h' });
    
        res.send({ message: 'Login Successful', token: token, userId: user._id });
      } catch (err) {
        console.error(err);
        res.status(500).json({
          success: false,
          message: 'Server error',
        });
      }
    }