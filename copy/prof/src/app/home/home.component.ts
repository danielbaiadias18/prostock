import {
  Component,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {
  Router,
  RouterEvent,
  ActivatedRoute,
  NavigationStart,
} from '@angular/router';
import { filter } from 'rxjs/operators';

const mode = 'index';
const intersect = true;

const ticksStyle = {
  fontColor: '#495057',
  fontStyle: 'bold',
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  teste: IDBDatabaseEventMap;

  constructor(private router: ActivatedRoute) {
    this.router.params.subscribe((val: any) => {
      if (val instanceof NavigationStart) {
      }
    });
  }

  ngAfterViewInit(): void {
    this.charts.forEach((child) => {
      child.chart.update();
    });
  }

  ngOnInit(): void {
    this.buildCanvas();
  }

  //#region Graficos

  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;

  visitors;
  sales;

  buildCanvas() {
    //#region Sales

    this.sales = {
      type: 'bar',
      data: {
        labels: ['JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        datasets: [
          {
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            data: [1000, 2000, 3000, 2500, 2700, 2500, 3000],
          },
          {
            backgroundColor: '#ced4da',
            borderColor: '#ced4da',
            data: [700, 1700, 2700, 2000, 1800, 1500, 2000],
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          mode: mode,
          intersect: intersect,
        },
        hover: {
          mode: mode,
          intersect: intersect,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              // display: false,
              gridLines: {
                display: true,
                lineWidth: '4px',
                color: 'rgba(0, 0, 0, .2)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                beginAtZero: true,
                // Include a dollar sign in the ticks
                callback: (value) => {
                  if (value >= 1000) {
                    value /= 1000;
                    value += 'k';
                  }

                  return '$' + value;
                },
                fontColor: ticksStyle.fontStyle,
                fontStyle: ticksStyle.fontStyle,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              gridLines: {
                display: false,
              },
              ticks: ticksStyle,
            },
          ],
        },
      },
    };

    //#endregion

    //#region visitors

    this.visitors = {
      type: 'line',
      data: {
        labels: ['18th', '20th', '22nd', '24th', '26th', '28th', '30th'],
        datasets: [
          {
            type: 'line',
            data: [100, 120, 170, 167, 180, 177, 160],
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            pointBorderColor: '#007bff',
            pointBackgroundColor: '#007bff',
            fill: false,
            // pointHoverBackgroundColor: '#007bff',
            // pointHoverBorderColor    : '#007bff'
          },
          {
            type: 'line',
            data: [60, 80, 70, 67, 80, 77, 100],
            backgroundColor: 'tansparent',
            borderColor: '#ced4da',
            pointBorderColor: '#ced4da',
            pointBackgroundColor: '#ced4da',
            fill: false,
            // pointHoverBackgroundColor: '#ced4da',
            // pointHoverBorderColor    : '#ced4da'
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          mode: mode,
          intersect: intersect,
        },
        hover: {
          mode: mode,
          intersect: intersect,
        },
        legend: {
          display: false,
        },
        scales: {
          yAxes: [
            {
              // display: false,
              gridLines: {
                display: true,
                lineWidth: '4px',
                color: 'rgba(0, 0, 0, .2)',
                zeroLineColor: 'transparent',
              },
              ticks: {
                beginAtZero: true,
                suggestedMax: 200,
                fontColor: ticksStyle.fontColor,
                fontStyle: ticksStyle.fontStyle,
              },
            },
          ],
          xAxes: [
            {
              display: true,
              gridLines: {
                display: false,
              },
              ticks: ticksStyle,
            },
          ],
        },
      },
    };

    //#region
  }

  //#endregion
}
