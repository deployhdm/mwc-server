import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionLevel } from 'src/enums/permission.enum';
import { LinkGroupMemberService } from 'src/modules/links/services/link-group-member.service';
import { LinkGroupsService } from 'src/modules/links/services/link-groups.service';

@Injectable()
export class LinkGroupGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly linkGroupMemberService: LinkGroupMemberService,
    private readonly linkGroupsService: LinkGroupsService
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    if (!request.user) {
      throw new UnauthorizedException('User not authenticated')
    }

    const userId = request.user.id 
    const linkGroupId = +request.params.id
    const requiredPermissionLevel = this.reflector.get<PermissionLevel>(PermissionLevel, context.getHandler())

    // For routes without noteId
    if (!linkGroupId) {
      return true
    }

    // If user is owner of the note, has all rights
    const ownerId = await this.linkGroupsService.findMemberIdByLinkGroupId(linkGroupId)
    if (ownerId === userId) {
      return true
    }

    const userPermissionLevel = await this.linkGroupMemberService.getPermissionLevelByLinkGroupIdAndMemberId(linkGroupId, userId)
    
    if (userPermissionLevel < requiredPermissionLevel) {
      throw new ForbiddenException('Insufficient permissions to access this resource');
    }
    return true
  }
}
