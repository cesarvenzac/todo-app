import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() task: any;
  @Output() taskUpdated = new EventEmitter<any>();
  @Output() taskDeleted = new EventEmitter<string>();

  updateTask(task: any) {
    this.taskUpdated.emit(task);
  }

  deleteTask(taskId: string) {
    this.taskDeleted.emit(taskId);
  }
}
