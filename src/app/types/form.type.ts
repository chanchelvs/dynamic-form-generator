export interface FormFieldSchema {
  type: 'text' | 'email' | 'password' | 'checkbox' | 'number' | 'select';
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  options?: { value: any; label: string }[];
  validators?: string[];
}

export interface FormData {
  [key: string]: any;
}

export interface TabFormState {
  formData: FormData;
  isValid: boolean;
  isDirty: boolean;
}

export interface Tab {
  id: string;
  label: string;
  schema: FormFieldSchema[];
}
