import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth-guard';

const routes: Routes = [
    { path:'', component:PostListComponent },
    { path:'create', component:PostCreateComponent, canActivate:[AuthGuard] },
    { path:'edit/:id', component:PostCreateComponent, canActivate:[AuthGuard] },
    { path:'auth', loadChildren:"./auth/auth.module#AuthModule"}
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule],
    providers:[AuthGuard],
})

export class AppRoutingModule {}