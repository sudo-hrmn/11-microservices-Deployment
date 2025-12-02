# TaskFlow - Simple Web-Based Python Project

A beautiful, modern task management application built with Flask.

## Features

- ✨ Modern, glassmorphic UI design
- 📝 Add, complete, and delete tasks
- 🎯 Filter tasks (All, Active, Completed)
- 📊 Real-time statistics
- 🎨 Smooth animations and transitions
- 📱 Fully responsive design

## Quick Start

1. **Create and activate virtual environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**:
   ```bash
   python app.py
   ```

4. **Access the app**:
   Open your browser and navigate to `http://localhost:5000`

## Tech Stack

- **Backend**: Flask 3.0
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Styling**: Modern CSS with gradients, glassmorphism, and animations
- **Font**: Inter (Google Fonts)

## Project Structure

```
.
├── app.py                 # Flask backend with RESTful API
├── requirements.txt       # Python dependencies
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Styling with modern design
    └── js/
        └── app.js        # Frontend JavaScript
```

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/<id>` - Update task completion status
- `DELETE /api/tasks/<id>` - Delete a task

## Screenshots

The application features:
- Dark theme with vibrant gradients
- Glassmorphism effects
- Smooth animations
- Interactive statistics
- Responsive design

## Development

This is a development server. For production, use a production WSGI server like Gunicorn or uWSGI.

---

Built with ❤️ using Flask & Vanilla JavaScript
