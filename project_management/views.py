from django.http import JsonResponse
from django.views import View
from django.views.generic import ListView, CreateView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from .models import Project, Task
from django.contrib.auth.models import User
from django.views.generic.base import TemplateView

class ProjectListView(ListView):
    model = Project
    template_name = 'project_management/project_list.html'
    context_object_name = 'projects'

class ProjectCreateView(CreateView):
    model = Project
    fields = ['name', 'description', 'status']
    template_name = 'project_management/project_form.html'
    success_url = reverse_lazy('project-list')

    def form_valid(self, form):
        form.instance.created_by = self.request.user
        return super().form_valid(form)

class TaskListView(ListView):
    model = Task
    template_name = 'project_management/task_list.html'
    context_object_name = 'tasks'

    def get_queryset(self):
        return Task.objects.filter(project_id=self.kwargs['project_id'])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['users'] = User.objects.all()
        context['project_id'] = self.kwargs['project_id']
        return context

class TaskCreateView(View):
    def post(self, request, project_id, *args, **kwargs):
        data = request.POST
        project = Project.objects.get(id=project_id)
        task = Task.objects.create(
            name=data['name'],
            description=data.get('description', ''),
            status=data['status'],
            assignee=User.objects.get(id=data['assignee']),
            project=project,
            created_by=request.user
        )
        return JsonResponse({'success': True})

class ProjectListAPIView(View):
    def get(self, request, *args, **kwargs):
        projects = Project.objects.all()
        projects_data = [
            {
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'status': project.status,
                'created_by': project.created_by.username,
                'created_at': project.created_at.isoformat(),
            }
            for project in projects
        ]
        return JsonResponse(projects_data, safe=False)

class TaskListAPIView(View):
    def get(self, request, project_id, *args, **kwargs):
        tasks = Task.objects.filter(project_id=project_id)
        tasks_data = [
            {
                'id': task.id,
                'name': task.name,
                'description': task.description,
                'status': task.status,
                'assignee': task.assignee.username,
                'created_by': task.created_by.username,
                'created_at': task.created_at.isoformat(),
            }
            for task in tasks
        ]
        return JsonResponse(tasks_data, safe=False)

class UserListAPIView(View):
    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        users_data = [
            {
                'id': user.id,
                'username': user.username,
            }
            for user in users
        ]
        return JsonResponse(users_data, safe=False)


class ServiceWorkerView(TemplateView):
    template_name = 'project_management/sw.js'
    content_type = 'application/javascript'