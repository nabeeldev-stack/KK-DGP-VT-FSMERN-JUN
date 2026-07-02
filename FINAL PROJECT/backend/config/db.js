const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`\n❌ MongoDB Connection Failed!`);
        console.error(`Error: ${error.message}`);
        
        if (error.code === 'ECONNREFUSED' || error.message?.includes('ECONNREFUSED')) {
            console.error(`
🔴 This usually means one of the following:

1. Your MongoDB Atlas cluster (Cluster0) is PAUSED or STOPPED
   → Go to https://cloud.mongodb.com → Clusters → Check if cluster is active
   → If paused, click the "..." menu and select "Resume"

2. Your IP address is not whitelisted
   → Go to https://cloud.mongodb.com → Network Access → Add IP Address
   → Add your current IP or use 0.0.0.0/0 for development

3. The cluster name or connection string is incorrect
   → Verify your MONGO_URI in backend/.env is correct
   → You can get the correct URI from: Atlas → Clusters → Connect → Connect to your application
            `);
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;
