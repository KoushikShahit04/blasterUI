import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { CloudantService } from "./cloudant.service";
import { Donor } from "./model/donor";
import { DonationRequestStatus, BagStatus } from "./model/enums";
import { BlockchainDonor } from "./model/blockchain.donor";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Donation } from "./model/donation";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {}
