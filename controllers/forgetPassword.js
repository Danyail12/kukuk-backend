export const forgetPassword = async (req, res) => {
    const userId = parseInt(req.params.id);
    const newPassword = req.body.newPassword;

    try {
        
        const user = users.find(u => u.id === userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

                const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.passwordHash = hashedPassword;

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}