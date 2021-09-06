import { Message } from '@app/message';
import { Service } from 'typedi';

@Service()
export class DateService {
    async currentTime(): Promise<Message> {
        return {
            title: 'Time',
            body: new Date().toString(),
        };
    }
}
