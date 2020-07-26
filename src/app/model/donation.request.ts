import { DonationRequestStatus } from "./enums";

export class DonationRequest {
  public donationDate: Date;
  public donationCenter: string;
  public status: DonationRequestStatus;
}
