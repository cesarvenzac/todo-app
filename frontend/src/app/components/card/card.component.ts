import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

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
  selector: 'app-card',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskModalComponent,
    CdkDragHandle,
  ],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  @Input() task!: Task;
  @Input() isModalOpen = false;
  @Output() taskUpdated = new EventEmitter<[Task, boolean]>();
  @Output() taskDeleted = new EventEmitter<string>();
  @Output() modalClosed = new EventEmitter<void>();

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
    this.taskUpdated.emit([task, false]);
  }

  deleteTask(taskId: string) {
    this.taskDeleted.emit(taskId);
  }

  addTag(tagInput: string) {
    if (!tagInput.trim()) return;

    // Split by comma or space and process each tag
    const newTags = tagInput
      .split(/[,\s]+/)
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    if (!this.task.tags) {
      this.task.tags = [];
    }

    // Add new tags that don't already exist
    this.task.tags = [...new Set([...this.task.tags, ...newTags])];

    this.updateTask(this.task);
  }

  addCategory(categoryInput: string) {
    if (!categoryInput.trim()) return;

    // Split by comma or space and process each category
    const newCategories = categoryInput
      .split(/[,\s]+/)
      .map((category) => category.trim())
      .filter((category) => category.length > 0);

    if (!this.task.categories) {
      this.task.categories = [];
    }

    // Add new categories that don't already exist
    this.task.categories = [
      ...new Set([...this.task.categories, ...newCategories]),
    ];

    this.updateTask(this.task);
  }
  removeTag(tagToRemove: string) {
    if (!this.task.tags) return;
    this.task.tags = this.task.tags.filter((tag) => tag !== tagToRemove);
    this.updateTask(this.task);
  }
  removeCategory(categoryToRemove: string) {
    if (!this.task.categories) return;
    this.task.categories = this.task.categories.filter(
      (category) => category !== categoryToRemove
    );
    this.updateTask(this.task);
  }

  openModal() {
    // Update task and open modal
    this.taskUpdated.emit([this.task, true]);
  }

  closeModal() {
    localStorage.removeItem('activeTaskId');
    this.modalClosed.emit();
  }
}
