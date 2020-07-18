import { BloodGroup, DonorCategory, DonorStatus } from "./enums";
import { Donation } from "./donation";

export class BlockchainDonor {
  public _id: string;
  public _rev: string;
  public donorId: string;
  public donorName: string;
  public bloodGroup: BloodGroup;
  public donorMobileNumber: string;
  public donorEmail: string;
  public donorStatus: DonorStatus;
  public donationDetails: Donation[];
}
