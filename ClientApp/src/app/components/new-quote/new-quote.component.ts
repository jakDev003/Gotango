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
      generateQuoteNum: true,
      items: this.formBuilder.array([this.createItem()])
    });
  }

  onGenerateQuoteNum(e): void {
    this.generateQuoteValue = e.target.checked;
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      quantity: ['', [Validators.required, Validators.pattern(this.numberRegEx)]],
      sku: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      unitCost: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
      subTotal: ['', [Validators.required, Validators.pattern(this.currencyRegex)]],
    });
  }

  addItem(): void {
    this.items = this.quoteForm.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(): void {
    let numberOfItems = this.items.length-1;
    if(numberOfItems>0){
      this.items = this.quoteForm.get('items') as FormArray;
      this.items.removeAt(numberOfItems);
    }
  }

  removeAllItems(): void {
    try{
      let numberOfItems = this.items.length-1;
      for(let i = 0; i<numberOfItems+1; i++){
        this.removeItem();
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

  onReset() {
      this.submitted = false;
      this.quoteForm.reset();
      this.removeAllItems();
  }

}
