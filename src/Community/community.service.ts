import { Injectable, BadRequestException } from '@nestjs/common';
import { CommunityRepository } from './CommunityRepository';

@Injectable()
export class CommunityService {
  constructor(private readonly communityRepository: CommunityRepository) {}

  async createPost(userId: string, text: string) {
    if (!text.trim()) {
      throw new BadRequestException('Text cannot be empty');
    }
    return this.communityRepository.createPost(userId, text);
  }

  async likePost(userId: string, postId: string) {
  return this.communityRepository.likePost(userId, postId);
}


  async unlikePost(userId: string, postId: string) {
  return this.communityRepository.unlikePost(userId, postId);
}


  async addComment(userId: string, postId: string, text: string) {
    if (!text.trim()) {
      throw new BadRequestException('Comment cannot be empty');
    }
    await this.communityRepository.addComment(userId, postId, text);
    return { message: 'Comment added successfully' };
  }

  async getPosts(pagination?: { page: number; limit: number }) {
  return this.communityRepository.getPosts(pagination);
}


  async getCommentsByPost(postId: string) {
    return this.communityRepository.getCommentsByPost(postId);
  }
}
