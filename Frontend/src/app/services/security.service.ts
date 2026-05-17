import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  OAuthProvider,
  signOut,
  Auth,
  UserCredential
} from 'firebase/auth';
import { firebaseConfig } from '../config/firebase.config';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  theUser = new BehaviorSubject<User>(new User());
  private auth: Auth;

  constructor(private http: HttpClient) {
    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);
    this.verifyActualSession();
  }

  // Login tradicional
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/login`, user);
  }

  // Login con Google
  loginWithGoogle(): Observable<UserCredential> {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return from(signInWithPopup(this.auth, provider));
  }

  // Login con GitHub
  loginWithGitHub(): Observable<UserCredential> {
    const provider = new GithubAuthProvider();
    provider.addScope('user');
    return from(signInWithPopup(this.auth, provider));
  }

  // Login con Microsoft
  loginWithMicrosoft(): Observable<UserCredential> {
    const provider = new OAuthProvider('microsoft.com');
    provider.addScope('user.read');
    return from(signInWithPopup(this.auth, provider));
  }

  // Procesar login OAuth y guardar sesión
  async processOAuthLogin(credential: UserCredential, provider: string): Promise<void> {
  const firebaseUser = credential.user;
  const token = await firebaseUser.getIdToken();
  const photoURL = firebaseUser.photoURL || '';

  // Llamar al backend para registrar/obtener la persona
  const response = await fetch('http://127.0.0.1:5000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: token,
      rol: 'estudiante'
    })
  });

  const data = await response.json();
  console.log('Respuesta backend:', data);

  const userData = {
    id: data.persona?.id,           // ID entero del backend
    firebase_uid: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email || 'Usuario',
    email: firebaseUser.email || '',
    token: token,
    photoURL: photoURL,
    provider: provider
  };

  this.saveSession(userData);
}

  saveSession(dataSesion: any) {
    let data: User = {
      id: dataSesion['id'],
      name: dataSesion['name'],
      email: dataSesion['email'],
      password: '',
      token: dataSesion['token'],
      photoURL: dataSesion['photoURL'] || '',
      provider: dataSesion['provider'] || 'email'
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data);
  }

  setUser(user: User) {
    this.theUser.next(user);
  }

  getUser() {
    return this.theUser.asObservable();
  }

  public get activeUserSession(): User {
    return this.theUser.value;
  }

  logout() {
    if (this.auth.currentUser) {
      signOut(this.auth);
    }
    localStorage.clear();
    this.setUser(new User());
  }

  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion));
    }
  }

  existSession(): boolean {
    return !!this.getSessionData();
  }

  getSessionData() {
    return localStorage.getItem('sesion');
  }
}