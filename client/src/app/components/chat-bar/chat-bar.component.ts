import { Component } from '@angular/core';

@Component({
    selector: 'app-chat-bar',
    templateUrl: './chat-bar.component.html',
    styleUrls: ['./chat-bar.component.scss'],
})
export class ChatBarComponent {
    submitMessage() {
        // TODO: Submit Message.
        // Must be kept empty for now for key presses to block when about to send a message
    }
}
