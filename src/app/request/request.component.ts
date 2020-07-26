import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { CloudantService } from "../cloudant.service";
import { BlockchainDonor } from "../model/blockchain.donor";
import { Donation } from "../model/donation";
import { Donor } from "../model/donor";
import { BagStatus, DonationRequestStatus } from "../model/enums";

@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  styleUrls: ["./request.component.css"],
})
export class RequestComponent implements OnInit {
  ngOnInit(): void {}

  donors: Donor[];
  selectedDonor: Donor;
  donorDetailsForm: FormGroup;
  showDetails: boolean = false;

  page = 1;
  pageSize = 5;
  noOfDonations = 0;
  modalRef: NgbModalRef;

  bagId = new FormControl("", [Validators.required]);
  showRequired: boolean = false;

  bloodGroups: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  bagStatusList: BagStatus[] = [
    BagStatus.COLLECTED,
    BagStatus.TESTED,
    BagStatus.APPROVED,
    BagStatus.REJECTED,
    BagStatus.ISSUED,
    BagStatus.USED,
  ];
  addBloodForm = new FormGroup({
    bagId: new FormControl("", [Validators.required]),
    donorId: new FormControl("", [Validators.required]),
    bloodGroup: new FormControl("A+", [Validators.required]),
    collectionDate: new FormControl("", [Validators.required]),
    bagStatus: new FormControl("", [Validators.required]),
    collectedAt: new FormControl(environment.INST_ID, [Validators.required]),
  });

  constructor(
    private cloudantService: CloudantService,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    this.cloudantService
      .getDocs(environment.BLASTER_DB)
      .subscribe((response: any) => {
        console.log(response.rows[0].doc);
        this.noOfDonations = response.rows.length;
        this.donors = [];

        response.rows.forEach((row: any) => {
          let donor = row.doc as Donor;
          if (
            donor.donationRequest != null &&
            donor.donationRequest.status == DonationRequestStatus.REQUESTED
          ) {
            this.donors.push(donor);
          }
        });
        this.selectedDonor = null;
      });
  }

  open(content: any) {
    this.modalRef = this.modalService.open(content, {
      ariaLabelledBy: "modal-basic-title",
    });
  }

  addBloodBag() {
    if (this.addBloodForm.valid) {
      let formValue = this.addBloodForm.value;
      let newDonation = new Donation(
        formValue.bagId,
        formValue.collectionDate,
        formValue.bagStatus,
        formValue.collectedAt
      );
      this.http
        .get("http://localhost:8888/redavatar/blockchain/" + formValue.donorId)
        .subscribe((result: BlockchainDonor) => {
          result.donationDetails.push(newDonation);
          this.http
            .post("http://localhost:8888/redavatar/blockchain/", result)
            .subscribe((result) => {
              console.log("Updated blockchain: " + result);
            });
        });
    }
  }
}
