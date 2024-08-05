// Define the IndexedDB database name and version
const dbName = 'projectTaskDB';
const dbVersion = 1;

// Function to initialize or upgrade the IndexedDB schema
function initializeDB() {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open(dbName, dbVersion);

        request.onerror = function(event) {
            console.error('IndexedDB error:', event.target.error);
            reject(event.target.error);
        };

        request.onupgradeneeded = function(event) {
            const db = event.target.result;

            // Create object stores (tables) for projects and tasks
            if (!db.objectStoreNames.contains('projects')) {
                db.createObjectStore('projects', { keyPath: 'id', autoIncrement: true });
            }

            if (!db.objectStoreNames.contains('tasks')) {
                const taskStore = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
                taskStore.createIndex('project_id', 'project_id', { unique: false });
            } else {
                const taskStore = event.currentTarget.transaction.objectStore('tasks');
                if (!taskStore.indexNames.contains('project_id')) {
                    taskStore.createIndex('project_id', 'project_id', { unique: false });
                }
            }
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

// Function to add or update a project in IndexedDB
function addOrUpdateProject(project) {
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['projects'], 'readwrite');
            const store = transaction.objectStore('projects');

            const request = store.put(project);

            request.onsuccess = function(event) {
                resolve(event.target.result);
            };

            request.onerror = function(event) {
                console.error('Error adding/updating project:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Function to fetch all projects from IndexedDB
function getAllProjects() {
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['projects'], 'readonly');
            const store = transaction.objectStore('projects');
            const request = store.getAll();

            request.onsuccess = function(event) {
                resolve(event.target.result);
            };

            request.onerror = function(event) {
                console.error('Error fetching projects:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Function to delete a project from IndexedDB
function deleteProject(projectId) {
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['projects'], 'readwrite');
            const store = transaction.objectStore('projects');
            const request = store.delete(projectId);

            request.onsuccess = function(event) {
                resolve();
            };

            request.onerror = function(event) {
                console.error('Error deleting project:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Function to add or update a task in IndexedDB
function addOrUpdateTask(task) {
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');

            const request = store.put(task);

            request.onsuccess = function(event) {
                resolve(event.target.result);
            };

            request.onerror = function(event) {
                console.error('Error adding/updating task:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Function to fetch all tasks by project ID from IndexedDB
function getAllTasks() {
    const project_id = $('#taskForm').data('project-id');
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['tasks'], 'readonly');
            const store = transaction.objectStore('tasks');
            const index = store.index('project_id');
            const request = index.getAll(IDBKeyRange.only(project_id));

            request.onsuccess = function(event) {
                resolve(event.target.result);
            };

            request.onerror = function(event) {
                console.error('Error fetching tasks:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Function to delete a task from IndexedDB
function deleteTask(taskId) {
    return new Promise((resolve, reject) => {
        initializeDB().then(db => {
            const transaction = db.transaction(['tasks'], 'readwrite');
            const store = transaction.objectStore('tasks');
            const request = store.delete(taskId);

            request.onsuccess = function(event) {
                resolve();
            };

            request.onerror = function(event) {
                console.error('Error deleting task:', event.target.error);
                reject(event.target.error);
            };
        }).catch(error => {
            console.error('IndexedDB initialization error:', error);
            reject(error);
        });
    });
}

// Initialize the IndexedDB on page load
initializeDB().then(db => {
    console.log('IndexedDB initialized successfully:', db);
}).catch(error => {
    console.error('IndexedDB initialization error:', error);
});
