import { IMessage } from './../../interfaces/IMessage';
import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CommService } from "../../services/comm.service";
import { SnotifyService } from "ng-snotify";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IUser } from "../../interfaces/IUser";
import { User } from "../../interfaces/User";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: IUser = <IUser>{};
  message: string;
  questionsWithAnswers: IMessage[];

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService,
    private service: CommService, private toast: SnotifyService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.service.getUserDetails(username).subscribe(res => {
          this.user = res;
          this.user.imageUrl = newImageUrl(this.user.imageUrl);
          this.loadMessages(this.user.username);
        });
      }
      else if (!username && !this.authService.isAuthenticated) {
        this.router.navigate(['/']);
      } else {
        this.user = this.authService.FullUserDetails as IUser;
        this.loadMessages(this.user.username);
      }
      this.user.imageUrl = newImageUrl(this.user.imageUrl);
    });
  }

  submitMessage(message) {
    if (/^\s*$/.test(message.value)) {
      this.toast.warning('Enter a Valid Message', 'Wrong!!!', { timeout: 5000 });
    } else {
      this.service.sendMessage(this.user.username, message.value);
      message.value = '';
    }
  }


  loadMessages(username: string) {
    this.service.getVisibleMessages(username)
      .subscribe(res => {
        this.questionsWithAnswers = res;
      });
  }

}
function newImageUrl(imgURl: string) {
  if (imgURl == null) return '';
  return imgURl.substring(imgURl.indexOf('uploads'))
}