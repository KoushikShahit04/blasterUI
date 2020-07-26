import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { RequestComponent } from "./request/request.component";
import { BloodbankComponent } from "./bloodbank/bloodbank.component";
import { ViewRequestsComponent } from "./view-requests/view-requests.component";
import { AlertsComponent } from "./alerts/alerts.component";

const routes: Routes = [
  { path: "", redirectTo: "viewrequests", pathMatch: "full" },

  { path: "viewrequests", component: ViewRequestsComponent },
  { path: "request", component: RequestComponent },
  { path: "bloodbank", component: BloodbankComponent },
  { path: "alerts", component: AlertsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
