import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  _id: string;
  name: string;
  description: string;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();

  updateTask(task: Task) {
    const updatedTask = { ...task };
    if (updatedTask.dueDate) {
      // Ensure we're sending a proper ISO string
      try {
        updatedTask.dueDate = new Date(updatedTask.dueDate).toISOString();
      } catch (e) {
        console.error('Error converting date:', e);
      }
    }
    this.taskUpdated.emit(updatedTask);
  }

  get formattedDueDate(): string {
    if (!this.task?.dueDate) return '';
    try {
      const date = new Date(this.task.dueDate);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  }

  onDateChange(newDate: string) {
    if (newDate) {
      // Create date at noon UTC to avoid timezone issues
      const date = new Date(newDate + 'T12:00:00Z');
      this.task = {
        ...this.task,
        dueDate: date.toISOString(),
      };
    } else {
      this.task = {
        ...this.task,
        dueDate: null,
      };
    }
    this.updateTask(this.task);
  }

  deleteTask(taskId: string) {
    this.taskDeleted.emit(taskId);
  }
}
