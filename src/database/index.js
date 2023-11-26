const mongoose = require("mongoose");

const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb+srv://emersonedinaldo:2aLQNbKt6qTGBmKF@desafio2.xmp4ulc.mongodb.net/?retryWrites=true&w=majority", {});
    console.log('Conexão com o MongoDB com sucesso');
  } catch (error) {
    console.log('Falha ao autenticar com o MongoDB');
    console.error(error);
  }
};

connectToDatabase();

module.exports = mongoose;



