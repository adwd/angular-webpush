import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';

import { WebPushService } from './web-push/web-push.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ WebPushService ]
})
export class AppComponent implements OnInit {
  title = 'app';
  isSubscribed: Observable<boolean>;

  constructor(private webPush: WebPushService) {
    this.isSubscribed = webPush.isSubscribed.asObservable();
  }

  ngOnInit() {
    this.webPush.register();
  }

  onClick() {
    if (this.webPush.isSubscribed.getValue()) {
      this.webPush.unsubscribe();
    } else {
      this.webPush.subscribe();
    }
  }
}
