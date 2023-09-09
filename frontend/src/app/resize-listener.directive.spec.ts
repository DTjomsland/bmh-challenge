import { Directive, ElementRef, HostListener, Renderer2, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appResizeListener]'
})
export class ResizeListenerDirective implements AfterViewInit {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.resizeChart();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.resizeChart();
  }

  private resizeChart(): void {
    const container = this.el.nativeElement;
    const svg = container.querySelector('svg');
    const parentWidth = container.offsetWidth;
    const parentHeight = parentWidth; // Make it square

    this.renderer.setAttribute(svg, 'width', `${parentWidth}`);
    this.renderer.setAttribute(svg, 'height', `${parentHeight}`);
  }
}