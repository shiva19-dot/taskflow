# TaskFlow — Smart To-Do Manager

TaskFlow is a web-based task management application that helps users organize daily activities, set priorities, track completion, and monitor progress.

## Features

- Add new tasks with a title, category, and priority
- View all tasks and filter by pending or completed status
- Edit and delete tasks
- Mark tasks as completed
- Dashboard statistics and progress tracking
- Persistent storage using MongoDB

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **API:** REST API

## Project Structure

```text
TaskFlow/
├── models/
│   └── task.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── routes/
│   └── taskRoutes.js
├── server.js
├── package.json
└── README.md
```

## How to Run Locally

1. Install Node.js and MongoDB Community Server.
2. Clone this repository.
3. Open the project folder in VS Code.
4. Install dependencies:

   `npm install`

5. Start the server:

   `node server.js`

6. Open `http://localhost:3000` in your browser.

Make sure MongoDB is running before starting the application.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Author

Developed as an academic project.
