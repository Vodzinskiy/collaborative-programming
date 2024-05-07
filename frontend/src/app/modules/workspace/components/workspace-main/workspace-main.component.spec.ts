import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceMainComponent } from './workspace-main.component';

describe('WorkspaceMainComponent', () => {
  let component: WorkspaceMainComponent;
  let fixture: ComponentFixture<WorkspaceMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WorkspaceMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
