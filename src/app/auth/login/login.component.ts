import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm = this.fb.group({
    email: [
      localStorage.getItem('email') || '',
      [Validators.required, Validators.email],
    ],
    password: ['', Validators.required],
    remember: [true],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}
  ngAfterViewInit(): void {
    this.googleIntit();
  }

  googleIntit() {
    google.accounts.id.initialize({
      client_id:
        '555626416733-84f0p85cam871hvj00v1nfido6l1kadt.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response),
    });
    google.accounts.id.renderButton(
      this.googleBtn.nativeElement,
      { theme: 'outline', size: 'large' } // customization attributes
    );
  }

  handleCredentialResponse(response: any) {
    this.usuarioService.loginGoogle(response.credential).subscribe((resp) => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/');
      });
    });
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe({
      next: (resp) => {
        if (this.loginForm.get('remember')?.value) {
          localStorage.setItem(
            'email',
            this.loginForm.get('email')?.value as string
          );
        } else {
          localStorage.removeItem('email');
        }
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        Swal.fire(
          'Error',
          'Las credenciales no son correctas verifique su email o su password',
          'error'
        );
      },
    });
  }
}
