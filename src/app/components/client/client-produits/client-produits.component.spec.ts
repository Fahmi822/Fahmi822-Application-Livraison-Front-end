import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProduitsComponent } from './client-produits.component';

describe('ClientProduitsComponent', () => {
  let component: ClientProduitsComponent;
  let fixture: ComponentFixture<ClientProduitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientProduitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientProduitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
