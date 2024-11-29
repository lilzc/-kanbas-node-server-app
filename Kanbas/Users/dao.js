import UserModel from "./model.js";

export const createUser = async (user) => {
    delete user._id;
    const newUser = {
        ...user,
        lastActivity: new Date().toISOString(),
        totalActivity: "0:00:00",
    };
    return await UserModel.create(newUser);
};


export const findUserByUsername = async (username) => {
    return await UserModel.findOne({ username });
};

export const findUserByCredentials = async (username, password) => {
    return await UserModel.findOne({ username, password });
};

export const findAllUsers = async () => {
    return await UserModel.find();
};

export const findUserById = async (userId) => {
    return await UserModel.findById(userId);
};

export const updateUser = async (userId, user) => {
    return await UserModel.updateOne({ _id: userId }, { $set: user });
};

export const deleteUser = async (userId) => {
    return await UserModel.deleteOne({ _id: userId });
};

export const findUsersByRole = async (role) => {
    return await UserModel.find({ role });
};


export const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); 
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  
  