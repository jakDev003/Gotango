import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms'

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

  lettersRegEx = /[^A-Za-z]+/;
  lettersAndNumbersRegEx = /[^A-Za-z0-9]+/;
  numberRegEx = /\-?\d*\.?\d{1,2}/;
  phoneRegex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
  currencyRegex = /^[0-9]+(\.[0-9]{1,2})?$/;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.quoteForm = this.formBuilder.group({
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(this.phoneRegex)]],
      quoteNum: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      countryOrTerritory: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersRegEx)]],
      address1: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
      address2: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
      address3: ['', [Validators.required, Validators.minLength(3), Validators.pattern(this.lettersAndNumbersRegEx)]],
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
      TaxPrimary: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
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
    this.updateCost(index, "materials");
  }

  onMiscItemChange(event: any, index: any): void{
    this.updateCost(index, "misc");
  }

  onLaborItemChange(event: any, index: any): void{
    this.updateCost(index, "labor");
  }

  onTaxChange($event): void{
    this.updateGrandTotal();
  }

  updateCost(index: any, itemType: string){
    this.updateSubTotalCost(itemType, index);
    this.updateGrandTotalCost();
  }

  updateMaterialsRowSubTotal(index: number){
    this.items = this.quoteForm.get('items') as FormArray;
    let row = this.items.value[index];
    let quantity = this.parseCustomValue(row["quantity"]);
    let unitCost = this.parseCustomValue(row["unitCost"]);
    row["subTotal"] = quantity * unitCost;
    row["unitCost"] = unitCost;
    this.items.at(index).patchValue(row);
  }

  updateLaborRowSubTotal(index: number){
    this.items = this.quoteForm.get('laborCharges') as FormArray;
    let row = this.items.value[index];
    let rateLabor = this.parseCustomValue(row["rateLabor"]);
    let hoursLabor = this.parseCustomValue(row["hoursLabor"]);
    row["itemTotalLabor"] = rateLabor * hoursLabor;
    row["rateLabor"] = rateLabor;
    this.items.at(index).patchValue(row);
  }

  updateSubTotalCost(itemType: string, index: number): void {
    if(itemType == "materials"){
      this.updateMaterialsRowSubTotal(index);
      this.updateMaterials();
    }
    else if(itemType == "misc"){
      this.updateMiscCharges();
    }
    else if(itemType == "labor"){
      this.updateLaborRowSubTotal(index);
      this.updateLaborCharges();
    }
  }

  updateGrandTotalCost(): void {
    this.updateSubTotal();
    this.updateGrandTotal();
  }

  updateSubTotal(){
    let materialsTotal = this.quoteForm.get('materialsTotal');
    let miscChargesTotal = this.quoteForm.get('miscChargesTotal');
    let laborChargesTotal = this.quoteForm.get('laborChargesTotal');
    let subTotalPrimary = this.quoteForm.get('SubTotalPrimary');
    let subTotal = this.parseCustomValue(materialsTotal.value) + this.parseCustomValue(miscChargesTotal.value) + this.parseCustomValue(laborChargesTotal.value);

    subTotalPrimary.patchValue(0.00); // need to always start at zero
    subTotalPrimary.patchValue(subTotal);
  }

  updateGrandTotal(){
    let subTotalPrimary = this.quoteForm.get('SubTotalPrimary');
    let taxPrimary = this.quoteForm.get('TaxPrimary');
    let GrandTotalPrimary = this.quoteForm.get('GrandTotalPrimary');

    let grandTotal = this.parseCustomValue(subTotalPrimary.value) + ((this.parseCustomValue(subTotalPrimary.value) * this.parseCustomValue(taxPrimary.value))/100);

    GrandTotalPrimary.patchValue(0.00); // need to always start at zero
    GrandTotalPrimary.patchValue(grandTotal);
  }

  updateMaterials(){
    let materialsTotal = this.quoteForm.get('materialsTotal');
    this.items = this.quoteForm.get('items') as FormArray;
    let numberOfItems = this.items.length;
    materialsTotal.patchValue(0.00); // need to always start at zero
    for(let i = 0; i<numberOfItems+1; i++){
      let row = this.items.value[i];
      try {
        materialsTotal.patchValue(this.parseCustomValue(materialsTotal.value) + this.parseCustomValue(row['subTotal']));
      } catch(TypeError) {}
    }
  }

  updateMiscCharges(){
    let miscChargesTotal = this.quoteForm.get('miscChargesTotal');
    this.items = this.quoteForm.get('miscCharges') as FormArray;
    let numberOfItems = this.items.length;
    miscChargesTotal.patchValue(0.00); // need to always start at zero
    for(let i = 0; i<numberOfItems+1; i++){
      let row = this.items.value[i];
      try {
        miscChargesTotal.patchValue(this.parseCustomValue(miscChargesTotal.value) + this.parseCustomValue(row["itemTotalMisc"]));
      } catch(TypeError) {}
    }
  }

  updateLaborCharges(){
    let laborChargesTotal = this.quoteForm.get('laborChargesTotal');
    this.items = this.quoteForm.get('laborCharges') as FormArray;
    let numberOfItems = this.items.length;
    laborChargesTotal.patchValue(0.00); // need to always start at zero
    for(let i = 0; i<numberOfItems+1; i++){
      let row = this.items.value[i];
      try{
        laborChargesTotal.patchValue(this.parseCustomValue(laborChargesTotal.value) + this.parseCustomValue(row["itemTotalLabor"]));
      } catch(TypeError) {}
    }
  }

  /* Utilities */
  parseCustomValue(input: any): any {
    if(isNaN(input) || this.isNullOrEmpty(input)){ return 0.00; }

    try { return parseFloat(input); }
    catch (e) {
      console.log(`Cannot parseCustomValue. ${e.message}`)
      return 0.00;
    }
  }

  isNullOrEmpty(input: string): any{
    switch(input){
      case "":
      case null:
      case undefined:
        return true;
      default: false;
    }
  }

}
