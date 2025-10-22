import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-featured e-commerce platform built with Angular and Node.js, featuring user authentication, product management, shopping cart, and payment integration.',
      image: '/assets/images/project1.jpg',
      technologies: ['Angular', 'Node.js', 'MongoDB', 'Stripe'],
      githubUrl: 'https://github.com/username/ecommerce-platform',
      demoUrl: 'https://ecommerce-demo.com',
      featured: true
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
      image: '/assets/images/project2.jpg',
      technologies: ['React', 'TypeScript', 'Socket.io', 'PostgreSQL'],
      githubUrl: 'https://github.com/username/task-manager',
      demoUrl: 'https://taskmanager-demo.com',
      featured: true
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard that displays current weather conditions and forecasts for multiple cities with beautiful data visualizations.',
      image: '/assets/images/project3.jpg',
      technologies: ['Vue.js', 'Chart.js', 'OpenWeather API'],
      githubUrl: 'https://github.com/username/weather-dashboard',
      demoUrl: 'https://weather-dashboard-demo.com',
      featured: false
    },
    {
      id: 4,
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with Angular, featuring dark/light mode, internationalization, and smooth animations.',
      image: '/assets/images/project4.jpg',
      technologies: ['Angular', 'Tailwind CSS', 'TypeScript'],
      githubUrl: 'https://github.com/username/portfolio',
      demoUrl: 'https://portfolio-demo.com',
      featured: false
    },
    {
      id: 5,
      title: 'Chat Application',
      description: 'A real-time chat application with file sharing, emoji support, and group chat functionality built with modern web technologies.',
      image: '/assets/images/project5.jpg',
      technologies: ['React', 'Node.js', 'Socket.io', 'AWS S3'],
      githubUrl: 'https://github.com/username/chat-app',
      demoUrl: 'https://chat-app-demo.com',
      featured: false
    },
    {
      id: 6,
      title: 'Data Analytics Tool',
      description: 'A comprehensive data analytics tool that helps businesses visualize and analyze their data with interactive charts and reports.',
      image: '/assets/images/project6.jpg',
      technologies: ['Angular', 'D3.js', 'Python', 'FastAPI'],
      githubUrl: 'https://github.com/username/analytics-tool',
      demoUrl: 'https://analytics-demo.com',
      featured: false
    }
  ];

  categories = ['All', 'Web App', 'Mobile App', 'API', 'Other'];
  activeCategory = 'All';
  filteredProjects: Project[] = [];
  showLoadMore = false;

  ngOnInit(): void {
    this.filteredProjects = this.projects;
  }

  setActiveCategory(category: string): void {
    this.activeCategory = category;

    if (category === 'All') {
      this.filteredProjects = this.projects;
    } else {
      // In a real application, you'd filter based on project categories
      this.filteredProjects = this.projects.filter(project =>
        project.technologies.some(tech =>
          category === 'Web App' && ['Angular', 'React', 'Vue.js'].includes(tech) ||
          category === 'API' && ['Node.js', 'Express.js'].includes(tech)
        )
      );
    }
  }
}
