import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Task {
  _id: string;
  name: string;
  description: string | null;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string | null;
  categories: string[] | null;
  tags: string[] | null;
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

  set formattedDueDate(value: string) {
    if (value) {
      this.task.dueDate = new Date(value + 'T00:00:00.000Z').toISOString();
    } else {
      this.task.dueDate = null;
    }
    this.updateTask(this.task);
  }

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
    if (!this.task.categories) {
      this.task.categories = [];
      return;
    }
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
    if (!this.task.tags) {
      this.task.tags = [];
      return;
    }
    this.task.tags = this.task.tags.filter((tag) => tag !== tagToRemove);
    this.updateTask(this.task);
  }
}
