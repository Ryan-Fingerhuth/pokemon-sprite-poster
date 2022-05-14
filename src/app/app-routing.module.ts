import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PosterComponent } from './poster/poster.component';

const routes: Routes = [
  { path: '', component: PosterComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
