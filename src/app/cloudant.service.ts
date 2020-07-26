import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { environment } from "../environments/environment";
import { Observable } from "rxjs";
import { BlockchainDonor } from "./model/blockchain.donor";

@Injectable({
  providedIn: "root",
})
export class CloudantService {
  BASIC_AUTH =
    "Basic " +
    btoa(environment.CLOUDANT_USERNAME + ":" + environment.CLOUDANT_PASSWORD);

  constructor(private http: HttpClient) {}

  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: this.BASIC_AUTH,
    }),
  };

  /**
   * Create a new database in the cloudant instance
   * @param db database name
   */
  createDB(db: string): Observable<{}> {
    const url = `${environment.CLOUDANT_URL}/${db}`;
    return this.http.put(url, "", this.httpOptions);
  }

  /**
   * Create a new document in the cloudant db
   * @param db database name
   * @param docId document id
   * @param doc document to create
   */
  createDoc(db: string, doc: string): Observable<HttpResponse<string>> {
    console.log("Creating doc: " + doc);
    const url = `${environment.CLOUDANT_URL}/${db}`;
    console.log(url);
    return this.http.post<HttpResponse<string>>(url, doc, this.httpOptions);
  }

  findBlockchainDonor(
    db: string,
    donorId: string
  ): Observable<HttpResponse<string>> {
    console.log("Finding donor: " + donorId);
    const url = `${environment.CLOUDANT_URL}/${db}/_find`;
    console.log(url);
    const body = { selector: { donorId: donorId } };
    console.log("Request body: " + JSON.stringify(body));
    return this.http.post<HttpResponse<string>>(
      url,
      JSON.stringify(body),
      this.httpOptions
    );
  }

  /**
   * Get all documents from the cloudant db
   * @param db database name
   * @param docId document id
   */
  getDocs(db: string): Observable<HttpResponse<string>> {
    const url = `${environment.CLOUDANT_URL}/${db}/_all_docs?include_docs=true`;
    return this.http.get<HttpResponse<string>>(url, this.httpOptions);
  }

  /**
   * Get a document docId from the cloudant db
   * @param db database name
   * @param docId document id
   */
  getDoc(db: string, docId: string): Observable<HttpResponse<string>> {
    const url = `${environment.CLOUDANT_URL}/${db}/${docId}`;
    return this.http.get<HttpResponse<string>>(url, this.httpOptions);
  }

  /**
   * Update a document in the cloudant db. The updated doc must contain the id and the old document's revision
   * @param db database name
   * @param docId document id
   * @param doc document to update
   */
  updateDoc(
    db: string,
    docId: string,
    doc: string
  ): Observable<HttpResponse<string>> {
    const url = `${environment.CLOUDANT_URL}/${db}/${docId}`;
    return this.http.put<HttpResponse<string>>(url, doc, this.httpOptions);
  }

  /**
   * Delete a document in the cloudant db.
   * @param db  database name
   * @param docId document id
   */
  deleteDoc(docId: string): Observable<HttpResponse<string>> {
    const url = `${environment.CLOUDANT_URL}/${environment.BLASTER_DB}/${docId}`;
    return this.http.delete<HttpResponse<string>>(url, this.httpOptions);
  }
}
