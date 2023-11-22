import mongoose from "mongoose"; 

const configOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const connectToDB = async () => {
  const connectionUrl = 'mongodb+srv://artgouveiag:alex70gou@cluster0.j6qpxkk.mongodb.net/';

  mongoose
    .connect(connectionUrl, configOptions)
    .then(() => console.log('Ecommerce DB connected successfully!'))
    .catch((err) => console.log(`Getting error from DB connection ${err.message}`));
};

export default connectToDB;