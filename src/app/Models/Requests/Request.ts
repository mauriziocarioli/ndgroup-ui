import { logging } from 'selenium-webdriver';
import { CityLocation } from '../UserRole';


export interface Insert {
    object?: Object;
    "out-identifier"?: string;
    "return-object"?: boolean;
}
    
export interface FireAllRules {
}

export interface GetObjects {
    "out-identifier"?: string;
}



export interface Command {
    insert?: Insert;
    "fire-all-rules"?: FireAllRules;
    "get-objects"?: GetObjects;
    "set-focus"? : string;
}

export interface RootObject {
    lookup: string;
    commands?: Command[];
}

export interface ServiceRequest
{
    request : Object;
}

export interface ServiceResponse
{
    response : Object;
}




export interface DateWrapper
{
    "java.util.Date" : number
}




export interface ProcessInstanceData
{
    partList? : Part[];
}

export interface ProcessInstanceList 
{
    caseId? : string,
    processInstanceId? : number,
    status : string,
    startedDate : number,
    memberId? : string,
    location? : string,
    weatherConditions? : string,
    filingDate? : Date,
    accidentDate? : Date

}

export interface TaskInstance {
    processInstanceId : number,
    taskId : number;
    taskName : string;
    taskSubject : string;
    taskDescription? : string;
    taskCreatedDate : number;
}

export interface TaskInstanceList
{
    instanceList : TaskInstance[]
}

/* export interface TaskData {
    employeeRequest : Employee,
    comments : string,
    managerApprove : boolean
}
 */


 export interface Part {
        partNumber? : string,
        SKU? : string,
        partDesc? : string,
        min? : number,
        max? : number,
        stockQty? : number,
        unitCost? : number,
        orderQty? : number
 }

 export interface BPMNModel{
     contentType? : string,
     content : string
 }

 export interface NodeData{
     id : number,
     name? :  string,
     children : NodeData[],
     type? : string,
     placeHolder? : string,
     isEdit? : boolean,
     isDelete? : boolean
 }

 export interface Applicant {
     name : string,
     ssn : string,
     annualIncome : number,
     monthlyDebt : number,
     loanamount : number,
     bank : string,
     state : string,
     age : number
 }

 export interface Policy
 {
     id?: number,
     memberId?: string,
     deductible?: number,
	 transportationExpenseCoverage?: number,
	 oemPartsCoverage?: number,
	 carLiabilityCoverage?: number,
	 comprehensiveCoverage?: number,
	 collisionCoverage?: number,
	 medicalPaymentsCoverage?: number,
	 personalInjuryProtection?: number,
     timeLimitDays?: number,
     uninsuradeAndUnderinsuredMotoristCoverage?: number
 }

 export interface PoliceOfficer {
     name? : string,
     badge? : string
 }

 export interface PersonInvolved {
     name? : string,
	 address? : string,
	 insurance? : string,
	 insuranceId? : string,
	 vehicleInformation? : string
 }

 export interface Claim {
    id? : number,
    memberId? : number,
    location? : string,
    timeOfDay? : string,
    weatherConditions? : string,
    personInvolved? : PersonInvolved[],
    policeOfficer? : PoliceOfficer[],
    filingDate? : string,
    accidentDate? : string

 }

 export interface Document
{
    id : number,
    documentType? : string;
    documentName? : string;
    documentStatus : string;
    size? : number;
    lastModified? : number;
    content? : string;
    fileType? : string;
};

export interface DocumentImplWrapper
{
    "org.jbpm.document.service.impl.DocumentImpl" : DocumentImpl /* "org.jbpm.document.service.impl.DocumentImpl"*/
}

export interface DocumentImpl
{
    identifier : string;
    name : string;
    link : string;
    size : number;
    lastModified: number;
    content: string;
    attributes : object;
}

