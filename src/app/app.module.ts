import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonPipe } from '@angular/common';
import { CookieModule } from 'ngx-cookie';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { HighlightModule, HIGHLIGHT_OPTIONS,HighlightOptions } from 'ngx-highlightjs';

import { AppComponent } from './app.component';
import { MainComponentComponent } from 'src/app/component/main-component/main-component.component';
import { ClaimComponent } from 'src/app/component/claim/claim.component';
import { KieSettingsComponent } from 'src/app/component/Modals/KieSettings/KieSettings.component';
import { CompletedProcessInstanceComponent } from 'src/app/component/Modals/completed-process-instance/completed-process-instance.component';
import { BrokerComponent } from 'src/app/component/broker/broker.component';
import { ApproveComponent } from 'src/app/component/approve/approve.component';
import { ApprovalTaskComponent } from 'src/app/component/Modals/ApprovalTask/ApprovalTask.component';



@NgModule({
  declarations: [
    AppComponent,
    MainComponentComponent,
    KieSettingsComponent,
    ClaimComponent,
    BrokerComponent,
    ApproveComponent,
    ApprovalTaskComponent,
    CompletedProcessInstanceComponent
  ],
  imports: [
    BrowserModule,
    HighlightModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    CookieModule.forRoot()
  ],
  providers: [JsonPipe,{
    provide: HIGHLIGHT_OPTIONS,
    useValue: {
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      languages: {
        xml: () => import('highlight.js/lib/languages/xml'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        scss: () => import('highlight.js/lib/languages/scss'),
        json: () => import('highlight.js/lib/languages/json'),
        css: () => import('highlight.js/lib/languages/css')
      }
    }
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
