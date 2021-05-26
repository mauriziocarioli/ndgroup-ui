import { Component, OnInit, ElementRef, ViewChild ,Input} from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ProcessInstanceList,TaskInstanceList, TaskInstance } from 'src/app/Models/Requests/Request';
import { PAMServices } from 'src/app/service/PAMServices';
import { UserRole } from 'src/app/Models/UserRole';
import { ApprovalTaskComponent } from 'src/app/component/Modals/ApprovalTask/ApprovalTask.component';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.css']
})
export class BrokerComponent implements OnInit {

  @ViewChild("svgContent") svgContentElement: ElementRef;
  @ViewChild("svgContentClosed") svgContentElementClosed: ElementRef;
  @Input() user : UserRole;
  closeResult: string;
  activeProcessInstances: ProcessInstanceList[] = new Array();
  closedProcessInstances: ProcessInstanceList[] = new Array();
  activeManagerTasks : TaskInstanceList = {
    instanceList : new Array()
  };
  svgContent : string;
  allowSvgContent : boolean = false;
  service: PAMServices;

   constructor(private modalService: NgbModal,service : PAMServices) {
      this.service = service;
   }

  ngOnInit(): void {
    this.getCaseList();
  }

  getCaseList()
  {
    this.activeProcessInstances = new Array();
    this.activeManagerTasks.instanceList = new Array();
    this.service.getProcessInstances("Active").subscribe((res: any) => {
      this.buildCaseList(res, this.activeProcessInstances, "Active");
    }, err => { console.log(err) });
  }

  private buildCaseList(response: any, caseList: ProcessInstanceList[], type: string) {
    let currentStatus = "Active";
    if (type != "Active")
      currentStatus = "Completed";

    if (response["process-instance"] && response["process-instance"] instanceof Array) {
      response["process-instance"].forEach((instance: any) => {
        let processInstance: ProcessInstanceList = {
          processInstanceId: instance["process-instance-id"],
          status: currentStatus,
          startedDate: instance["start-date"]["java.util.Date"]
        }
        caseList.push(processInstance);
      });
      caseList = caseList.sort((a: ProcessInstanceList, b: ProcessInstanceList) => {
        if (a.processInstanceId >= b.processInstanceId)
          return -1;
        else
          return 1;
      });

      if (type == "Active")
        this.buildVariablesList(caseList);
    }
  }

  private buildVariablesList(caseList: ProcessInstanceList[]) {
    caseList.forEach((currentInstance: ProcessInstanceList) => {
      this.service.getProcessInstanceVariables(currentInstance.processInstanceId).subscribe((res: any) => {
         this.mapVariableNameValue(res,currentInstance);
         this.onGetActiveTask(currentInstance.processInstanceId,this.user.userid);
      }, err => {

      });
    });

  }

  private mapVariableNameValue(res : any,caseInstance : ProcessInstanceList)
  {
    if(res.tClaim)
    {
       if(res.tClaim["com.property_insurance.model.Claim"])
       {
          caseInstance.memberId = res.tClaim["com.property_insurance.model.Claim"].memberId;
          caseInstance.location = res.tClaim["com.property_insurance.model.Claim"].location;
          caseInstance.weatherConditions = res.tClaim["com.property_insurance.model.Claim"].weatherConditions;
          if(res.tClaim["com.property_insurance.model.Claim"].accidentDate)
          {
             //"2021-05-31T12:34:34"
             var accidentDataStr = res.tClaim["com.property_insurance.model.Claim"].accidentDate.year 
                                   + "-" + res.tClaim["com.property_insurance.model.Claim"].accidentDate.monthValue 
                                   + "-" + res.tClaim["com.property_insurance.model.Claim"].accidentDate.dayOfMonth
                                  /*  +"T" +  res.tClaim["com.property_insurance.model.Claim"].accidentDate.hour
                                   +":" + res.tClaim["com.property_insurance.model.Claim"].accidentDate.minute
                                   +":" + res.tClaim["com.property_insurance.model.Claim"].accidentDate.second */
             caseInstance.accidentDate = new Date(accidentDataStr);                        

          }
          
       }
       
    }
  }

  onShowFlow(processInstanceId : number,type : string)
  {
      if(this.allowSvgContent)
        {
          this.allowSvgContent = false;
          return;
        }
      this.service.getSVGImage(processInstanceId).subscribe((res : any) => { 
        this.svgContent = res;
        if(type == "Active")
            this.svgContentElement.nativeElement.innerHTML = this.svgContent;
        else
            this.svgContentElementClosed.nativeElement.innerHTML = this.svgContent;

      },err=>{ console.error(err);});
      this.allowSvgContent = true;
  }

  onGetActiveTask(processInstanceId : number,userid : string)
  {
      this.service.getActiveTaskInstances(processInstanceId).subscribe((res:any)=>{
          if(res["task-summary"] && res["task-summary"] instanceof Array)
          {
            res["task-summary"].forEach((task : any)=> {
                let taskInstance : TaskInstance = {
                  processInstanceId : processInstanceId,
                  taskCreatedDate : task["task-created-on"]["java.util.Date"],
                  taskId : task["task-id"],
                  taskName : task["task-name"],
                  taskSubject : task["task-subject"],
                  taskDescription  : task["task-description"]
                }

                if(taskInstance.taskName == "Get Documentation") // This is a group task
                    this.activeManagerTasks.instanceList.push(taskInstance);
            });
          }
      },err=>{});
  }

  getTaskVaribles(taskid : number)
  {
      this.service.getTaskVariables(taskid).subscribe((res:any) => {
        console.log(res);
        this.openBrokerTask(res);
      },err => {})
  }


   private openBrokerTask(response : any) {
    const modalRef = this.modalService.open(ApprovalTaskComponent, { ariaLabelledBy: 'modal-basic-title', size: 'xl', backdrop: 'static' });

    modalRef.result.then((result) => {
      this.getCaseList();
    }, (reason) => {
      this.closeResult = "Dismissed";
      this.getCaseList();
    });

    modalRef.componentInstance.taskResponse = response;
    modalRef.componentInstance.currentUser = this.user;
  } 

}
