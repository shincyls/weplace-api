users.forEach(user => addUser(user));
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    description: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    createdAt: { type: Date, default: Date.now },
    oauthProvider: { type: String },
    oauthId: { type: String },
});

const User = mongoose.model('User', userSchema);

const addUserToDatabase = async (user) => {
    try {
        const newUser = new User({
            name: user.name,
            dob: new Date(), // You can replace this with actual date of birth
            address: '123 Main St', // Replace with actual address
            description: 'A dummy user',
            latitude: 0,
            longitude: 0,
            oauthProvider: 'google',
            oauthId: '1234567890'
        });
        await newUser.save();
        console.log(`User ${user.name} added to database`);
    } catch (error) {
        console.error(`Error adding user ${user.name} to database:`, error.message);
    }
};

users.forEach(user => addUserToDatabase(user));