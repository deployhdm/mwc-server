import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class PostmarkService {
    private client: postmark.ServerClient;

    constructor() {
        this.client = new postmark.ServerClient(process.env.MAILER_POSTMARK_TOKEN);
    }
    async sendEmail(to: string, subject: string, content: string) {
        const email = {
            From: process.env.MAILER_MAIL_MYWEBCOMPANION,
            To: to,
            Subject: subject,
            HtmlBody: content,
        };
        return this.client.sendEmail(email);
    }
}

