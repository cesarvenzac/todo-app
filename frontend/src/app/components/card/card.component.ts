import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  _id: string;
  name: string;
  description: string;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  categories: string[];
  tags: string[];
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() task!: Task;
  @Output() taskUpdated = new EventEmitter<Task>();
  @Output() taskDeleted = new EventEmitter<string>();

  updateTask(task: Task) {
    this.taskUpdated.emit(task);
  }

  deleteTask(taskId: string) {
    this.taskDeleted.emit(taskId);
  }

  addCategory(category: string) {
    if (!category.trim()) return;
    if (!this.task.categories) {
      this.task.categories = [];
    }
    if (!this.task.categories.includes(category.trim())) {
      this.task.categories = [...this.task.categories, category.trim()];
      this.updateTask(this.task);
    }
  }

  removeCategory(categoryToRemove: string) {
    this.task.categories = this.task.categories.filter(
      (category) => category !== categoryToRemove
    );
    this.updateTask(this.task);
  }

  addTag(tag: string) {
    if (!tag.trim()) return;
    if (!this.task.tags) {
      this.task.tags = [];
    }
    if (!this.task.tags.includes(tag.trim())) {
      this.task.tags = [...this.task.tags, tag.trim()];
      this.updateTask(this.task);
    }
  }

  removeTag(tagToRemove: string) {
    this.task.tags = this.task.tags.filter((tag) => tag !== tagToRemove);
    this.updateTask(this.task);
  }
}
