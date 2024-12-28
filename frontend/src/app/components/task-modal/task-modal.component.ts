import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Task {
  _id: string;
  userId: string;
  name: string;
  description?: string | null;
  status: 'to start' | 'in progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string | null;
  categories: string[];
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
})
export class TaskModalComponent {
  @Input() task!: Task;
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() taskUpdated = new EventEmitter<Task>();

  get formattedDueDate(): string {
    if (!this.task?.dueDate) return '';
    return new Date(this.task.dueDate).toISOString().split('T')[0];
  }

  updateDueDate(value: string) {
    this.task.dueDate = value
      ? new Date(value + 'T00:00:00.000Z').toISOString()
      : null;
    this.updateTask();
  }

  addCategory(categoryInput: string) {
    if (!categoryInput.trim()) return;

    const newCategories = categoryInput
      .split(/[,\s]+/)
      .map((category) => category.trim())
      .filter((category) => category.length > 0);

    if (!this.task.categories) {
      this.task.categories = [];
    }

    this.task.categories = [
      ...new Set([...this.task.categories, ...newCategories]),
    ];

    this.updateTask();
  }

  addTag(tagInput: string) {
    if (!tagInput.trim()) return;

    const newTags = tagInput
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (!this.task.tags) {
      this.task.tags = [];
    }

    this.task.tags = [...new Set([...this.task.tags, ...newTags])];

    this.updateTask();
  }

  removeCategory(categoryToRemove: string) {
    this.task.categories =
      this.task.categories?.filter(
        (category) => category !== categoryToRemove
      ) || [];
    this.updateTask();
  }

  removeTag(tagToRemove: string) {
    this.task.tags = this.task.tags?.filter((tag) => tag !== tagToRemove) || [];
    this.updateTask();
  }

  updateTask() {
    this.taskUpdated.emit(this.task);
  }

  close() {
    this.closeModal.emit();
  }
}
