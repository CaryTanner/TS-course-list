import { autobind } from "../decorators/autobind";
import { Dragable } from "../models/drag-drop";
import { Project } from "../models/project";
import { Component } from "./base";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Dragable {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    }
    return `${this.project.people} people`;
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
  }
  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
  @autobind
  dragStartHandler(event: DragEvent) {
   
    event.dataTransfer?.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_event: DragEvent) {
    console.log("drag  end ");
  }
}