import { Component, EventEmitter, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { iVideo } from 'src/app/models/CentralVideo';
import { ApiService, HttpMethod } from 'src/app/services/api.service';

@Component({
  selector: 'app-visualizar-video',
  templateUrl: './visualizar-video.component.html',
  styleUrls: ['./visualizar-video.component.scss']
})
export class VisualizarVideoComponent implements OnInit {

  video: iVideo;
  
  addVideo: EventEmitter<number> = new EventEmitter<number>();
  isLoading: boolean = false;
  linkVideo: string = "";

  constructor(
    private api: ApiService,
    private bsModalRef: BsModalRef) {
    this.addVideo.subscribe(cdVideo => this.chargeQuestao(cdVideo));
  }

  ngOnInit(): void {
  }

  private async chargeQuestao(cdVideo: number) {
    this.isLoading = true;
    await this.api.api(HttpMethod.GET, `video/${cdVideo}`)
      .then(res => {
        this.video = res;
        this.linkVideo = this.video.linkVideo.replace('vimeo.com', 'player.vimeo.com/video');
      });
    
    this.isLoading = false;
  }

  close() {
    this.bsModalRef.hide();
  }

}
