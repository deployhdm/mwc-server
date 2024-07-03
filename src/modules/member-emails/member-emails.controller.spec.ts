import { Test, TestingModule } from '@nestjs/testing';
import { MemberEmailsService } from './member-emails.service';
import { MemberEmailsController } from './member-emails.controller';
import { LessThan, Repository } from 'typeorm';
import { MemberEmails } from './entities/member-emails.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from '../members/entities/member.entity';
describe('MemberEmailsController', () => {
  let controller: MemberEmailsController;
  let service: MemberEmailsService;
  let repository: Repository<MemberEmails>;
  let memberRepository: Repository<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberEmailsService,
        {
          provide: getRepositoryToken(MemberEmails),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Member), // Fournir un référentiel simulé pour la classe Member
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<MemberEmailsController>(MemberEmailsController);
    service = module.get<MemberEmailsService>(MemberEmailsService);
    repository = module.get<Repository<MemberEmails>>(
      getRepositoryToken(MemberEmails),
    );
    memberRepository = module.get<Repository<Member>>( // Obtenir une instance du référentiel de membre
      getRepositoryToken(Member),
    );
  });

  // Dans votre test
  // it('should clean up unconfirmed emails before specified date', async () => {
  //   // Préparer les données de test (par exemple, créer des e-mails non confirmés dans la base de données)
  
  //   const dateToTest = new Date('2024-05-05'); // Date à utiliser pour le test
  //   await service.cleanupUnconfirmedEmailsByDate(dateToTest);
  
  //   // Vérifier que les e-mails non confirmés ont été supprimés de la base de données
  //   const unconfirmedEmails = await repository.find({ where: { status: 'created', createdAt: LessThan(dateToTest) } });
  //   expect(unconfirmedEmails).toHaveLength(0);
  // });
});
