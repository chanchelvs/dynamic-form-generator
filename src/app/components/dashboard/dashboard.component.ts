import { 
  Component, 
  OnInit, 
  OnDestroy, 
  ChangeDetectionStrategy, 
  ChangeDetectorRef 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { FormTabsComponent } from '../form-tabs/form-tabs.component.js';
import { FormService } from '../../services/form.service.js';
import { ToastComponent } from '../toast/toast.component.js';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormTabsComponent, ToastComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',

})
export class DashboardComponent implements OnInit, OnDestroy {


  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {}

}