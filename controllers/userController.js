
import User from "../models/user.js";

export const registerUser = async (req, res) => {
    const { username, password } = req.body;

    try {
       
        if (User.some(user => User.username === username)) {
            return res.status(400).json({ message: 'Username already taken.' });
        }

               const hashedPassword = await bcrypt.hash(password, 10);

        
        const newUser = {
            id: User.length + 1,
            username: username,
            passwordHash: hashedPassword
        };

        User.push(newUser);

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}