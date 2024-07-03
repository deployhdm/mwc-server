import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionLevel } from 'src/enums/permission.enum';
import { LinkGroupMemberService } from 'src/modules/links/services/link-group-member.service';
import { LinkGroupsService } from 'src/modules/links/services/link-groups.service';
import { LinksService } from 'src/modules/links/services/links.service';

@Injectable()
export class LinkGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly linkGroupMemberService: LinkGroupMemberService,
    private readonly linkGroupsService: LinkGroupsService,
    private readonly linksService: LinksService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated')
    }

    const requiredPermissionLevel = this.reflector.get<PermissionLevel>(PermissionLevel, context.getHandler())
    const userId = request.user.id 
    const body = request.body
    let linksGroupId = body?.linksGroupId
    const linkId = +request.params.id // if the route has the param id (linkId)

    if (!linksGroupId && linkId) {
      const link = await this.linksService.findOne(linkId)
      linksGroupId = link.linkGroup.id
    }

    // If user is owner of the linkGroup, has all rights 
    const ownerId = await this.linkGroupsService.findMemberIdByLinkGroupId(linksGroupId)
    if (ownerId === userId) {
      return true
    }

    // A Link can be created only if the user has enough permission for its LinkGroup
    if (linksGroupId && userId) {
      const userPermissionLevel:PermissionLevel = await this.linkGroupMemberService.getPermissionLevelByLinkGroupIdAndMemberId(linksGroupId, userId)
      if (userPermissionLevel < requiredPermissionLevel) {
        throw new ForbiddenException('Insufficient permissions to access this resource');
      }
      return true
    }
    return true
  }
}
