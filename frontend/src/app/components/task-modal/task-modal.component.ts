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
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="isOpen" (click)="close()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="close()">×</button>

        <div class="modal-body">
          <h2>{{ task.name }}</h2>

          <div class="task-info">
            <div class="info-group">
              <label>Status:</label>
              <select [(ngModel)]="task.status" (change)="updateTask()">
                <option value="to start">To Start</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div class="info-group">
              <label>Priority:</label>
              <select
                [(ngModel)]="task.priority"
                (change)="updateTask()"
                [ngClass]="{
                  'low-priority': task.priority === 'low',
                  'medium-priority': task.priority === 'medium',
                  'high-priority': task.priority === 'high'
                }"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div class="info-group">
              <label>Due Date:</label>
              <input
                type="date"
                [ngModel]="formattedDueDate"
                (ngModelChange)="updateDueDate($event)"
              />
            </div>

            <div class="info-group">
              <label>Description:</label>
              <textarea
                [(ngModel)]="task.description"
                (blur)="updateTask()"
                rows="3"
                placeholder="Add a description..."
              ></textarea>
            </div>

            <div class="info-group">
              <label>Categories:</label>
              <div class="categories">
                <span class="category" *ngFor="let category of task.categories">
                  {{ category }}
                  <button class="remove-btn" (click)="removeCategory(category)">
                    ×
                  </button>
                </span>
              </div>
              <input
                #categoryInput
                type="text"
                placeholder="Add category..."
                class="category-input"
                (keyup.enter)="
                  addCategory(categoryInput.value); categoryInput.value = ''
                "
              />
            </div>

            <div class="info-group">
              <label>Tags:</label>
              <div class="tags">
                <span class="tag" *ngFor="let tag of task.tags">
                  {{ tag }}
                  <button class="remove-btn" (click)="removeTag(tag)">×</button>
                </span>
              </div>
              <input
                #tagInput
                type="text"
                placeholder="Add tag..."
                class="tag-input"
                (keyup.enter)="addTag(tagInput.value); tagInput.value = ''"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }

      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 90%;
        width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
      }

      .close-button {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
      }

      .modal-body {
        margin-top: 1rem;
      }

      .task-info {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .info-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .info-group label {
        font-weight: bold;
        color: #666;
      }

      .categories,
      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .category,
      .tag {
        background: #e0e0e0;
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
      }

      .priority-low {
        color: green;
      }
      .priority-medium {
        color: orange;
      }
      .priority-high {
        color: red;
      }

      @media (max-width: 768px) {
        .modal-content {
          width: 95%;
          padding: 1rem;
        }
      }

      select,
      input,
      textarea {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      textarea {
        resize: vertical;
        min-height: 80px;
      }

      .remove-btn {
        background: none;
        border: none;
        color: #666;
        padding: 0 0.25rem;
        cursor: pointer;
        font-size: 1rem;
      }

      .remove-btn:hover {
        color: #ff4444;
      }

      .category,
      .tag {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .category-input,
      .tag-input {
        margin-top: 0.5rem;
        width: 100%;
      }

      .low-priority {
        color: green;
      }
      .medium-priority {
        color: orange;
      }
      .high-priority {
        color: red;
      }
    `,
  ],
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
