import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.component.html',
  styleUrls: ['./new-quote.component.css']
})
export class NewQuoteComponent implements OnInit {
  quoteForm: FormGroup;
  items: FormArray;
  submitted: boolean = false;
  generateQuoteValue: boolean = true;
  locale: string = 'USD';
  materialsTotal: number = 0.00;
  miscChargesTotal: number = 0.00;
  laborChargesTotal: number = 0.00;
  subTotal: number = 0.00;
  tax: number = 0.00;
  grandTotal: number = 0.00;
  materialsSubTotals: number[] = [];
  miscChargesSubTotals: number[] = [];
  laborChargesSubTotals: number[] = [];
  materialsSubTotals_Str: string[] = [];
  miscChargesSubTotals_Str: string[] = [];
  laborChargesSubTotals_Str: string[] = [];
  materialsChargesTotal: number = 0.00;

  lettersRegEx = /[^A-Za-z]+/;
  lettersAndNumbersRegEx = /[^A-Za-z0-9]+/;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  phoneRegex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
  currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  constructor(private formBuilder: FormBuilder, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.quoteForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      quoteNum: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      countryOrTerritory: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersRegEx)]],
      address1: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
      address2: ['', [Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
      address3: ['', [Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
      postalCode: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.numberRegEx)]],
      city: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersRegEx)]],
      state: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersRegEx)]],
      other: [''],
      descriptionOfWork: ['', [Validators.required, Validators.minLength(3)]],
      generateQuoteNum: true,
      items: this.formBuilder.array([this.createItem("materials")]),
      materialsTotal: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
      miscCharges: this.formBuilder.array([this.createItem("misc")]),
      miscChargesTotal: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
      laborCharges: this.formBuilder.array([this.createItem("labor")]),
      laborChargesTotal: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
      SubTotalPrimary: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
      TaxPrimary: ['6.25', [Validators.required, Validators.pattern(this.currencyRegex)]],
      GrandTotalPrimary: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
    });
  }

  onGenerateQuoteNum(e): void {
    this.generateQuoteValue = e.target.checked;
    if(e.target.checked == true) {
      this.quoteForm.get('quoteNum').patchValue('');
    }
  }

  createItem(itemType: string): FormGroup {
    switch(itemType){
      case "materials":
        return this.formBuilder.group({
          quantity: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
          sku: ['', [Validators.required, Validators.minLength(3)]],
          description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          unitCost: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
          subTotal: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
        });
      case "misc":
        return this.formBuilder.group({
          descriptionMisc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          itemTotalMisc: ['0', [Validators.required, Validators.pattern(this.currencyRegex)]],
        });
      case "labor":
        return this.formBuilder.group({
          descriptionLabor: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
          hoursLabor: ['0', [Validators.required, Validators.pattern(this.numberRegEx)]],
          rateLabor: ['0', [Validators.required, Validators.pattern(this.numberRegEx)]],
          itemTotalLabor: ['0', [Validators.required, Validators.pattern(this.currencyRegex)]],
        });
    }
  }

  addItem(itemType: string): void {
    if(itemType == "materials"){
      this.items = this.quoteForm.get('items') as FormArray;
      this.items.push(this.createItem(itemType));
    }
    else if(itemType == "misc"){
      this.items = this.quoteForm.get('miscCharges') as FormArray;
      this.items.push(this.createItem(itemType));
    }
    else if(itemType == "labor"){
      this.items = this.quoteForm.get('laborCharges') as FormArray;
      this.items.push(this.createItem(itemType));
    }
  }

  removeItem(itemType: string): void {
    if(itemType == "materials"){
      let numberOfItems = this.items.length-1;
      if(numberOfItems>0){
        this.items = this.quoteForm.get('items') as FormArray;
        this.items.removeAt(numberOfItems);
      }
    }
    else if(itemType == "misc"){
      let numberOfItems = this.items.length-1;
      if(numberOfItems>0){
        this.items = this.quoteForm.get('miscCharges') as FormArray;
        this.items.removeAt(numberOfItems);
      }
    }
    else if(itemType == "labor"){
      let numberOfItems = this.items.length-1;
      if(numberOfItems>0){
        this.items = this.quoteForm.get('laborCharges') as FormArray;
        this.items.removeAt(numberOfItems);
      }
    }
  }

  removeAllItems(itemType: string): void {
    try{
      if(itemType == "all" || itemType == "materials"){
        this.items = this.quoteForm.get('items') as FormArray;
        let numberOfItems = this.items.length-1;
        for(let i = 0; i<numberOfItems+1; i++){
          this.removeItem("materials");
        }
      }

      if(itemType == "all" || itemType == "misc"){
        this.items = this.quoteForm.get('miscCharges') as FormArray;
        let numberOfItems = this.items.length-1;
        for(let i = 0; i<numberOfItems+1; i++){
          this.removeItem("misc");
        }
      }

      if(itemType == "all" || itemType == "labor"){
        this.items = this.quoteForm.get('laborCharges') as FormArray;
        let numberOfItems = this.items.length-1;
        for(let i = 0; i<numberOfItems+1; i++){
          this.removeItem("labor");
        }
      }
    }
    catch{}
  }

  // convenience getter for easy access to form fields
  get f() { return this.quoteForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.quoteForm.invalid) {
          return;
      }

      // display form values on success
      alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.quoteForm.value, null, 4));
  }

  onReset(itemType: string) {
    this.submitted = false;
    this.quoteForm.reset();
    this.removeAllItems(itemType);

  }

  onMaterialItemChange(event: any, index: number): void{
    this.updateCost("materials");
  }

  onMiscItemChange(event: any, index: any): void{
    this.updateCost("misc");
  }

  onLaborItemChange(event: any, index: any): void{
    this.updateCost("labor");
  }

  onTaxChange($event): void{
    //this.updateGrandTotal();
  }

  updateCost(itemType: string){
    if(itemType == "materials"){
      this.updateMaterials();
    }
    else if(itemType == "misc"){
      this.updateMiscCharges();
    }
    else if(itemType == "labor"){
      this.updateLaborCharges();
    }

    this.totalize();
  }

  updateMaterials(): void{
    this.items = this.quoteForm.get('items') as FormArray;
    this.materialsSubTotals = [];
    this.materialsSubTotals_Str = [];
    for(let i = 0; i<this.items.length; i++){
      let row = this.items.value[i];
      let quantity: number = isNaN(this.formatNumbers(row["quantity"])) == false ? this.formatNumbers(row["quantity"]) : 0.00;
      let unitCost: number = isNaN(this.formatNumbers(row["unitCost"])) == false ? this.formatNumbers(row["unitCost"]) : 0.00;

      let results:[number,string] = this.multiplyCustomValues(quantity, unitCost);
      this.materialsSubTotals.push(results[0]);
      this.materialsSubTotals_Str.push(results[1]);

      row["subTotal"] = results[1];
      row["unitCost"] = this.parseCustomValue(unitCost);
      this.items.at(i).patchValue(row);
    }
  }

  updateMiscCharges(): void{
    this.items = this.quoteForm.get('miscCharges') as FormArray;
    this.miscChargesSubTotals = [];
      this.miscChargesSubTotals_Str = [];
    for(let i = 0; i<this.items.length; i++){
      let row = this.items.value[i];
      let itemTotal: number = isNaN(this.formatNumbers(row["itemTotalMisc"])) == false ? this.formatNumbers(row["itemTotalMisc"]) : 0.00;

      this.miscChargesSubTotals.push(itemTotal);
      this.miscChargesSubTotals_Str.push(this.parseCustomValue(itemTotal));

      row["itemTotalMisc"] = this.parseCustomValue(itemTotal);
      this.items.at(i).patchValue(row);
    }
  }

  updateLaborCharges(): void{
    this.items = this.quoteForm.get('laborCharges') as FormArray;
    this.laborChargesSubTotals = [];
    this.laborChargesSubTotals_Str = [];
    for(let i = 0; i<this.items.length; i++){
      let row = this.items.value[i];
      let quantity: number = isNaN(this.formatNumbers(row["hoursLabor"])) == false ? this.formatNumbers(row["hoursLabor"]) : 0.00;
      let laborCost: number = isNaN(this.formatNumbers(row["rateLabor"])) == false ? this.formatNumbers(row["rateLabor"]) : 0.00;

      let results:[number,string] = this.multiplyCustomValues(quantity, laborCost);
      this.laborChargesSubTotals.push(results[0]);
      this.laborChargesSubTotals_Str.push(results[1]);

      row["itemTotalLabor"] = results[1];
      row["rateLabor"] = this.parseCustomValue(laborCost);
      this.items.at(i).patchValue(row);
    }
  }

  totalize(): void{
    this.totalizeMaterials();
    this.totalizeMiscCharges();
    this.totalizeLaborCharges();
    this.totalizeSubTotal();
    this.totalizeGrandTotal();
  }

  totalizeMaterials(): void{
    this.materialsChargesTotal = 0.00;
    for(let i = 0; i<this.materialsSubTotals.length; i++){
      let result:[number, string] = this.addCustomValues(this.materialsChargesTotal, this.materialsSubTotals[i]);
      this.materialsChargesTotal = result[0];
    }
    this.quoteForm.get('materialsTotal').patchValue(this.parseCustomValue(this.materialsChargesTotal));
  }

  totalizeMiscCharges(): void{
    this.miscChargesTotal = 0.00;
    for(let i = 0; i<this.miscChargesSubTotals.length; i++){
      let result:[number, string] = this.addCustomValues(this.miscChargesTotal, this.miscChargesSubTotals[i]);
      this.miscChargesTotal = result[0];
    }
    this.quoteForm.get('miscChargesTotal').patchValue(this.parseCustomValue(this.miscChargesTotal));
  }

  totalizeLaborCharges(): void{
    this.laborChargesTotal = 0.00;
    for(let i = 0; i<this.laborChargesSubTotals.length; i++){
      let result:[number, string] = this.addCustomValues(this.laborChargesTotal, this.laborChargesSubTotals[i]);
      this.laborChargesTotal = result[0];
    }
    this.quoteForm.get('laborChargesTotal').patchValue(this.parseCustomValue(this.laborChargesTotal));
  }

  totalizeSubTotal(): void{
    let total:[number, string] = this.addCustomValues(this.materialsChargesTotal,this.laborChargesTotal, this.miscChargesTotal);
    this.subTotal = total[0];
    this.quoteForm.get('SubTotalPrimary').patchValue(total[1]);
  }

  totalizeGrandTotal(): void{
    this.tax = (this.quoteForm.get('TaxPrimary').value/100);
    let taxValue:[number, string] = this.multiplyCustomValues(this.tax, this.subTotal);
    let total:[number, string] = this.addCustomValues(taxValue[0],this.subTotal);
    this.quoteForm.get('GrandTotalPrimary').patchValue(total[1]);
  }


  /* Utilities */
  isNullOrEmpty(input: string): any{
    switch(input){
      case "":
      case null:
      case undefined:
        return true;
      default: return false;
    }
  }

  validateCustomValue(input: string): number {
    if(this.isNullOrEmpty(input)){ return 0.00; }
    return parseFloat(input);
  }

  parseCustomValue(input: any): string {
    return this.currencyTransform(this.validateCustomValue(input));
  }

  addCustomValues(input: any, input1?: any, input2?: any): [number,string] {
    let item1 = this.validateCustomValue(input);
    let item2 = this.validateCustomValue(input1);
    let item3 = this.validateCustomValue(input2);

    let total = item1+item2+item3;
    return [total,this.currencyTransform(total)];
  }

  multiplyCustomValues(input: any, input1?: any, input2?: any): [number,string] {
    let item1 = this.validateCustomValue(input);
    let item2 = this.validateCustomValue(input1);
    let item3 = this.validateCustomValue(input2);

    let total: number = 0.00;
    if(item1>0 && item2>0 && item3>0) { total = (item1*item2*item3); }
    else if(item1>0 && item2>0) { total = (item1*item2); }

    return [total, this.currencyTransform(total)];
  }

  currencyTransform(input: any): string{
    return this.currencyPipe.transform(input, this.locale, 'symbol'); // add symbol and decimals
  }

  formatNumbers(input: string): number{
    const regEx = /[^\d.]/gi;
    return parseFloat(input.replace(regEx, ''));
  }

}
