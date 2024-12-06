import UserModel from "./model.js";

export const findUserByCredentials = async (username, password) => {
    if (!username || !password) return null;
    return await UserModel.findOne({ username, password });
};

export const findUsersByPartialName = async (partialName) => {
    if (!partialName) return [];
    const regex = new RegExp(partialName, "i");
    return await UserModel.find({
        $or: [
            { firstName: { $regex: regex } }, 
            { lastName: { $regex: regex } }
        ]
    });
};

export const updateUser = async (userId, updates) => {
    if (!userId) throw new Error("User ID required");
    return await UserModel.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true }
    );
};

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


export const findAllUsers = async () => {
    return await UserModel.find();
};

export const findUserById = async (userId) => {
    return await UserModel.findById(userId);
};


export const deleteUser = async (userId) => {
    return await UserModel.deleteOne({ _id: userId });
};

export const findUsersByRole = async (role) => {
    return await UserModel.find({ role });
};



  
  