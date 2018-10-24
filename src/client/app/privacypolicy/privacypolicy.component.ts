import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-privacypolicyModule',
  templateUrl: 'privacypolicy.component.html',
  styleUrls: ['privacypolicy.component.css']
})
export class PrivacypolicyComponent { 
  public isUnlockedSeason:boolean = false;
}
