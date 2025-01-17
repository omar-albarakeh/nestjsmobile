import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';
import { CreatePostDto } from './Dto/createPost';
import { AddCommentDto } from './Dto/addComment';

@Controller('community')
@UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('/post')
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    return this.communityService.createPost(req.user.id, createPostDto.text);
  }

  @Post('/like/:postId')
  async likePost(@Req() req, @Param('postId') postId: string) {
    return this.communityService.likePost(req.user.id, postId);
  }

  @Post('/unlike/:postId')
  async unlikePost(@Req() req, @Param('postId') postId: string) {
    return this.communityService.unlikePost(req.user.id, postId);
  }

  @Post('/comment/:postId')
  async addComment(@Req() req, @Param('postId') postId: string, @Body() addCommentDto: AddCommentDto) {
    return this.communityService.addComment(req.user.id, postId, addCommentDto.text);
  }

  @Get('/posts')
  async getPosts() {
    return this.communityService.getPosts();
  }

  @Get('/comments/:postId')
async getCommentsByPost(@Param('postId') postId: string) {
  return this.communityService.getCommentsByPost(postId);
}

  
}
