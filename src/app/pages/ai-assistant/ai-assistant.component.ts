import { Component, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AiService } from '../../services/ai.service';
import { MensajeChat } from '../../models/activo-fijo.model';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [FormsModule, DatePipe],
  template: `
    <div class="h-[calc(100vh-7rem)] flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Asistente IA</h1>
          <p class="text-sm text-gray-500">Análisis inteligente de conciliaciones</p>
        </div>
        <button (click)="limpiarChat()" class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          Limpiar
        </button>
      </div>

      <!-- Chat Messages -->
      <div #chatContainer class="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        <!-- Welcome -->
        @if (mensajes.length === 0) {
          <div class="text-center py-12">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-aquarius-100 rounded-2xl mb-4">
              <svg class="w-8 h-8 text-aquarius-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 5.527a.5.5 0 01-.457.298H7.927a.5.5 0 01-.457-.298L5 14.5m14 0H5"/></svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Asistente de Conciliaciones IA</h3>
            <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">Haz preguntas sobre tus datos de conciliación. Puedo analizar discrepancias, detectar duplicados, predecir errores y más.</p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg mx-auto">
              @for (pregunta of preguntasSugeridas; track pregunta) {
                <button (click)="enviarSugerida(pregunta)" class="text-left text-xs p-3 bg-white rounded-lg border border-gray-200 hover:border-aquarius-400 hover:bg-aquarius-50 transition-all">
                  <span class="text-aquarius-600">{{ pregunta }}</span>
                </button>
              }
            </div>
          </div>
        }

        @for (msg of mensajes; track msg.id) {
          <div [class]="msg.esUsuario ? 'flex justify-end' : 'flex justify-start'">
            <div [class]="msg.esUsuario
              ? 'bg-aquarius-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%]'
              : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%] shadow-sm'">
              @if (!msg.esUsuario) {
                <div class="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                  <div class="w-5 h-5 bg-aquarius-100 rounded-full flex items-center justify-center">
                    <svg class="w-3 h-3 text-aquarius-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M14.25 3.104v5.714a2.25 2.25 0 00.659 1.591L19 14.5"/></svg>
                  </div>
                  <span class="text-xs font-semibold text-aquarius-700">Asistente IA</span>
                  @if (msg.tipo === 'alerta') {
                    <span class="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full">Alerta</span>
                  }
                  @if (msg.tipo === 'tabla') {
                    <span class="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">Datos</span>
                  }
                  @if (msg.tipo === 'grafico') {
                    <span class="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Análisis</span>
                  }
                </div>
              }
              <div class="text-sm whitespace-pre-wrap leading-relaxed" [innerHTML]="formatMessage(msg.texto)"></div>
              <p class="text-[10px] mt-2 opacity-50">{{ msg.timestamp | date:'HH:mm' }}</p>
            </div>
          </div>
        }

        @if (escribiendo) {
          <div class="flex justify-start">
            <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Sugerencias rápidas -->
      @if (mensajes.length > 0) {
        <div class="flex gap-2 pb-2 overflow-x-auto">
          @for (s of preguntasRapidas; track s) {
            <button (click)="enviarSugerida(s)" class="shrink-0 text-xs px-3 py-1.5 rounded-full border border-aquarius-200 text-aquarius-700 hover:bg-aquarius-50 transition-colors whitespace-nowrap">
              {{ s }}
            </button>
          }
        </div>
      }

      <!-- Input -->
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-2 flex gap-2">
        <input
          #inputRef
          type="text"
          [(ngModel)]="preguntaActual"
          (keyup.enter)="enviarPregunta()"
          placeholder="Escribe tu pregunta sobre conciliaciones..."
          class="flex-1 px-3 py-2 text-sm focus:outline-none"
        />
        <button
          (click)="enviarPregunta()"
          [disabled]="!preguntaActual.trim() || escribiendo"
          class="bg-aquarius-600 hover:bg-aquarius-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
        </button>
      </div>
    </div>
  `,
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  mensajes: MensajeChat[] = [];
  preguntaActual = '';
  escribiendo = false;
  preguntasSugeridas: string[];
  preguntasRapidas = [
    'Errores en BD',
    'Duplicados',
    'Discrepancias',
    'Pendientes',
    'Predicción',
  ];

  private shouldScroll = false;

  constructor(
    private aiService: AiService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
  ) {
    this.preguntasSugeridas = this.aiService.preguntasSugeridas;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  enviarPregunta(): void {
    if (!this.preguntaActual.trim() || this.escribiendo) return;

    const msgUsuario: MensajeChat = {
      id: Math.random().toString(36).substring(2),
      texto: this.preguntaActual,
      esUsuario: true,
      timestamp: new Date(),
    };
    this.mensajes.push(msgUsuario);
    const pregunta = this.preguntaActual;
    this.preguntaActual = '';
    this.escribiendo = true;
    this.shouldScroll = true;

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          const respuesta = this.aiService.procesarPregunta(pregunta);
          this.mensajes.push(respuesta);
          this.escribiendo = false;
          this.shouldScroll = true;
          this.cdr.detectChanges();
        });
      }, 800 + Math.random() * 700);
    });
  }

  enviarSugerida(pregunta: string): void {
    this.preguntaActual = pregunta;
    this.enviarPregunta();
  }

  limpiarChat(): void {
    this.mensajes = [];
  }

  formatMessage(text: string): string {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded text-xs font-mono">$1</code>')
      .replace(/➡️/g, '<span class="text-blue-500">➡️</span>')
      .replace(/\n/g, '<br>');
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }
}
