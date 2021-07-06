import { TestBed } from '@angular/core/testing';

import { VincularQuestaoService } from './vincular-questao.service';

describe('VincularQuestaoService', () => {
  let service: VincularQuestaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VincularQuestaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
