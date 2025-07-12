import { Component, signal } from '@angular/core';
import { FormTabsComponent } from './components/form-tabs/form-tabs.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormTabsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dynamic-form-generator');
}
