import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../Auth/schemas/user.schema';
import { CommunityPost } from './Schemas/Community.posts';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CommunityPost.name) private readonly communityPostModel: Model<CommunityPost>,
  ) {}

  async createPost(userId: string, text: string): Promise<CommunityPost> {
    const userExists = await this.userModel.exists({ _id: userId });
    if (!userExists) throw new NotFoundException('User not found');
    return this.communityPostModel.create({ userId, text });
  }

  async likePost(userId: string, postId: string): Promise<{ likes: string[] }> {
    const post = await this.communityPostModel.findOneAndUpdate(
      { _id: postId, likes: { $ne: userId } },
      { $addToSet: { likes: userId } },
      { new: true }
    );
    if (!post) throw new NotFoundException('Post not found or already liked');
    return { likes: post.likes.map((id) => id.toString()) };
  }

  async unlikePost(userId: string, postId: string): Promise<{ likes: string[] }> {
    const post = await this.communityPostModel.findOneAndUpdate(
      { _id: postId, likes: userId },
      { $pull: { likes: userId } },
      { new: true }
    );
    if (!post) throw new NotFoundException('Post not found or user has not liked it');
    return { likes: post.likes.map((id) => id.toString()) };
  }

  async addComment(userId: string, postId: string, text: string): Promise<void> {
    const post = await this.communityPostModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    post.comments.push({ userId, text, createdAt: new Date() });
    await post.save();
  }

  async getPosts(): Promise<CommunityPost[]> {
    return this.communityPostModel.find().populate('userId', 'name type').exec();
  }

  async getCommentsByPost(postId: string): Promise<any[]> {
    const post = await this.communityPostModel
      .findById(postId)
      .populate('comments.userId', 'name');
    if (!post) throw new NotFoundException('Post not found');
    return post.comments.map((comment) => ({
      userName: (comment.userId as unknown as PopulatedUser).name,
      text: comment.text,
      createdAt: comment.createdAt,
    }));
  }
}
