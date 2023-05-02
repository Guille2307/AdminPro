import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRountingModule } from './app-rounting.module';

import { AppComponent } from './app.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [AppComponent, NopagefoundComponent],
  imports: [BrowserModule, AppRountingModule, PagesModule, AuthModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
