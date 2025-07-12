import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Tab, TabFormState, FormData } from 'src/app/types/form.type';
import { FormService } from '../services/form.service';

@Component({
  selector: 'app-form-tabs',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-tabs.component.html',
  styleUrl: './form-tabs.component.scss'
})
export class FormTabsComponent implements OnInit, OnDestroy{
  activeTabId = 'form-a';
  private destroy$ = new Subject<void>();
  private tabStates = new Map<string, TabFormState>();

  tabs: Tab[] = [
    {
      id: 'form-a',
      label: 'Personal Info',
      schema: [
        { type: 'text', label: 'Full Name', name: 'fullName', required: true, placeholder: 'Enter your full name' },
        { type: 'email', label: 'Email Address', name: 'email', required: true, placeholder: 'Enter your email' },
        { type: 'text', label: 'Phone Number', name: 'phone', placeholder: 'Enter your phone number' },
        { type: 'select', label: 'Country', name: 'country', required: true, options: [
          { value: 'us', label: 'United States' },
          { value: 'ca', label: 'Canada' },
          { value: 'uk', label: 'United Kingdom' },
          { value: 'au', label: 'Australia' }
        ]},
        { type: 'checkbox', label: 'Subscribe to newsletter', name: 'subscribe' }
      ]
    },
    {
      id: 'form-b',
      label: 'Account Setup',
      schema: [
        { type: 'text', label: 'Username', name: 'username', required: true, placeholder: 'Choose a username' },
        { type: 'password', label: 'Password', name: 'password', required: true, placeholder: 'Enter a secure password' },
        { type: 'password', label: 'Confirm Password', name: 'confirmPassword', required: true, placeholder: 'Confirm your password' },
        { type: 'select', label: 'Account Type', name: 'accountType', required: true, options: [
          { value: 'basic', label: 'Basic Account' },
          { value: 'premium', label: 'Premium Account' },
          { value: 'enterprise', label: 'Enterprise Account' }
        ]},
        { type: 'checkbox', label: 'Remember Me', name: 'remember' },
        { type: 'checkbox', label: 'Accept Terms and Conditions', name: 'acceptTerms', required: true }
      ]
    }
  ];

  constructor(
    private formService: FormService,
    // private toastService: ToastService
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

    // this.toastService.show(
    //   `${tabLabel} form submitted successfully!`,
    //   'success'
    // );

    // Mark form as clean after successful submission
    this.formService.updateTabState(tabId, formData, true, false);
  }

  getTabData(tabId: string): FormData | null {
    const state = this.tabStates.get(tabId);
    return state?.formData || null;
  }

  hasUnsavedChanges(tabId: string): boolean {
    const state = this.tabStates.get(tabId);
    return state?.isDirty || false;
  }

  clearCurrentTab(): void {
    this.formService.clearTabState(this.activeTabId);
    const tab = this.tabs.find(t => t.id === this.activeTabId);
    // this.toastService.show(
    //   `${tab?.label || 'Tab'} cleared successfully`,
    //   'info'
    // );
  }

  clearAllTabs(): void {
    this.formService.clearAllStates();
    // this.toastService.show('All tabs cleared successfully', 'info');
  }

  trackByTabId(index: number, tab: Tab): string {
    return tab.id;
  }
}
