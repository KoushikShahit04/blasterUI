import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { environment } from "src/environments/environment";
import { CloudantService } from "../cloudant.service";
import { BlockchainDonor } from "../model/blockchain.donor";
import { Donation } from "../model/donation";
import { Donor } from "../model/donor";
import { BagStatus, DonationRequestStatus } from "../model/enums";
import { isNull } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-view-requests",
  templateUrl: "./view-requests.component.html",
  styleUrls: ["./view-requests.component.css"],
})
export class ViewRequestsComponent implements OnInit {
  page = 1;
  pageSize = 5;
  noOfDonations = 0;
  modalRef: NgbModalRef;

  donors: Donor[];
  selectedDonor: Donor;

  instituteName: string = environment.INST_NAME;

  showDetails: boolean = false;
  bagId = new FormControl("", [Validators.required]);
  showRequired: boolean = false;

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

  ngOnInit(): void {}

  selectDonor(donor: Donor) {
    this.selectedDonor = donor;
    this.showDetails = true;
  }

  collect() {
    this.selectedDonor.donationRequest.status = DonationRequestStatus.DONATED;
    console.log("Updated donation: " + JSON.stringify(this.selectedDonor));
  }

  reject() {
    this.selectedDonor.donationRequest.status = DonationRequestStatus.REQUESTED;
    console.log("Updated donation: " + JSON.stringify(this.selectedDonor));
  }

  save() {
    if (this.bagId.valid) {
      this.showRequired = false;
      this.http
        .get(
          "http://localhost:8888/redavatar/blockchain/donor/" +
            this.selectedDonor.donorId
        )
        .subscribe(
          (result: BlockchainDonor) => {
            var blockDonor: BlockchainDonor = result;
            this.updateDetails(blockDonor);
          },
          (err) => {
            var blockDonor: BlockchainDonor = new BlockchainDonor();
            blockDonor.bloodGroup = this.selectedDonor.bloodGroup;
            blockDonor.donationDetails = [];
            blockDonor.donorEmail = this.selectedDonor.donorEmail;
            blockDonor.donorId = this.selectedDonor.donorId;
            blockDonor.donorMobileNumber = this.selectedDonor.donorMobileNumber;
            blockDonor.donorName = this.selectedDonor.donorName;
            blockDonor.donorStatus = this.selectedDonor.donorStatus;
            this.updateDetails(blockDonor);
          }
        );
      this.modalRef.close();
    } else {
      this.showRequired = true;
    }
  }

  private updateDetails(blockDonor: BlockchainDonor) {
    blockDonor.donationDetails.push(
      new Donation(
        this.bagId.value,
        this.selectedDonor.donationRequest.donationDate,
        BagStatus.COLLECTED,
        this.selectedDonor.donationRequest.donationCenter
      )
    );
    this.selectedDonor.donationRequest.status = DonationRequestStatus.DONATED;
    const headers = new HttpHeaders({
      "Content-Type": "application/json",
    });
    this.http
      .post(
        "http://localhost:8888/redavatar/blockchain",
        JSON.stringify(blockDonor),
        { headers: headers }
      )
      .subscribe(
        (result) => {
          console.log("Updated blockchain: " + JSON.stringify(result));
        },
        (err) => {
          console.log("Couldn't update blockchain: " + JSON.stringify(err));
        }
      );
    this.updateBlasterDB();
  }

  private updateBlasterDB() {
    this.cloudantService
      .updateDoc(
        environment.BLASTER_DB,
        this.selectedDonor._id,
        JSON.stringify(this.selectedDonor)
      )
      .subscribe((response: any) => {
        console.log("Blaster DB Update: " + JSON.stringify(response));
      });
  }
}
