// State management
let tasks = [];
let currentFilter = 'all';

// Custom cursor
let cursor, cursorDot;
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let cursorDotX = 0, cursorDotY = 0;

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initScrollAnimations();
    initMagneticButtons();
    initParallax();
    loadTasks();
    setupEventListeners();
});

// ===== Apple-style Animations =====

// Custom Cursor
function initCustomCursor() {
    // Create cursor elements
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursorDot);

    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor with lerp for smooth following
    function animateCursor() {
        // Smooth lerping (linear interpolation)
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursorDotX += (mouseX - cursorDotX) * 0.25;
        cursorDotY += (mouseY - cursorDotY) * 0.25;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursorDot.style.left = cursorDotX + 'px';
        cursorDot.style.top = cursorDotY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Add hover effects
    const interactiveElements = document.querySelectorAll('button, input, a, .task-checkbox, .filter-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    animateElements.forEach(el => observer.observe(el));
}

// Magnetic button effect
function initMagneticButtons() {
    const magneticElements = document.querySelectorAll('.add-button, .delete-button');

    magneticElements.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 30;

            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;

                button.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-2px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

// Parallax effect on scroll
function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.header-content');

                parallaxElements.forEach(el => {
                    const speed = 0.5;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
}

// Load tasks from server
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        if (response.ok) {
            tasks = await response.json();
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        showNotification('Failed to load tasks', 'error');
    }
}

// Add new task
async function handleAddTask(e) {
    e.preventDefault();

    const title = taskInput.value.trim();
    if (!title) return;

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (response.ok) {
            const newTask = await response.json();
            tasks.push(newTask);
            taskInput.value = '';
            renderTasks();
            updateStats();
            addTaskAnimation();
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Failed to add task', 'error');
    }
}

// Toggle task completion
async function handleToggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (response.ok) {
            task.completed = !task.completed;
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Failed to update task', 'error');
    }
}

// Delete task
async function handleDeleteTask(taskId) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            tasks = tasks.filter(t => t.id !== taskId);
            renderTasks();
            updateStats();
        }
    } catch (error) {
        console.error('Error deleting task:', error);
        showNotification('Failed to delete task', 'error');
    }
}

// Handle filter change
function handleFilterChange(e) {
    const filter = e.target.dataset.filter;
    currentFilter = filter;

    filterButtons.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    renderTasks();
}

// Render tasks
function renderTasks() {
    const filteredTasks = getFilteredTasks();

    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '';
        emptyState.classList.add('show');
        return;
    }

    emptyState.classList.remove('show');

    tasksList.innerHTML = filteredTasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                 onclick="handleToggleTask(${task.id})">
            </div>
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-time">${formatDate(task.created_at)}</div>
            </div>
            <button class="delete-button"
                    onclick="handleDeleteTask(${task.id})"
                    aria-label="Delete task">
                ×
            </button>
        </li>
    `).join('');

    // Reinitialize magnetic effects for new delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 30;

            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                const moveX = x * strength * 0.3;
                const moveY = y * strength * 0.3;

                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });

        // Cursor hover effect
        button.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        button.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });

    // Add cursor effects to checkboxes
    const checkboxes = document.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('mouseenter', () => cursor?.classList.add('hover'));
        checkbox.addEventListener('mouseleave', () => cursor?.classList.remove('hover'));
    });
}

// Get filtered tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    animateNumber(totalTasksEl, total);
    animateNumber(completedTasksEl, completed);
    animateNumber(pendingTasksEl, pending);
}

// Animate number changes
function animateNumber(element, target) {
    const current = parseInt(element.textContent) || 0;
    const increment = target > current ? 1 : -1;
    const duration = 300;
    const steps = Math.abs(target - current);
    const stepDuration = steps > 0 ? duration / steps : 0;

    let currentNum = current;

    const timer = setInterval(() => {
        if (currentNum === target) {
            clearInterval(timer);
            return;
        }
        currentNum += increment;
        element.textContent = currentNum;
    }, stepDuration);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins} minute${diffInMins > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add task animation
function addTaskAnimation() {
    const button = document.getElementById('addButton');
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
}

// Show notification (placeholder for future enhancement)
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
}
