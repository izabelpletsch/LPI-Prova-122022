import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Todo } from './todo';


@Injectable({ providedIn: 'root' })
export class TodoService {

  private todoesUrl = 'api/todoes';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET todoes from the server */
  getTodoes(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.todoesUrl)
      .pipe(
        catchError(this.handleError<Todo[]>('getTodoes', []))
      );
  }

  /** GET todo by id. Return `undefined` when id not found */
  getTodoNo404<Data>(id: number): Observable<Todo> {
    const url = `${this.todoesUrl}/?id=${id}`;
    return this.http.get<Todo[]>(url)
      .pipe(
        map(todoes => todoes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? 'fetched' : 'did not find';
        }),
        catchError(this.handleError<Todo>(`getTodo id=${id}`))
      );
  }

  /** GET todo by id. Will 404 if id not found */
  getTodo(id: number): Observable<Todo> {
    const url = `${this.todoesUrl}/${id}`;
    return this.http.get<Todo>(url).pipe(
      catchError(this.handleError<Todo>(`getTodo id=${id}`))
    );
  }

  /* GET todoes whose name contains search term */
  searchTodoes(term: string): Observable<Todo[]> {
    if (!term.trim()) {
      // if not search term, return empty todo array.
      return of([]);
    }
    return this.http.get<Todo[]>(`${this.todoesUrl}/?name=${term}`).pipe(
      catchError(this.handleError<Todo[]>('searchTodoes', []))
    );
  }

  //////// Save methods //////////

  /** POST: add a new todo to the server */
  addTodo(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.todoesUrl, todo, this.httpOptions).pipe(
      catchError(this.handleError<Todo>('addTodo'))
    );
  }

  /** DELETE: delete the todo from the server */
  deleteTodo(id: number): Observable<Todo> {
    const url = `${this.todoesUrl}/${id}`;

    return this.http.delete<Todo>(url, this.httpOptions).pipe(
      catchError(this.handleError<Todo>('deleteTodo'))
    );
  }

  /** PUT: update the todo on the server */
  updateTodo(todo: Todo): Observable<any> {
    return this.http.put(this.todoesUrl, todo, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateTodo'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}