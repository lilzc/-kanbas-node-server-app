import db from "../Database/index.js";

let { users } = db;

export const createUser = (user) => {
    const newUser = { 
        ...user, 
        _id: Date.now().toString(),
        lastActivity: new Date().toISOString(),
        totalActivity: "0:00:00"
    };
    users.push(newUser);
    return newUser;
};

export const findUserByUsername = (username) => {
    return users.find((user) => user.username === username);
};

export const findUserByCredentials = (username, password) => {
    return users.find((user) => 
        user.username === username && user.password === password
    );
};

export const findAllUsers = () => users;

export const findUserById = (userId) => {
    return users.find((user) => user._id === userId);
};

export const updateUser = (userId, user) => {
    users = users.map((u) => 
        u._id === userId ? { ...u, ...user } : u
    );
    return findUserById(userId);
};

export const deleteUser = (userId) => {
    users = users.filter((user) => user._id !== userId);
};
