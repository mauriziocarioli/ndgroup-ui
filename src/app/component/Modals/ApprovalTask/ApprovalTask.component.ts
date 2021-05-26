import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PAMServices } from 'src/app/service/PAMServices';
import { KieSettings } from 'src/app/Models/KieSettings/KieSettings';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ServiceRequest, ServiceResponse, Part, Claim, TaskInstance , Document,DocumentImpl,DocumentImplWrapper, Policy} from 'src/app/Models/Requests/Request';
import { CityLocation, Credentials, UserRole } from 'src/app/Models/UserRole';
import { faStar, faTimesCircle,faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-ApprovalTask',
  templateUrl: './ApprovalTask.component.html',
  styleUrls: ['./ApprovalTask.component.css']
})
export class ApprovalTaskComponent implements OnInit {

  taskid: number;
  readonly: boolean = false;
  @Input() currentUser: UserRole;
  cred: Credentials;
  approved: boolean = false;
  message: string;

  formImport: FormGroup;
  fileToUpload: File = null;
  isApproved: boolean = false;
  
  
  claim : Claim;
  policy: Policy;
  photo : DocumentImplWrapper;
  report : DocumentImplWrapper;
   

  reportDocument : Document = {
    id : 0,
    documentStatus : "test"
  };
  photoDocument : Document = {
    id : 1,
    documentStatus : "test"
  };

  kieSettings: KieSettings;
  service: PAMServices;
  faTimesCircle = faTimesCircle;
  faStar = faStar;
  faFileDownload = faFileDownload;
  @Input() taskResponse: any;
 
  taskName: string;

  caseId: string;

  constructor(public activeModal: NgbActiveModal, pamService: PAMServices) {
    this.formImport = new FormGroup({
      importFile: new FormControl('', Validators.required)
    }); 
    this.service = pamService;
    this.kieSettings = pamService.getCurrentKieSettings();
  }


  ngOnInit(): void {

    this.caseId = "";
    this.taskid = this.taskResponse["task-id"];
    this.cred = {
      userid: this.currentUser.userid,
      password: this.currentUser.password
    }
    this.taskName = this.taskResponse["task-name"];
    if(this.taskName == "Get Documentation")
    {
          this.claim = this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"];
          var accidentDateStr = this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].accidentDate.year
                                + "-"+ this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].accidentDate.monthValue
                                + "-"+ this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].accidentDate.dayOfMonth;
          var filingDateStr = this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].filingDate.year
                                + "-"+ this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].filingDate.monthValue
                                + "-"+ this.taskResponse["task-input-data"].tClaim["com.property_insurance.model.Claim"].filingDate.dayOfMonth;                      
          this.claim.accidentDate = accidentDateStr;                     
          this.claim.filingDate = filingDateStr; 
    }
    if(this.taskName == "Approve")
    {
         this.claim = this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"];
         var accidentDateStr = this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].accidentDate.year
                                + "-"+ this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].accidentDate.monthValue
                                + "-"+ this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].accidentDate.dayOfMonth;
         var filingDateStr = this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].filingDate.year
                                + "-"+ this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].filingDate.monthValue
                                + "-"+ this.taskResponse["task-input-data"]._Claim["com.property_insurance.model.Claim"].filingDate.dayOfMonth;                      
         this.claim.accidentDate = accidentDateStr;                     
         this.claim.filingDate = filingDateStr; 
         this.policy =  this.taskResponse["task-input-data"]._Policy["com.property_insurance.model.Policy"];
         this.photo =  this.taskResponse["task-input-data"]._Photos;
         this.report =  this.taskResponse["task-input-data"]._Report;
         
    }
  }


  onFileChange(files: FileList,document : Document) {

    this.fileToUpload = files.item(0);
    document.documentName = files.item(0) ? files.item(0).name : "";
    document.size = files.item(0).size;
    document.lastModified = files.item(0).lastModified;
    document.fileType = files.item(0).type;
    //Read contents of file
    let fileReader  = new FileReader();
    fileReader.onload = () => {
       //console.log(fileReader.result);
       document.content = <string>fileReader.result;
    }
    fileReader.readAsBinaryString(files.item(0));    
  }


  dismiss() {
    this.activeModal.dismiss();
  }

  onClaimApproveDecline()
  {
    try{
      this.service.updateTaskStatus(this.taskid, "claimed").subscribe(res => {
        this.service.updateTaskStatus(this.taskid, "started").subscribe(res =>{
          this.updateCloseTask();
        },err=>{ this.updateCloseTask() });
      },err =>{
        this.service.updateTaskStatus(this.taskid, "started").subscribe(res =>{
          this.updateCloseTask();
        },err=>{ this.updateCloseTask() });
      });

    }catch(e)
    {
       
    }
  }

  updateCloseTask()
  {
    var postData = {
      approved_ : this.isApproved
    }  
  this.service.updateVariables(this.taskid, postData, this.cred).subscribe((res: any) => {
    this.onComplete();
  });
  }


  onClaimStartGetDocumentation() {
    //  this.readonly = false;
    try {
      this.service.updateTaskStatus(this.taskid, "claimed").subscribe(res => {
        this.service.updateTaskStatus(this.taskid, "started").subscribe(res => {
          this.updateStatusAndComplete();
        });
        
      }, err => { this.readonly = false;
        this.service.updateTaskStatus(this.taskid, "started").subscribe(res => {
          this.updateStatusAndComplete();
        });})
    } catch (e) {
      this.readonly = true;
      this.service.updateTaskStatus(this.taskid, "started").subscribe(res => {
        this.updateStatusAndComplete();
      });
      console.error(e);
    }

  }



  updateStatusAndComplete() {
    let uniqueId = uuidv4();
    let rptDocument : DocumentImplWrapper = {
      "org.jbpm.document.service.impl.DocumentImpl" : {
        identifier: uniqueId,
        name: this.reportDocument.documentName,
        size: this.reportDocument.size,
        lastModified: this.reportDocument.lastModified,
        content: btoa(this.reportDocument.content),
        link: uniqueId,
        attributes: {
          "type": this.reportDocument.documentType
        } 
      }
    }
    let uniqueId1 = uuidv4();
    let photoDoc : DocumentImplWrapper = {
      "org.jbpm.document.service.impl.DocumentImpl" : {
        identifier: uniqueId1,
        name: this.photoDocument.documentName,
        size: this.photoDocument.size,
        lastModified: this.photoDocument.lastModified,
        content: btoa(this.photoDocument.content),
        link: uniqueId1,
        attributes: {
          "type": this.photoDocument.documentType
        } 
      }
    }
    var postData = {
        report_ : rptDocument,
        photos_ : photoDoc
    }  
    this.service.updateVariables(this.taskid, postData, this.cred).subscribe((res: any) => {
      this.onComplete();
    });
  }

  onComplete() {
    this.service.updateTaskStatus(this.taskid, "completed").subscribe(res => {
        this.dismiss();
    });
  }

  

}
