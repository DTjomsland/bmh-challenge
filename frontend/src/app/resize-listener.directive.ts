import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appResizeListener]'
})
export class ResizeListenerDirective {
  @Output() onResize: EventEmitter<void> = new EventEmitter<void>();

  constructor(private element: ElementRef) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    // Emit the resize event when the window is resized
    this.onResize.emit();
  }
}