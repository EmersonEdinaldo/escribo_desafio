const mongoose = require("../database");
const bcryptjs = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  cell: {
    number: {
      type: Number,
      required: true,
    },
    ddd: {
      type: Number,
      required: true,
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastAccessedAt: {
    type: Date,
    default: null, // Defina como null inicialmente
  },
});

// Middleware para atualizar automaticamente o campo updatedAt antes de salvar
UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Método para atualizar o campo lastAccessedAt
UserSchema.methods.updateLastAccessed = function () {
  this.lastAccessedAt = new Date();
  return this.save();
};
UserSchema.pre("save",async function(next){
    const hash = await bcryptjs.hash(this.password,10);
    
    this.password = hash;
})

const User = mongoose.model("User", UserSchema);
module.exports = User;