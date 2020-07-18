import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { RequestComponent } from "./request/request.component";
import { BloodbankComponent } from "./bloodbank/bloodbank.component";

const routes: Routes = [
  { path: "", redirectTo: "request", pathMatch: "full" },
  { path: "request", component: RequestComponent },
  { path: "bloodbank", component: BloodbankComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
