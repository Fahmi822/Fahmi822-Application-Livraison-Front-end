import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLivreursComponent } from './list-livreurs.component';

describe('ListLivreursComponent', () => {
  let component: ListLivreursComponent;
  let fixture: ComponentFixture<ListLivreursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLivreursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLivreursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
