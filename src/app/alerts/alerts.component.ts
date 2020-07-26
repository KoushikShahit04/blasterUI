import { HttpClient, HttpUrlEncodingCodec } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Donor } from "../model/donor";

@Component({
  selector: "app-alerts",
  templateUrl: "./alerts.component.html",
  styleUrls: ["./alerts.component.css"],
})
export class AlertsComponent implements OnInit {
  constructor(private http: HttpClient) {}

  alertForm = new FormGroup({
    donorId: new FormControl("", [Validators.required]),
    messageText: new FormControl("", [Validators.required]),
  });

  get donorId() {
    return this.alertForm.get("donorId");
  }
  get messageText() {
    return this.alertForm.get("messageText");
  }

  ngOnInit(): void {}

  sendMessage() {
    if (this.alertForm.valid) {
      this.http
        .get("http://localhost:8888/redavatar/donor/" + this.donorId.value)
        .subscribe(
          (donor: Donor) => {
            this.http
              .post(
                "http://localhost:8888/redavatar/alert/" +
                  encodeURIComponent(donor.donorMobileNumber),
                this.messageText.value,
                {
                  headers: {
                    "Content-Type": "text/plain",
                    Accepts: "text/plain",
                  },
                  responseType: "text",
                }
              )
              .subscribe((response: string) => {
                console.log("Message sent: " + response);
              });
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }
}
