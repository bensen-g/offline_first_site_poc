// $(document).ready(function() {
//     const project_id = $('#taskForm').data('project-id');

//     function getTasks() {
//         $.ajax({
//             url: `/api/projects/${project_id}/tasks/`,
//             method: 'GET',
//             success: function(data) {
//                 var taskTableBody = $('#taskTableBody');
//                 taskTableBody.empty();
//                 data.forEach(function(task) {
//                     taskTableBody.append(
//                         `<tr>
//                             <td>${task.name}</td>
//                             <td>${task.description}</td>
//                             <td>${task.status}</td>
//                             <td>${task.assignee}</td>
//                         </tr>`
//                     );
//                 });
//             },
//             error: function() {
//                 alert('Failed to fetch tasks.');
//             }
//         });
//     }

//     function getUsers() {
//         $.ajax({
//             url: '/api/users/',
//             method: 'GET',
//             success: function(data) {
//                 var taskAssignee = $('#taskAssignee');
//                 taskAssignee.empty();
//                 data.forEach(function(user) {
//                     taskAssignee.append(
//                         `<option value="${user.id}">${user.username}</option>`
//                     );
//                 });
//             },
//             error: function() {
//                 alert('Failed to fetch users.');
//             }
//         });
//     }

//     getTasks();
//     getUsers();

//     $('#taskForm').on('submit', function(event) {
//         event.preventDefault();
//         const formData = $(this).serialize();
//         $.ajax({
//             type: 'POST',
//             url: `/tasks/${project_id}/task_add/`,
//             data: formData,
//             headers: { 'X-CSRFToken': getCookie('csrftoken') },
//             success: function(response) {
//                 $('#taskModal').modal('hide');
//                 getTasks();
//             },
//             error: function(response) {
//                 alert('An error occurred while saving the task.');
//             }
//         });
//     });

//     function getCookie(name) {
//         let cookieValue = null;
//         if (document.cookie && document.cookie !== '') {
//             const cookies = document.cookie.split(';');
//             for (let i = 0; i < cookies.length; i++) {
//                 const cookie = cookies[i].trim();
//                 if (cookie.substring(0, name.length + 1) === (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
// });

// JavaScript for task creation form and interaction with IndexedDB

$(document).ready(function() {
    const project_id = $('#taskForm').data('project-id');

    // Function to handle task form submission
    $('#taskForm').on('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            name: $('#taskName').val(),
            description: $('#taskDescription').val(),
            status: $('#taskStatus').val(),
            assignee: $('#taskAssignee').val(),
            project_id: project_id
        };

        console.log(formData, 'formData')

        // Save task to IndexedDB
        addOrUpdateTask(formData)
            .then(result => {
                console.log('Task added/updated locally:', result);

                // Optionally show a notification or update UI
                console.log('Task added/updated locally.');

                // Clear form fields or close modal
                $('#taskName').val('');
                $('#taskDescription').val('');
                $('#taskStatus').val('open');
                $('#taskAssignee').val('1');

                $('#taskModal').modal('hide');

                // Trigger UI update to show newly added task
                updateTaskListUI();
            })
            .catch(error => {
                console.error('Error adding/updating task locally:', error);
                alert('Failed to add/update task locally. Please try again.');
            });
    });

    // Function to update UI with tasks from IndexedDB
    function updateTaskListUI() {
        getAllTasks()
            .then(tasks => {
                const taskTableBody = $('#taskTableBody');
                taskTableBody.empty();

                tasks.forEach(task => {
                    taskTableBody.append(
                        `<tr>
                            <td><a href="/tasks/${task.id}/">${task.name}</a></td>
                            <td>${task.description}</td>
                            <td>${task.status}</td>
                            <td>${task.assignee}</td>
                        </tr>`
                    );
                });
            })
            .catch(error => {
                console.error('Error fetching tasks from IndexedDB:', error);
            });
    }

    // Call updateTaskListUI to populate task list on page load
    updateTaskListUI();
});