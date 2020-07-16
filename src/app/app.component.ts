import { Component } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";
import { CloudantService } from "./cloudant.service";
import { Donor } from "./model/donor";
import { BagStatus } from "./model/enums";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  donors: Donor[];
  selectedDonor: Donor;
  donorDetailsForm: FormGroup;
  showDetails: boolean = false;

  page = 1;
  pageSize = 10;
  noOfDonations = 0;

  constructor(private cloudantService: CloudantService) {
    this.cloudantService
      .getDocs(environment.BLASTER_DB)
      .subscribe((response: any) => {
        console.log(response.rows[0].doc);
        this.noOfDonations = response.rows.length;
        this.donors = [];

        response.rows.forEach((row: any) => {
          var donor = row.doc as Donor;
          if (
            donor.donationDetails != null &&
            donor.donationDetails.length > 0
          ) {
            donor.donationDetails = donor.donationDetails.filter(
              (donation) =>
                donation.bagStatus == BagStatus.COLLECTED ||
                donation.bagStatus == BagStatus.TESTED
            );
            if (
              donor.donationDetails != null &&
              donor.donationDetails.length > 0
            ) {
              this.donors.push(donor);
            }
          }
        });
      });
  }

  selectDonor(donor: Donor) {
    this.selectedDonor = donor;
    this.showDetails = true;
  }

  approve(bagId: string) {
    this.selectedDonor.donationDetails.find(
      (donation) => donation.bagId == bagId
    ).bagStatus = BagStatus.APPROVED;
    console.log("Updated donation: " + JSON.stringify(this.selectedDonor));
  }

  reject(bagId: string) {
    this.selectedDonor.donationDetails.find(
      (donation) => donation.bagId == bagId
    ).bagStatus = BagStatus.REJECTED;
    console.log("Updated donation: " + JSON.stringify(this.selectDonor));
  }
}
