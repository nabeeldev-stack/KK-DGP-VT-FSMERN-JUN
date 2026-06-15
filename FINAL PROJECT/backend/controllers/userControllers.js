const User = require("../models/user");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {

    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists){
        return res.status(400).json({message: "User already exists"});
    }
     const salt = await bcrypt.genSalt(10);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = await User.create({
        username,
        email,
        password: hashedPassword
    });

    res.status(201).json(user);
};

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: "30d"
        }
    );
};

const loginUser = async (req, res)=> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (
        user && 
        (await bcrypt.compare(password, user.password))
    ){

        res.json({
            id: user._id,
            username: user.username,
            token: generateToken(user._id)
        });

    } else {
        res.status(400).json({message: "Invalid credentials"});
    }
}

module.exports = { registerUser, loginUser };