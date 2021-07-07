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

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.quoteForm = this.formBuilder.group({
      customerName: '',
      email: '',
      phone: '',
      quoteNum: '',
      items: this.formBuilder.array([this.createItem()])
    });

  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      quantity: 0,
      sku: '',
      description: '',
      unitCost: 0.00,
      subTotal: 0.00,
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
}
