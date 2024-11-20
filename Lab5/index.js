import PathParameters from "./PathParameters.js";
import QueryParameters from "./QueryParameters.js";
import WorkingWithObjects from "./WorkingWithObjects.js";
import WorkingWithArrays from "./WorkingWithArrays.js";

let assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
};

let todos = [
    { id: 1, title: "Task 1", description: "Description 1", completed: false },
    { id: 2, title: "Task 2", description: "Description 2", completed: true },
    { id: 3, title: "Task 3", description: "Description 3", completed: false },
    { id: 4, title: "Task 4", description: "Description 4", completed: true },
];

export default function Lab5(app) {
    app.get("/lab5/welcome", (req, res) => {
        res.send("Welcome to Lab 5");
    });

    app.get("/lab5/assignment", (req, res) => {
        try {
            res.json(assignment);
        } catch (error) {
            res.status(500).json({ message: "Error fetching assignment" });
        }
    });

    app.get("/lab5/todos", (req, res) => {
        try {
            const { completed } = req.query;
            if (completed !== undefined) {
                const completedBool = completed === "true";
                const completedTodos = todos.filter(
                    (t) => t.completed === completedBool
                );
                res.json(completedTodos);
            } else {
                res.json(todos);
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching todos" });
        }
    });

    // Add proper DELETE endpoint
    app.delete("/lab5/todos/:id", (req, res) => {
        try {
            const { id } = req.params;
            const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
            if (todoIndex === -1) {
                res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
                return;
            }
            todos.splice(todoIndex, 1);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Error deleting todo" });
        }
    });

    // Add proper PUT endpoint
    app.put("/lab5/todos/:id", (req, res) => {
        try {
            const { id } = req.params;
            const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
            if (todoIndex === -1) {
                res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
                return;
            }
            todos[todoIndex] = {
                ...todos[todoIndex],
                ...req.body,
                id: parseInt(id) // Ensure ID doesn't change
            };
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ message: "Error updating todo" });
        }
    });

    // Add proper POST endpoint with validation
    app.post("/lab5/todos", (req, res) => {
        try {
            if (!req.body.title) {
                res.status(400).json({ message: "Title is required" });
                return;
            }
            const newTodo = {
                ...req.body,
                id: new Date().getTime(),
                completed: req.body.completed || false
            };
            todos.push(newTodo);
            res.status(201).json(newTodo);
        } catch (error) {
            res.status(500).json({ message: "Error creating todo" });
        }
    });

    // Keep your existing route handlers
    PathParameters(app);
    QueryParameters(app);
    WorkingWithObjects(app);
    WorkingWithArrays(app);
}