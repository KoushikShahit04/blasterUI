import { Component, OnInit } from "@angular/core";
import { CloudantService } from "../cloudant.service";
import { environment } from "src/environments/environment";
import { Donor } from "../model/donor";
import { DonationRequestStatus, BagStatus } from "../model/enums";
import { BlockchainDonor } from "../model/blockchain.donor";
import { FormControl, Validators } from "@angular/forms";
import { Donation } from "../model/donation";
import { stringify } from "@angular/compiler/src/util";

@Component({
  selector: "app-bloodbank",
  templateUrl: "./bloodbank.component.html",
  styleUrls: ["./bloodbank.component.css"],
})
export class BloodbankComponent implements OnInit {
  instituteName: string = environment.INST_NAME;
  donors: BlockchainDonor[];
  selectedDonor: BlockchainDonor;
  selectedDonation: Donation;
  showDetails: boolean = false;
  page = 1;
  pageSize = 10;
  noOfDonations = 0;
  bagStatusList: BagStatus[] = [
    BagStatus.COLLECTED,
    BagStatus.TESTED,
    BagStatus.APPROVED,
    BagStatus.REJECTED,
    BagStatus.ISSUED,
    BagStatus.USED,
  ];
  bagStatus: FormControl;
  bloodGroupMap: Map<string, number>;

  constructor(private cloudantService: CloudantService) {}

  ngOnInit(): void {
    this.bloodGroupMap = new Map<string, number>();
    this.cloudantService
      .getDocs(environment.BLOCKCHAIN_DB)
      .subscribe((response: any) => {
        console.log(response.rows[0].doc);
        this.noOfDonations = response.rows.length;
        this.donors = [];

        response.rows.forEach((row: any) => {
          let donor = row.doc as BlockchainDonor;
          if (donor != null) {
            let donations = donor.donationDetails.filter(
              (donation) =>
                donation.bagStatus == BagStatus.COLLECTED ||
                donation.bagStatus == BagStatus.TESTED ||
                donation.bagStatus == BagStatus.APPROVED
            );
            if (donations != null && donations.length > 0) {
              donor.donationDetails = donations;
              this.donors.push(donor);
              this.updateBloodGroupMap(donor, donations);
            }
          }
        });
        this.selectedDonor = null;
      });
  }

  private updateBloodGroupMap(donor: BlockchainDonor, donations: Donation[]) {
    if (this.bloodGroupMap.has(donor.bloodGroup)) {
      let count = this.bloodGroupMap.get(donor.bloodGroup);
      this.bloodGroupMap.set(donor.bloodGroup, count + donations.length);
    } else {
      this.bloodGroupMap.set(donor.bloodGroup, donations.length);
    }
  }

  selectDonor(donor: BlockchainDonor, bagId: string) {
    this.selectedDonor = donor;
    this.showDetails = true;
    this.selectedDonation = this.selectedDonor.donationDetails.find(
      (donation) => donation.bagId == bagId
    );
    this.bagStatus = new FormControl(this.selectedDonation.bagStatus);
  }

  update() {
    this.selectedDonation.bagStatus = this.bagStatus.value;
    this.cloudantService
      .updateDoc(
        environment.BLOCKCHAIN_DB,
        this.selectedDonor._id,
        JSON.stringify(this.selectedDonor)
      )
      .subscribe((response: any) => {
        console.log("Updated Blood bag status: " + JSON.stringify(response));
        this.selectedDonor._id = response.id;
        this.selectedDonor._rev = response.rev;
      });
  }
}
