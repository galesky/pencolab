import { Component, AfterViewInit } from '@angular/core';
import { CanvasService } from '../canvas/canvas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  constructor(private router: Router) { }
  
  ngAfterViewInit() {
    this.router.navigate([this.generateCanvasId()])
  }
  
  private generateCanvasId() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 1; i < 11; i++) {
      if (i%4 == 0) {
        text += '-'
      } 
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}
