import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { ResizeListenerDirective } from './resize-listener.directive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModelComponent } from './model/model.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'pie-chart', component: PieChartComponent }, // Define routes for your components
  { path: 'model', component: ModelComponent },
  { path: '', redirectTo: '/pie-chart', pathMatch: 'full' }, // Default route
];

@NgModule({
  declarations: [
    AppComponent,
    PieChartComponent,
    ResizeListenerDirective,
    ModelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
