import { BloodGroup, DonorStatus, DonorCategory } from "./enums";
import { Donation } from "./donation";
import { Award } from "./donor.awards";

export class Donor {
  public _id: string;
  public _rev: string;
  public donorId: string;
  public donorName: string;
  public bloodGroup: BloodGroup;
  public donorMobileNumber: string;
  public donorEmail: string;
  public donorStatus: DonorStatus;
  public donorCategory: DonorCategory;
  public rewardPoint: number;
  public donationDetails: Donation[];
  public donorAwards: Award[];
}
