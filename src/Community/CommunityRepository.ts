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

 async getPosts(pagination?: { page: number; limit: number }): Promise<CommunityPost[]> {
  const { page = 1, limit = 10 } = pagination || {};
  return this.communityPostModel
    .find()
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'name type')
    .exec();
}
  private toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }
  async addComment(userId: string, postId: string, text: string): Promise<void> {
    const userObjectId = this.toObjectId(userId);
    const postObjectId = this.toObjectId(postId);

    const post = await this.communityPostModel.findById(postObjectId);
    if (!post) throw new NotFoundException('Post not found');

    post.comments.push({
      userId: userObjectId,
      text,
      createdAt: new Date(),
    });

    await post.save();
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
