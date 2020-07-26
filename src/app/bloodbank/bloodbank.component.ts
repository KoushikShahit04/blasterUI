import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { environment } from "src/environments/environment";
import { BlockchainDonor } from "../model/blockchain.donor";
import { Donation } from "../model/donation";
import { BagStatus } from "../model/enums";

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
  pageSize = 5;
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

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedDonor = null;
    this.donors = [];
    this.bloodGroupMap = new Map<string, number>();
    this.http.get("http://localhost:8888/redavatar/blockchain").subscribe(
      (donors: BlockchainDonor[]) => {
        donors.forEach((donor) => {
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
        });
      },
      (err) => {
        console.log(err);
      }
    );
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
    this.http
      .post("http://localhost:8888/redavatar/blockchain", this.selectedDonor)
      .subscribe((result) => {
        console.log("Updated Blood bag status: " + JSON.stringify(result));
      });
  }
}
