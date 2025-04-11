const express = require("express");
const catalyst = require("zcatalyst-sdk-node");
const userQuery = require("../sql/userQuery");

exports.testConnection = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: "I am live!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "not found" });
    }
};

exports.createUser = async (req, res) => {
    const catalystApp = catalyst.initialize(req, {scope:"admin"});
    const userTable = catalystApp.datastore().table("users");
    
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
        }
        const userData = { name, email, phone, password };

        const newUser = await userTable.insertRow(userData);
        return res.status(201).json({ success : true, message:"User created successfully", user: newUser });
    } catch (error) {
        return res.status(400).json({ success:false , message: error});
    }
}

exports.updateUser = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const userTable = catalystApp.datastore().table("users");

    try {
        const { id } = req.params;
        const updates = req.body;

        const existingUser = await userTable.getRow(id);
        
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedData = {
            ...existingUser,
            ...updates, 
            ROWID: id  
        };

        const updatedUser = await userTable.updateRow(updatedData);

        return res.status(200).json({ success: true, message:"User Updated Successfully" ,user: updatedUser });

    } catch (error) {
        console.error("Update error:", error);
        return res.status(500).json({ message: error.message });
    }
};


exports.loginUser = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    const userTable = catalystApp.datastore().table("users");
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Assuming you have a User model to handle database operations
        const user = await userTable.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Assuming you have a method to compare passwords
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.getUserbyId = async (req, res) => {
        const { id } = req.params;
        const catalystApp = catalyst.initialize(req, { scope: "admin" });
        try {
            const query = `${userQuery.getUserById} ${id}`;
            // console.log("Query:", query);
            const user = await catalystApp.zcql().executeZCQLQuery(query);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.getAllUser = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const query = userQuery.getAllUser;
        const users = await catalystApp.zcql().executeZCQLQuery(query);
        return res.status(200).json( users );
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.deleteUser = async (req, res) => {
    const catalystApp = catalyst.initialize(req, { scope: "admin" });
    try {
        const { id } = req.params;
        // Assuming you have a User model to handle database operations
        const query = `${userQuery.deleteUser} ${id}`;
        const user = await catalystApp.zcql().executeZCQLQuery(query);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ success:true , message: "User deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
