// Example function to sync data when internet connection is available
function syncData() {
    if (!navigator.onLine) {
        console.log('No internet connection.');
        return;
    }

    // Function to fetch projects from IndexedDB and sync with server
    function syncProjects() {
        return new Promise((resolve, reject) => {
            const dbPromise = new Promise((resolve, reject) => {
                const openRequest = indexedDB.open('projectTaskDB');

                openRequest.onerror = function(event) {
                    console.error('IndexedDB error:', event.target.error);
                    reject(event.target.error);
                };

                openRequest.onsuccess = function(event) {
                    const db = event.target.result;
                    resolve(db);
                };
            });

            dbPromise.then(db => {
                const transaction = db.transaction('projects', 'readonly');
                const store = transaction.objectStore('projects');
                const getAllRequest = store.getAll();

                getAllRequest.onerror = function(event) {
                    console.error('Error fetching projects from IndexedDB:', event.target.error);
                    reject(event.target.error);
                };

                getAllRequest.onsuccess = function(event) {
                    const projects = event.target.result;

                    // Example: Sync projects with server API endpoint
                    projects.forEach(project => {
                        // Example: Send project data to server using fetch API
                        fetch('/api/projects/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': getCookie('csrftoken'),
                            },
                            body: JSON.stringify(project),
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to sync project with server.');
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Project synced with server:', data);
                            // Optionally update local IndexedDB with server response
                        })
                        .catch(error => {
                            console.error('Error syncing project with server:', error);
                        });
                    });

                    resolve();
                };
            });
        });
    }

    // Function to fetch tasks from IndexedDB and sync with server
    function syncTasks() {
        // Similar logic as syncProjects, adjust for tasks
    }

    // Call syncProjects and syncTasks
    syncProjects().then(() => {
        // Optionally syncTasks();
        console.log('Data synchronization complete.');
    }).catch(error => {
        console.error('Data synchronization error:', error);
    });
}

// Listen for message from main thread (e.g., triggered by UI or periodic timer)
self.addEventListener('message', function(event) {
    if (event.data === 'syncData') {
        syncData();
    }
});

// Function to get CSRF token from cookies
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
