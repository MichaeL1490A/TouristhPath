import { Pipe, PipeTransform } from '@angular/core';
import { Observable , of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient, 
    private sanitizer: DomSanitizer
  ) {}

  transform(src: string, defaultSrc: string = 'assets/images/default_image.png'): Observable<SafeUrl> {
    return this.http
    .get(src, { responseType: 'blob' }).pipe(
      map(val => this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(val))),
      catchError(e => {     
        return of(defaultSrc);
      })
    )
  }
}