import { Message } from '@app/message';
// import { DateService } from '@app/services/date.service';
import { Service } from 'typedi';

@Service()
export class ExampleService {
    clientMessages: Message[];
    constructor() {
        this.clientMessages = [];
    }

    about(): Message {
        return {
            title: 'Basic Server About Page',
            body: 'Try calling /api/docs to get the documentation',
        };
    }

    async helloWorld(): Promise<Message> {
        // console.log(this.clientMessages, 'messages');
        const message: Message = this.clientMessages?.pop() ?? {
            title: 'undefind',
            body: 'message is umpty',
        };
        return {
            title: message.title,
            body: message.body,
        };

        // .catch((error: unknown) => {
        //     return {
        //         title: 'Error',
        //         body: error as string,
        //     };
        // });
    }

    // TODO : ceci est à titre d'exemple. À enlever pour la remise
    storeMessage(message: Message): void {
        // eslint-disable-next-line no-console
        console.log(message);
        this.clientMessages.push(message);
    }

    getAllMessages(): Message[] {
        return this.clientMessages;
    }
}
