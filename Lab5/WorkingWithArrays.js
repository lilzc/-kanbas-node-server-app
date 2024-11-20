let todos = [
    { 
        id: 1, 
        title: "Task 1", 
        description: "Description for Task 1", 
        completed: false,
        editing: false 
    },
    { 
        id: 2, 
        title: "Task 2", 
        description: "Description for Task 2", 
        completed: true,
        editing: false
    },
    { 
        id: 3, 
        title: "Task 3", 
        description: "Description for Task 3", 
        completed: false,
        editing: false
    },
    { 
        id: 4, 
        title: "Task 4", 
        description: "Description for Task 4", 
        completed: true,
        editing: false
    },
];

export default function WorkingWithArrays(app) {
    app.get("/lab5/todos", (req, res) => {
        const { completed } = req.query;
        if (completed !== undefined) {
            const completedBool = completed === "true";
            const completedTodos = todos.filter(
                (t) => t.completed === completedBool
            );
            res.json(completedTodos);
            return;
        }
        res.json(todos);
    });

    app.get("/lab5/todos/create", (req, res) => {
        const newTodo = {
            id: new Date().getTime(),
            title: "New Task",
            description: "New Task Description",
            completed: false,
            editing: false
        };
        todos.push(newTodo);
        res.json(todos);
    });

    app.post("/lab5/todos", (req, res) => {
        const newTodo = {
            ...req.body,
            id: new Date().getTime(),
            editing: false
        };
        todos.push(newTodo);
        res.json(newTodo);
    });

    app.get("/lab5/todos/:id/delete", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex !== -1) {
            todos.splice(todoIndex, 1);
        }
        res.json(todos);
    });

    app.delete("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to delete Todo with ID ${id}` });
            return;
        }
        todos.splice(todoIndex, 1);
        res.sendStatus(200);
    });

    app.put("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
        if (todoIndex === -1) {
            res.status(404).json({ message: `Unable to update Todo with ID ${id}` });
            return;
        }
        todos[todoIndex] = {
            ...todos[todoIndex],
            ...req.body
        };
        res.sendStatus(200);
    });

    app.get("/lab5/todos/:id", (req, res) => {
        const { id } = req.params;
        const todo = todos.find((t) => t.id === parseInt(id));
        if (!todo) {
            res.status(404).json({ message: `Unable to find todo with ID ${id}` });
            return;
        }
        res.json(todo);
    });
}