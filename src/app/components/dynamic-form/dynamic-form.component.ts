import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, startWith, Subject, takeUntil } from 'rxjs';
import { FormFieldSchema, FormData } from 'src/app/types/form.type.js';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy, OnChanges {
  @Input() schema: FormFieldSchema[] = [];
  @Input() initialData: FormData | null = null;
  @Output() formValueChange = new EventEmitter<{
    formData: FormData;
    isValid: boolean;
    isDirty: boolean;
  }>();
  @Output() formSubmit = new EventEmitter<FormData>();

  dynamicForm: FormGroup = new FormGroup({});
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
    this.setupFormSubscription();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['schema'] && !changes['schema'].firstChange) {
      this.createForm();
      this.setupFormSubscription();
    }
    
    if (changes['initialData'] && this.initialData) {
      this.dynamicForm.patchValue(this.initialData);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private createForm(): void {
    const formControls: { [key: string]: any } = {};

    this.schema.forEach(field => {
      const validators = [];
      
      if (field.required) {
        validators.push(Validators.required);
      }
      
      if (field.type === 'email') {
        validators.push(Validators.email);
      }

      const initialValue = this.initialData?.[field.name] ?? this.getDefaultValue(field);
      formControls[field.name] = [initialValue, validators];
    });

    this.dynamicForm = this.fb.group(formControls);
  }

  private getDefaultValue(field: FormFieldSchema): any {
    switch (field.type) {
      case 'checkbox':
        return false;
      default:
        return '';
    }
  }

  private setupFormSubscription(): void {
    this.destroy$.next(); 
    
    this.dynamicForm.valueChanges
      .pipe(
        startWith(this.dynamicForm.value),
        debounceTime(300),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.formValueChange.emit({
          formData: this.dynamicForm.value,
          isValid: this.dynamicForm.valid,
          isDirty: this.dynamicForm.dirty
        });
      });
  }

  onSubmit(): void {
    if (this.dynamicForm.valid) {
      this.formSubmit.emit(this.dynamicForm.value);
    }
  }

  onReset(): void {
    this.dynamicForm.reset();
    this.schema.forEach(field => {
      this.dynamicForm.get(field.name)?.setValue(this.getDefaultValue(field));
    });
  }

  getFieldError(fieldName: string): boolean {
    const field = this.dynamicForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.dynamicForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
    }
    return '';
  }

  trackByFieldName(index: number, field: FormFieldSchema): string {
    return field.name;
  }
}
