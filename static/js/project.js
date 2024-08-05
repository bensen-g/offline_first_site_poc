// $(document).ready(function() {
//     function getProjects() {
//         $.ajax({
//             url: '/api/projects/',
//             method: 'GET',
//             success: function(data) {
//                 var projectTableBody = $('#projectTableBody');
//                 projectTableBody.empty();
//                 data.forEach(function(project) {
//                     projectTableBody.append(
//                         `<tr>
//                             <td><a href="/tasks/${project.id}/">${project.name}</a></td>
//                             <td>${project.description}</td>
//                             <td>${project.status}</td>
//                         </tr>`
//                     );
//                 });
//             },
//             error: function() {
//                 alert('Failed to fetch projects.');
//             }
//         });
//     }

//     getProjects();

//     $('#projectForm').on('submit', function(event) {
//         event.preventDefault();
//         const formData = $(this).serialize();
//         $.ajax({
//             type: 'POST',
//             url: '/project_add/',
//             data: formData,
//             headers: { 'X-CSRFToken': getCookie('csrftoken') },
//             success: function(response) {
//                 $('#projectModal').modal('hide');
//                 getProjects();
//             },
//             error: function(response) {
//                 alert('An error occurred while saving the project.');
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


// JavaScript for project creation form and interaction with IndexedDB

$(document).ready(function() {

    // Function to handle project form submission
    $('#projectForm').on('submit', function(event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            name: $('#projectName').val(),
            description: $('#projectDescription').val(),
            status: $('#projectStatus').val(),
        };

        // Save project to IndexedDB
        addOrUpdateProject(formData)
            .then(result => {
                console.log('Project added/updated locally:', result);

                // Optionally show a notification or update UI
                console.log('Project added/updated locally.');

                // Clear form fields or close modal
                $('#projectName').val('');
                $('#projectDescription').val('');
                $('#projectStatus').val('open');
                $('#projectModal').modal('hide');

                // Trigger UI update to show newly added project
                updateProjectListUI();
            })
            .catch(error => {
                console.error('Error adding/updating project locally:', error);
                alert('Failed to add/update project locally. Please try again.');
            });
    });

    // Function to update UI with projects from IndexedDB
    function updateProjectListUI() {
        getAllProjects()
            .then(projects => {
                const projectTableBody = $('#projectTableBody');
                projectTableBody.empty();

                projects.forEach(project => {
                    projectTableBody.append(
                        `<tr>
                            <td><a href="/tasks/${project.id}/">${project.name}</a></td>
                            <td>${project.description}</td>
                            <td>${project.status}</td>
                        </tr>`
                    );
                });
            })
            .catch(error => {
                console.error('Error fetching projects from IndexedDB:', error);
            });
    }

    // Call updateProjectListUI to populate project list on page load
    updateProjectListUI();
});
