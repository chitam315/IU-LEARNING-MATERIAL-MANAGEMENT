import mongoose from "mongoose";

class Mongo {
    static connect = () => {
        mongoose
            .connect(process.env.MONGO_URI)
            .then(() => console.log("Database connected!"))
            .catch(err => console.log(err));
    }
}

export default Mongo