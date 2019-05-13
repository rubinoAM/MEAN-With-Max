import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog:MatDialog){}

    intercept(req:HttpRequest<any>,next:HttpHandler){
        return next.handle(req)
            .pipe(catchError((err:HttpErrorResponse)=>{
                let errMsg = "An unknown error has occurred.";
                console.log(err.error);
                if(err.error.message){
                    errMsg = err.error.message;
                }
                this.dialog.open(ErrorComponent,{data:{message:errMsg}});
                return throwError(err);
            }));
    };
}