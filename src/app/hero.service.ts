import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from './hero';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

	private heroesUrl = 'api/heroes';
  httpOptions = {
    headers: new HttpHeaders({ 'Contet-Type': 'application/json' })
  };

  constructor(
  	private http: HttpClient,
  	private messagesService: MessagesService) { }

  private log(message: string) {
  	this.messagesService.add(`HeroService: ${message}`);
  }

  getHeroes (): Observable<Hero[]> {
  	return this.http.get<Hero[]>(this.heroesUrl)
  		.pipe(
  			tap(_ => this.log('fetched heroes')),
  			catchError(this.handleError<Hero[]>('getHeroes', []))
  		);
  }

  getHero (id: number): Observable<Hero> {
  	const url = `${this.heroesUrl}/${id}`;
  	return this.http.get<Hero>(url).pipe(
  		tap(_ => this.log (`fetched hero id=${id}`)),
  		catchError(this.handleError<Hero>(`getHero id=${id}`))
  	);
  }

  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
  	return (error: any): Observable <T> => {
  		console.error(error)
  		this.log(`${operation} failed: ${error.message}`);
  		return of(result as T);
  	};
  }
}
