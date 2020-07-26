import { Donation } from "./donation";
import { BloodGroup, DonorStatus } from "./enums";

export class BlockchainDonor {
  public donorId: string;
  public donorName: string;
  public bloodGroup: BloodGroup;
  public donorMobileNumber: string;
  public donorEmail: string;
  public donorStatus: DonorStatus;
  public donationDetails: Donation[];
}
