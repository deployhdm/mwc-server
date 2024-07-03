import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Member } from '../members/entities/member.entity';
import { PostmarkService } from './postmark.service';
import { MemberEmails } from '../member-emails/entities/member-emails.entity';
import { encrypt } from 'src/crypto/crypto.util';

@Injectable()
export class EmailService {

  constructor(
    // private readonly mailerService: MailerService,
    private readonly postmarkService: PostmarkService,
  ) { }

  async sendResetPwdEmail(member: Member, token: string) {
    const subject = "Rénitialisation de votre mot de passe MyWebCompanion"
    const to = member.email;
    const content = '<p> Bonjour ' + member.firstname + ',</p>' +
    '<p>Veuillez cliquer <a href="https://mywebcompanion.com/#/reset-password/' + token + '"> ici </a> afin de réinitialiser votre mot de passe. </p>' +
    '<p>Cordialement,</br>L\'équipe MyWebCompanion</p>'
    try {
      await this.postmarkService.sendEmail(to, subject, content);
      return "email sent"
    } catch (error){
      throw new InternalServerErrorException("Could\'nt send the email. "+error.message)
    }
  }

  //template email send confirmation add new email
  async sendConfirmationAddEmail(newEmail: MemberEmails, memberLastname, token) {
    const subject = "Confirmation d'ajout de votre email"
    const to = newEmail.email;
    const content = '<p> Bonjour ' + memberLastname + ',</p>' +
    '<p>Vous avez fait la demande de liaison de cette adresse mail à votre compte MyWebCompanion. Merci de cliquer <a href="https://www.mywebcompanion.com/#/member-emails/'+token+'">ici</a> pour confirmer l\'ajout. Le lien est valable pour une durée de 7 jours.</p>'
    +'<p>Si vous n\'êtes pas à l\'origine de cette demande veuillez cliquer sur ce <a href="https://www.mywebcompanion.com/#/member-emails/'+newEmail.id+'">lien</a>.</p>'
    +'<p>Cordialement,</br>L\'équipe MyWebCompanion</p>';
    try {
      await this.postmarkService.sendEmail(to, subject, content);
      return "email sent"
    } catch (error){
      throw new InternalServerErrorException("Could\'nt send the email. "+error.message)
    }
  }

  async sendConfirmationInviteEmail(token: string, email: string) {
    const subject = "Demande de partage de note";
    const to = email;
    const content = '<p> Bonjour,</p>' +
    '<p>Merci de cliquer <a href="https://www.mywebcompanion.com/#/inscription/'+token+'">ici</a> pour créer un compte afin de pouvoir accéder à la note partagée ou vous connecter si vous avez déjà un compte.</p>' +
    '<p>Cordialement,</br>L\'équipe MyWebCompanion</p>';
    try {
      await this.postmarkService.sendEmail(to, subject, content);
      return "email sent";
    } catch (error) {
      throw new InternalServerErrorException("Could\'nt send the email. " + error.message);
    }
  }

}