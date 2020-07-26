import { Award } from "./donor.awards";
import { BloodGroup, DonorCategory, DonorStatus } from "./enums";
import { DonationRequest } from "./donation.request";

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
  public donationRequest: DonationRequest;
  public donorAwards: Award[];
}
