import { Component, OnInit } from '@angular/core';
import { SearchInNavService } from 'src/app/services/search-in-nav.service';

@Component({
  selector: 'app-unauthorized',
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.scss'],
})
export class UnauthorizedComponent implements OnInit {
  searchParam: string = '';
  constructor(private search: SearchInNavService) {}

  ngOnInit(): void {}

  onBlur() {
    this.search.emitSearchChangeEvent(this.searchParam);
  }
}
