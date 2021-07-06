import { Component, OnInit } from '@angular/core';
import { SearchInNavService } from 'src/app/services/search-in-nav.service';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.component.html',
  styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnInit {
  searchParam: string = '';
  constructor(private search: SearchInNavService) { }

  ngOnInit(): void {
  }

  onBlur() {
    this.search.emitSearchChangeEvent(this.searchParam);
  }
}
