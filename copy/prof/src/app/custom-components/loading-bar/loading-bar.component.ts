import { Component, OnInit, Injectable, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-loading-bar',
  templateUrl: './loading-bar.component.html',
  styleUrls: ['./loading-bar.component.scss']
})
export class LoadingBarComponent implements OnInit {
  Hided: boolean = true;
  @Input() placeholder: string = "";

  constructor(public loadProgress: LoadingProgressService) { }

  ngOnInit(): void {
    this.loadProgress.Hide.subscribe(() => this.Hided = true);
    this.loadProgress.Show.subscribe(() => this.Hided = false);
  }

}

@Injectable({
  providedIn: "root"
})
export class LoadingProgressService {
  public Hide: EventEmitter<void> = new EventEmitter();
  public Show: EventEmitter<void> = new EventEmitter();

  private _currentProgress: number = null;
  get currentProgress(): number { return this._currentProgress; }
  set currentProgress(val: number) {
    if (!val) this.Hide.emit();
    else this.Show.emit();

    this._currentProgress = val;
  }
}
