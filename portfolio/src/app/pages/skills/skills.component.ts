import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

interface SkillCategory {
  name: string;
  skills: Skill[];
}

interface Skill {
  name: string;
  level: number; // 1-100
  icon?: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [TranslateModule, CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent {
  frontendSkills: Skill[] = [
    { name: 'Angular', level: 95 },
    { name: 'React', level: 90 },
    { name: 'TypeScript', level: 90 },
    { name: 'JavaScript', level: 95 },
    { name: 'HTML5', level: 95 },
    { name: 'CSS3/SCSS', level: 90 },
    { name: 'Tailwind CSS', level: 85 }
  ];

  backendSkills: Skill[] = [
    { name: 'Node.js', level: 90 },
    { name: 'Express.js', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Java', level: 75 },
    { name: 'REST APIs', level: 90 },
    { name: 'GraphQL', level: 75 }
  ];

  databaseSkills: Skill[] = [
    { name: 'MongoDB', level: 85 },
    { name: 'PostgreSQL', level: 80 },
    { name: 'MySQL', level: 75 },
    { name: 'Redis', level: 70 },
    { name: 'Firebase', level: 80 }
  ];

  toolsSkills: Skill[] = [
    { name: 'Git', level: 90 },
    { name: 'Docker', level: 80 },
    { name: 'AWS', level: 75 },
    { name: 'Jenkins', level: 70 },
    { name: 'Webpack', level: 80 },
    { name: 'NPM/Yarn', level: 90 }
  ];

  softSkills: Skill[] = [
    { name: 'Problem Solving', level: 95 },
    { name: 'Team Leadership', level: 85 },
    { name: 'Communication', level: 90 },
    { name: 'Project Management', level: 80 },
    { name: 'Mentoring', level: 85 },
    { name: 'Time Management', level: 90 }
  ];
}
