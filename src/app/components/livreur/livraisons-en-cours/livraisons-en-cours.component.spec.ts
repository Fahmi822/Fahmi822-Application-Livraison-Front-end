import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonsEnCoursComponent } from './livraisons-en-cours.component';

describe('LivraisonsEnCoursComponent', () => {
  let component: LivraisonsEnCoursComponent;
  let fixture: ComponentFixture<LivraisonsEnCoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivraisonsEnCoursComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivraisonsEnCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
