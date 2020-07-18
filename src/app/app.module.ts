import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CloudantService } from "./cloudant.service";
import { HttpClientModule } from "@angular/common/http";
import { RequestComponent } from "./request/request.component";
import { BloodbankComponent } from "./bloodbank/bloodbank.component";

@NgModule({
  declarations: [AppComponent, RequestComponent, BloodbankComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [CloudantService],
  bootstrap: [AppComponent],
})
export class AppModule {}
