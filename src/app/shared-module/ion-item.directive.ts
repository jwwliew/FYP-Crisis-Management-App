import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appShadowCss]'
})
export class IonItemDirective {
  //ionic g directive auto import in app.module.ts, but won't work so should put in individual commponent like newTemplate.module.ts
  //https://stackoverflow.com/questions/56794910/editing-shadow-dom-in-ionic-ion-item
  //https://www.joshmorony.com/using-a-directive-to-modify-the-behaviour-of-an-ionic-component/
  // import in shared module https://stackoverflow.com/questions/41505392/how-to-declare-a-directive-globally-for-all-modules-in-angular, ionic g module sharedModule
  constructor(private el: ElementRef) { }

  @Input('customCSS') shadowCustomCss = [];
  ngOnChanges() {
    const shadow = this.el.nativeElement.shadowRoot || this.el.nativeElement.attachShadow({ mode: 'open' });
    if (shadow) {
      let innerHTML = '';
      innerHTML += '<style>';
      // console.warn("shadow custom css = " + this.shadowCustomCss);
      // console.error("array[0] " + this.shadowCustomCss[0]);
      let dynamicCss = this.shadowCustomCss[1] == 'planDetails' ? 
      ` .input-wrapper, .item-native, item.inner {
          background-color: ${this.shadowCustomCss[0] ? '#a0cdfa ' : 'white'};
        }`
      : 
      ` 
        .input-wrapper, .item-native, .item-inner {
          display: block;
          background-color: ${this.shadowCustomCss[0] ? '#a0cdfa ' : '#d3d3d3'};
          border-width: 0px;
          --inner-padding-end: 0px;
        }
      `
      innerHTML += dynamicCss;
      innerHTML += '</style>';
      shadow.innerHTML += innerHTML;
    }
  }
}
