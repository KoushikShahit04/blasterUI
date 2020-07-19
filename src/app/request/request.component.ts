import { Component, OnInit } from "@angular/core";
import { Donor } from "../model/donor";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { NgbModalRef, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CloudantService } from "../cloudant.service";
import { DonationRequestStatus, BagStatus, BloodGroup } from "../model/enums";
import { BlockchainDonor } from "../model/blockchain.donor";
import { Donation } from "../model/donation";

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
  instituteName: string = environment.INST_NAME;

  page = 1;
  pageSize = 10;
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
    private modalService: NgbModal
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

  save() {
    if (this.bagId.valid) {
      this.showRequired = false;
      this.cloudantService
        .findBlockchainDonor(
          environment.BLOCKCHAIN_DB,
          this.selectedDonor.donorId
        )
        .subscribe((response: any) => {
          var blockDonor: BlockchainDonor = this.getOrCreateDonor(response);

          blockDonor.donationDetails.push(
            new Donation(
              this.bagId.value,
              this.selectedDonor.donationRequest.donationDate,
              BagStatus.COLLECTED,
              this.selectedDonor.donationRequest.donationCenter
            )
          );
          this.selectedDonor.donationRequest.status =
            DonationRequestStatus.DONATED;

          this.updateBlockchainDB(blockDonor);
          this.updateBlasterDB();
        });
      this.modalRef.close();
    } else {
      this.showRequired = true;
    }
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

  private updateBlockchainDB(blockDonor: BlockchainDonor) {
    this.cloudantService
      .updateDoc(
        environment.BLOCKCHAIN_DB,
        blockDonor._id,
        JSON.stringify(blockDonor)
      )
      .subscribe((response: any) => {
        console.log("Update response: " + JSON.stringify(response));
      });
  }

  private getOrCreateDonor(response: any): BlockchainDonor {
    var blockDonor = new BlockchainDonor();
    if (!response.docs || (response.docs as []).length == 0) {
      console.log("Document not present in blockchain");
      blockDonor.bloodGroup = this.selectedDonor.bloodGroup;
      blockDonor.donationDetails = [];
      blockDonor.donorEmail = this.selectedDonor.donorEmail;
      blockDonor.donorId = this.selectedDonor.donorId;
      blockDonor.donorMobileNumber = this.selectedDonor.donorMobileNumber;
      blockDonor.donorName = this.selectedDonor.donorName;
      blockDonor.donorStatus = this.selectedDonor.donorStatus;

      this.cloudantService
        .createDoc(environment.BLOCKCHAIN_DB, JSON.stringify(blockDonor))
        .subscribe((response: any) => {
          blockDonor._id = response.id;
          blockDonor._rev = response.rev;
        });
    } else {
      blockDonor = response.docs[0];
    }
    return blockDonor;
  }

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

  addBloodBag() {
    if (this.addBloodForm.valid) {
      let formValue = this.addBloodForm.value;
      let newDonation = new Donation(
        formValue.bagId,
        formValue.collectionDate,
        formValue.bagStatus,
        formValue.collectedAt
      );
      this.cloudantService
        .findBlockchainDonor(environment.BLOCKCHAIN_DB, formValue.donorId)
        .subscribe((response: any) => {
          if (response.docs && (response.docs as []).length > 0) {
            let donor = response.docs[0] as BlockchainDonor;
            donor.donationDetails.push(newDonation);
            this.cloudantService
              .updateDoc(
                environment.BLOCKCHAIN_DB,
                donor._id,
                JSON.stringify(donor)
              )
              .subscribe((response: any) => {
                console.log("Donation details added");
                alert("Donation details added");
              });
          }
        });
    }
  }
}
