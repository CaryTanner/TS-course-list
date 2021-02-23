import {Project, ProjectStatus} from '../models/project'

// listener type

export type Listener<T> = (items: T[]) => void;

// Project State

 export class State<T> {
    protected listeners: Listener<T>[] = [];
  
    addListeners(listenerFunc: Listener<T>) {
      this.listeners.push(listenerFunc);
    }
  }
  
export  class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;
  
    private constructor() {
      super();
    }
  
    static getInstance() {
      if (this.instance) {
        return this.instance;
      } else {
        this.instance = new ProjectState();
        return this.instance;
      }
    }
  
    addProject(title: string, desc: string, numOfPeople: number) {
      const newProject = new Project(
        Math.random().toString(),
        title,
        desc,
        numOfPeople,
        ProjectStatus.active
      );
      this.projects.push(newProject);
      this.updateListeners();
    }
  
    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }
  
    updateListeners() {
      for (const listernerFunc of this.listeners) {
        listernerFunc(this.projects.slice());
      }
    }
  }

  export const projectState = ProjectState.getInstance();