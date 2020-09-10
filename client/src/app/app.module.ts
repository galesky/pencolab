import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { CanvasComponent } from "./canvas/canvas.component";
import { SocketIoModule, SocketIoConfig } from "ngx-socket-io";
import { RouterModule } from "@angular/router";
import { APP_BASE_HREF, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { HomeComponent } from './home/home.component';

const config: SocketIoConfig = { url: "http://localhost:4444", options: {} };

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    RouterModule.forRoot([{ path: ":id", component: CanvasComponent, pathMatch: 'full' },
                          { path: "", component: HomeComponent, pathMatch: 'full' }]),
  ],
  declarations: [AppComponent, CanvasComponent, HomeComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
