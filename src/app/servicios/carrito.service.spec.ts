import { TestBed } from '@angular/core/testing';
import { carritoService } from './carrito.service';

describe('carritoService', () => {
  let service: carritoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(carritoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
