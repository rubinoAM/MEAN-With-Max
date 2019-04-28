import { AbstractControl } from '@angular/forms';
import { Observable } from 'rxjs';

export const mimeType = (control:AbstractControl):Promise<{[key:string]:any}> | Observable<{[key:string]:any}> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const fileObs = Observable.create((observer:Observer<{[key:string]:any}>)=>{
        fileReader.addEventListener("loadend",()=>{
            
        });
        fileReader.readAsArrayBuffer(file);
    });
}