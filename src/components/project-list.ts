import {dragTarget} from '../models/drag-drop'
import {Project, ProjectStatus} from '../models/project'
import {autobind} from '../decorators/autobind'
import {ProjectItem} from './project-item'
import {projectState} from '../state/project-state'
import {Component} from './base'



//project list

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements dragTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);

    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const item of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, item);
    }
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }
  @autobind
  dropHandler(event: DragEvent) {
    
    projectState.moveProject(
      event.dataTransfer!.getData("text/plain"),
      this.type === "active" ? ProjectStatus.active : ProjectStatus.finished
    );
  }

  @autobind
  dragLeaveHandler(_event: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    projectState.addListeners((projects: Project[]) => {
      const releventProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.active;
        }
        return project.status === ProjectStatus.finished;
      });
      this.assignedProjects = releventProjects;
      this.renderProjects();
    });
  }
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }
}