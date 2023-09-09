import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  activeComponent: 'pie-chart' | 'model' = 'pie-chart';

  setActiveComponent(component: 'pie-chart' | 'model') {
    this.activeComponent = component;
  }
}