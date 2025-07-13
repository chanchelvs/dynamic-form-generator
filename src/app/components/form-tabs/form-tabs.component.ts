import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tab, TabFormState, FormData } from 'src/app/types/form.type';
import { FormService } from '../../services/form.service';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component.js';
import { ToastService } from 'src/app/services/toast.service.js';

@Component({
  selector: 'app-form-tabs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DynamicFormComponent],
  templateUrl: './form-tabs.component.html',
  styleUrl: './form-tabs.component.scss'
})
export class FormTabsComponent implements OnInit, OnDestroy{
  activeTabId = 'contact-info';
  private destroy$ = new Subject<void>();
  private tabStates = new Map<string, TabFormState>();

  tabs: Tab[] = [
    {
      id: 'contact-info',
      label: 'Contact Info',
      schema: [
        { type: 'text', label: 'Full Name', name: 'fullName', required: true, placeholder: 'Enter your full name' },
        { type: 'email', label: 'Email', name: 'email', required: true, placeholder: 'Enter your email' },
        { type: 'checkbox', label: 'Subscribe to newsletter', name: 'subscribe' }
      ]
    },
    {
      id: 'account-info',
      label: 'Account Info',
      schema: [
        { type: 'text', label: 'Username', name: 'username', required: true, placeholder: 'Choose a username' },
        { type: 'password', label: 'Password', name: 'password', required: true, placeholder: 'Enter a secure password' },
        { type: 'password', label: 'Confirm Password', name: 'confirmPassword', required: true, placeholder: 'Confirm your password' },
        { type: 'checkbox', label: 'Remember Me', name: 'remember' }
      ]
    }
  ];

  constructor(
    private formService: FormService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.formService.tabStates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        this.tabStates = states;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  switchTab(tabId: string): void {
    this.activeTabId = tabId;
  }

  onFormValueChange(
    tabId: string,
    data: { formData: FormData; isValid: boolean; isDirty: boolean }
  ): void {
    this.formService.updateTabState(
      tabId,
      data.formData,
      data.isValid,
      data.isDirty
    );
  }

  onFormSubmit(tabId: string, formData: FormData): void {
    const tab = this.tabs.find(t => t.id === tabId);
    const tabLabel = tab?.label || tabId;

    console.log(`Form submitted for ${tabLabel}:`, formData);

    this.toastService.show(
      `${tabLabel} submitted successfully!`,
      'success'
    );

    // Mark form as clean after successful submission
    this.formService.updateTabState(tabId, formData, true, false);
  }

  getTabData(tabId: string): FormData | null {
    const state = this.tabStates.get(tabId);
    return state?.formData || null;
  }


  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }
}
