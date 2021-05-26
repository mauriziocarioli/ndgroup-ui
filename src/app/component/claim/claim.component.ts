import { Component, OnInit , Input } from '@angular/core';
import { Claim, PersonInvolved, PoliceOfficer, Policy } from 'src/app/Models/Requests/Request';
import { UserRole } from 'src/app/Models/UserRole';
import { PAMServices } from 'src/app/service/PAMServices';

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.css']
})
export class ClaimComponent implements OnInit {

  @Input() user : UserRole;

  claim : Claim;
  policy : Policy;
  claimList : Claim[];
  service : PAMServices;

  constructor( service : PAMServices) {
       this.service = service;
   }

  ngOnInit() {
    console.log(this.user);
    this.policy = {
      id : 3,
      memberId : "POL-34566445",
      deductible : 500,
      transportationExpenseCoverage : 250,
      oemPartsCoverage : 1000,
      carLiabilityCoverage : 25000,
      comprehensiveCoverage : 50000,
      collisionCoverage : 25000,
      medicalPaymentsCoverage : 50000,
      personalInjuryProtection : 40000,
      timeLimitDays : 4,
      uninsuradeAndUnderinsuredMotoristCoverage : 10000
    }
    this.claimList = [
      {
        id : 1,
        timeOfDay: "15:20",
        memberId : 34566445,
        location : "I-85 N Moore,SC",
        accidentDate : "2021-05-31",
        filingDate : "2021-05-31",
        weatherConditions : "Snow",
        policeOfficer : [{
          name : "John Anto",
          badge : "FSD-23423"
        },{
          name : "Paul Ryan",
          badge : "FSD-32423"
        }],
        personInvolved : [{
          name : "John Doe",
          address : "1034 Warwicke court,St Petersburgh,FL - 64436",
          insurance : "Geico Inc",
          insuranceId : "M23D23DDA",
          vehicleInformation : "2016 BMW X3"
        },
        {
          name : "Tim Scott",
          address : "4122 Calire court, Greenville,SC - 32456",
          insurance : "NG Group Inc",
          insuranceId : "A1123566",
          vehicleInformation : "2019 Honda Accord"
        }]
      },
      {
        id : 2,
        timeOfDay: "01:20",
        memberId : 3342215,
        location : "I-75 S Atlanta,GA",
        accidentDate : "2021-05-31T15:49:05.630Z",
        filingDate : "2021-05-31T15:49:05.630Z",
        weatherConditions : "Rain",
        policeOfficer : [{
          name : "Paul Smith",
          badge : "FUL-23423"
        },{
          name : "George Hamilton",
          badge : "AS3-32423"
        }],
        personInvolved : [{
          name : "John Doe",
          address : "1034 Millison place, Moore,SC - 32456",
          insurance : "Geico Inc",
          insuranceId : "M23D23DDA",
          vehicleInformation : "2016 BMW X3"
        },
        {
          name : "Tim Scott",
          address : "4122 Calire court, Greenville,SC - 32456",
          insurance : "NG Group Inc",
          insuranceId : "A1123566",
          vehicleInformation : "2019 Honda Accord"
        }]
      }
    ];

    this.claim = this.claimList[0];
  }

  onAddPerson()
  {
    this.claim.personInvolved.push({});
  }

  onDeletePerson(person : PersonInvolved)
  {
    this.claim.personInvolved = this.claim.personInvolved.filter((rec : any) => {
          if(rec.name == person.name)
            return false;
          else
            return true;  
      });
  }

  onAddOfficer()
  {
    this.claim.policeOfficer.push({});
  }

  onDeleteOfficer(officer : PoliceOfficer)
  {
    this.claim.policeOfficer = this.claim.policeOfficer.filter((rec : any) => {
          if(rec.badge == officer.badge)
            return false;
          else
            return true;  
      });
  }

  onSubmit()
  {
       this.service.submitClaim(this.claim,this.policy).subscribe((res : any) => {
         console.log(res);
         window.alert("Process Instance Created : " + res);
       });
  }

}
