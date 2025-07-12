import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { TabFormState, FormData } from 'src/app/types/form.type';


@Injectable({
  providedIn: 'root'
})
export class FormService {
  private readonly STORAGE_KEY = 'dynamic-forms-state';

  private tabStatesSubject = new BehaviorSubject<Map<string, TabFormState>>(
    this.loadFromStorage()
  );

  public tabStates$ = this.tabStatesSubject.asObservable();

  constructor() {
    // Auto-save to localStorage whenever state changes
    this.tabStates$.subscribe(states => {
      this.saveToStorage(states);
    });
  }

  updateTabState(tabId: string, formData: FormData, isValid: boolean, isDirty: boolean): void {
    const currentStates = this.tabStatesSubject.value;
    const newStates = new Map(currentStates);

    newStates.set(tabId, {
      formData,
      isValid,
      isDirty
    });

    this.tabStatesSubject.next(newStates);
  }

  getTabState(tabId: string): TabFormState | null {
    return this.tabStatesSubject.value.get(tabId) || null;
  }

  clearTabState(tabId: string): void {
    const currentStates = this.tabStatesSubject.value;
    const newStates = new Map(currentStates);
    newStates.delete(tabId);
    this.tabStatesSubject.next(newStates);
  }

  clearAllStates(): void {
    this.tabStatesSubject.next(new Map());
  }

  private saveToStorage(states: Map<string, TabFormState>): void {
    try {
      const statesObject = Object.fromEntries(states);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(statesObject));
    } catch (error) {
      console.warn('Failed to save form state to localStorage:', error);
    }
  }

  private loadFromStorage(): Map<string, TabFormState> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const statesObject = JSON.parse(stored);
        return new Map(Object.entries(statesObject));
      }
    } catch (error) {
      console.warn('Failed to load form state from localStorage:', error);
    }
    return new Map();
  }
}
