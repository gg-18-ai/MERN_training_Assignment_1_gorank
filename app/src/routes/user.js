const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const getUsersData = () => {
    const filePath = path.join(__dirname, "../MOCK_DATA.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(jsonData);
};

const saveUsersData = (users) => {
    const filePath = path.join(__dirname, "../MOCK_DATA.json");
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
};

router.get("/:id", (req, res) => {
    const users = getUsersData();
    const userId = parseInt(req.params.id);
    const user = users.find((u) => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }
    res.json(user);
});

router.post("/", (req, res) => {
    const users = getUsersData();

    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser = {
        id: newId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        job_title: req.body.job_title,
    };

    users.push(newUser);
    saveUsersData(users);

    res.status(201).json({
        message: "User added successfully",
        data: newUser,
    });
});

router.put("/:id", (req, res) => {
    const users = getUsersData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "User not found" });
    }

    users[userIndex] = {
        id: userId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        job_title: req.body.job_title,
    };

    saveUsersData(users);

    res.json({
        message: "User updated",
        data: users[userIndex],
    });
});

router.patch("/:id", (req, res) => {
    const users = getUsersData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "user not found" });
    }

    const existingUser = users[userIndex];
    users[userIndex] = {
        ...existingUser,
        ...req.body,
        id: userId,
    };

    saveUsersData(users);

    res.json({
        message: "user updated",
        data: users[userIndex],
    });
});

router.delete("/:id", (req, res) => {
    const users = getUsersData();
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: "user not found" });
    }

    const deletedUser = users.splice(userIndex, 1);
    saveUsersData(users);

    res.json({
        message: "user deleted successfully",
        data: deletedUser[0],
    });
});

module.exports = router;