import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationGameService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}

    basicGet(): Observable<string> {
        return this.http.get<string>(`${this.baseUrl}/example`).pipe(catchError(this.handleError<string>('basicGet')));
    }

    basicPost(gameJson: string): Observable<HttpResponse<string>> {
        return this.http.post(`${this.baseUrl}/editgame`, gameJson, { observe: 'response', responseType: 'text' });
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
