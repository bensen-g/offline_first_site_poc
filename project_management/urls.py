from django.urls import path
from .views import ProjectListAPIView, ProjectListView, ProjectCreateView, TaskListAPIView, TaskListView, TaskCreateView, UserListAPIView, ServiceWorkerView

urlpatterns = [
    path('', ProjectListView.as_view(), name='project-list'),
    path('sw.js', ServiceWorkerView.as_view(), name='sw'),
    path('project_add/', ProjectCreateView.as_view(), name='project-add'),
    path('tasks/<int:project_id>/', TaskListView.as_view(), name='task-list'),
    path('tasks/<int:project_id>/task_add/', TaskCreateView.as_view(), name='task-add'),
    path('api/projects/', ProjectListAPIView.as_view(), name='api-project-list'),
    path('api/projects/<int:project_id>/tasks/', TaskListAPIView.as_view(), name='api-task-list'),
    path('api/users/', UserListAPIView.as_view(), name='api-user-list'),
]
