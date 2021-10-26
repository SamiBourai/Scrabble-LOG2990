import { Injectable } from '@angular/core';
import { Game } from '@app/classes/game';
import { Observable } from 'rxjs';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class SocketManagementService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private socket: any;
    constructor() {
        this.socket = io(environment.serverUrl);
    }

    listen(eventName: string) {
        return new Observable((subscriber) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.socket.on(eventName, (data: Game[]) => {
                subscriber.next(data);
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    emit(eventName: string, data?: Game, reason?: string) {
        if (reason) this.socket.emit(eventName, reason);
        else this.socket.emit(eventName, data);
    }

    // configureBaseSocketFeatures(): Rx.Subject<MessageEvent> {
    //     // Afficher l'identifiant du Socket dans l'interface
    //     this.socket.on('connect', () => {
    //         // document.getElementById('socketIdField').textContent = this.socket.id;
    //     });

    //     // Afficher le message envoyé lors de la connexion avec le serveur
    //     // this.socket.on('hello', (message) => {
    //     //     // document.getElementById('messageField').textContent = message;
    //     // });

    //     // // Afficher le message envoyé à chaque émission de l'événement "clock" du serveur
    //     // this.socket.on('clock', (time) => {
    //     //     // document.getElementById('serverClock').textContent = time;
    //     // });

    //     // Se déconnecter du serveur
    //     // document.getElementById('disconnect').addEventListener('click', () => {
    //     // this.socket.disconnect();
    //     // });

    //     // Envoyer un mot à valider au serveur
    //     // //document.getElementById('validateByServer').addEventListener('click', () => {
    //     //     const wordToValidate = document.getElementById('wordInput').value;
    //     //     this.socket.emit('validate', wordToValidate);
    //     //     document.getElementById('wordInput').value = '';
    //     // });

    //     // Gérer l'événement envoyé par le serveur : afficher le résultat de validation
    //     // this.socket.on('wordValidated', (isValid) => {
    //     //     // const validationString = `Le mot est ${isValid ? 'valide' : 'invalide'}`;
    //     //     // document.getElementById('serverValidationResult').textContent = validationString;
    //     // });
    // }
}
