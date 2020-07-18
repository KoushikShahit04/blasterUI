import { BagStatus } from "./enums";
export class Donation {
  // public bagId: string;
  // public donationDate: Date;
  // public bagStatus: BagStatus;
  // public collectedInstitute: string;

  constructor(
    public bagId?: string,
    public donationDate?: Date,
    public bagStatus?: BagStatus,
    public collectedInstitute?: string
  ) {}
}
