import {
  Component,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { switchMap, takeUntil, pairwise, map } from "rxjs/operators";
import { CanvasService } from "./canvas.service";
import { DrawAction, RemoteDrawAction } from "./draw.interface";
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.style.css"],
})
export class CanvasComponent implements AfterViewInit {
  documents;
  currentDoc: string;
  public siblingSub: Subscription;
  public currentRoom: string;

  constructor(private canvasService: CanvasService, private route: ActivatedRoute) {}

  @ViewChild("canvas") public canvas: ElementRef;

  @Input() public width = 400;
  @Input() public height = 400;

  private cx: CanvasRenderingContext2D;

  handlers = {
    DRAW: this.drawOnCanvas,
  };

  public ngAfterViewInit() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext("2d");

    canvasEl.width = window.innerWidth * 0.95; // Todo
    canvasEl.height = window.innerHeight * 0.9; //Todo

    this.cx.lineWidth = 4;
    this.cx.lineCap = "round";
    this.cx.strokeStyle = "#000";

    this.captureEvents(canvasEl);

    this.documents = this.canvasService.documents;
    this.siblingSub = this.canvasService.siblingDrawAction.subscribe(
      (remoteDrawAction: RemoteDrawAction) => {
        this.remoteDrawOnCanvas(remoteDrawAction)
      }
    );

    this.route.params.subscribe((path) => {
      this.currentRoom = path.id;
      this.newDoc()
    })
  }

  public clear() {
    console.log("clear");
    this.cx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  // todo - Busca o estado atual do canvas
  public getDocument(id: string) {
    this.canvasService.getDocument(id);
  }

  public ping() {
    this.canvasService.pingWs();
  }

  public editRemoteCanvas(drawAction: RemoteDrawAction) {
    console.log("asdasdad")
    this.canvasService.editCanvas(drawAction);
  }

  newDoc() {
    this.canvasService.createOrJoinCanvas(this.currentRoom);
  }

  private captureEvents(canvasEl: HTMLCanvasElement) {
    // this will capture all mousedown events from the canvas element
    fromEvent(canvasEl, "mousedown")
      .pipe(
        switchMap((e) => {
          // after a mouse down, we'll record all mouse moves
          return fromEvent(canvasEl, "mousemove").pipe(
            // we'll stop (and unsubscribe) once the user releases the mouse
            // this will trigger a 'mouseup' event
            takeUntil(fromEvent(canvasEl, "mouseup")),
            // we'll also stop (and unsubscribe) once the mouse leaves the canvas (mouseleave event)
            takeUntil(fromEvent(canvasEl, "mouseleave")),
            // pairwise lets us get the previous value to draw a line from
            // the previous point to the current point
            pairwise()
          );
        })
      )
      .subscribe((res: [MouseEvent, MouseEvent]) => {
        const rect = canvasEl.getBoundingClientRect();
        const prevPos = {
          x: res[0].clientX - rect.left,
          y: res[0].clientY - rect.top,
        };
        const currentPos = {
          x: res[1].clientX - rect.left,
          y: res[1].clientY - rect.top,
        };
        this.localDrawOnCanvas({ prevPos, currentPos });
      });
  }

  // issue -> Too many requests, implement a buffer
  private remoteDrawOnCanvas(drawAction: RemoteDrawAction) {
    this.drawOnCanvas(drawAction)
  }

  private localDrawOnCanvas (drawAction: DrawAction) {
    this.drawOnCanvas(drawAction)
    this.editRemoteCanvas({ ...drawAction, id: this.currentRoom });
  }

  private drawOnCanvas(drawAction: DrawAction): void {
    if (!this.cx) {
      return;
    }
    this.cx.beginPath();
    if (drawAction.prevPos) {
      this.cx.moveTo(drawAction.prevPos.x, drawAction.prevPos.y); // from
      this.cx.lineTo(drawAction.currentPos.x, drawAction.currentPos.y); // to
      this.cx.stroke();
    }
  }


}
