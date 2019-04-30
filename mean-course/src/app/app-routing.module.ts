import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
    { path:'', component:PostListComponent },
    { path:'create', component:PostCreateComponent },
    { path:'edit/:id', component:PostCreateComponent },
    { path:'login', component:LoginComponent },
    { path:'signup', component:SignupComponent }
];

@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})

export class AppRoutingModule {}