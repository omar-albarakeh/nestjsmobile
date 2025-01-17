import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommunityService } from './community.service';
import { CreatePostDto } from './Dto/createPost';
import { AddCommentDto } from './Dto/addComment';

@Controller('community')
@UseGuards(AuthGuard('jwt'))
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Post('/posts')
  async createPost(@Req() req, @Body() createPostDto: CreatePostDto) {
    const post = await this.communityService.createPost(req.user.id, createPostDto.text);
    return { success: true, message: 'Post created successfully', post };
  }

  @Post('/posts/:postId/like')
  async likePost(@Req() req, @Param('postId') postId: string) {
    return this.communityService.likePost(req.user.id, postId);
  }

  @Post('/posts/:postId/unlike')
  async unlikePost(@Req() req, @Param('postId') postId: string) {
    return this.communityService.unlikePost(req.user.id, postId);
  }

  @Post('/posts/:postId/comments')
  async addComment(
    @Req() req,
    @Param('postId') postId: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    const comment = await this.communityService.addComment(req.user.id, postId, addCommentDto.text);
    return { success: true, message: 'Comment added successfully', comment };
  }

  @Get('/posts')
async getPosts(@Query('page') page = 1, @Query('limit') limit = 10) {
  return this.communityService.getPosts({ page: +page, limit: +limit });
}



  @Get('/posts/:postId/comments')
  async getCommentsByPost(@Param('postId') postId: string) {
    return this.communityService.getCommentsByPost(postId);
  }
}
