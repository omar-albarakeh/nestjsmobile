import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from '../Auth/schemas/user.schema';
import { CommunityPost } from './Schemas/Communit.posts';

@Injectable()
export class CommunityRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(CommunityPost.name) private readonly communityPostModel: Model<CommunityPost>,
  ) {}

  private toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  async createPost(userId: string, text: string): Promise<CommunityPost> {
    const userObjectId = this.toObjectId(userId);
    const userExists = await this.userModel.exists({ _id: userObjectId });
    if (!userExists) throw new NotFoundException('User not found');

    return this.communityPostModel.create({ userId: userObjectId, text });
  }

  async likePost(userId: string, postId: string): Promise<{ likes: string[] }> {
  const userObjectId = this.toObjectId(userId);
  const postObjectId = this.toObjectId(postId);

  const post = await this.communityPostModel.findById(postObjectId);
  if (!post) throw new NotFoundException('Post not found');

  if (post.likes.some((like) => like.toString() === userObjectId.toString())) {
    throw new BadRequestException('User already liked this post');
  }

  // Convert to string before pushing
  post.likes.push(userObjectId as any);
  await post.save();
  return { likes: post.likes.map((id) => id.toString()) };
}


  async unlikePost(userId: string, postId: string): Promise<{ likes: string[] }> {
    const userObjectId = this.toObjectId(userId);
    const postObjectId = this.toObjectId(postId);

    const post = await this.communityPostModel.findById(postObjectId);
    if (!post) throw new NotFoundException('Post not found');

    if (!post.likes.some((like) => like.toString() === userObjectId.toString())) {
      throw new BadRequestException('User has not liked this post');
    }

    post.likes = post.likes.filter((like) => like.toString() !== userObjectId.toString());
    await post.save();
    return { likes: post.likes.map((id) => id.toString()) };
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

  async getPosts(): Promise<CommunityPost[]> {
    return this.communityPostModel
      .find()
      .populate('userId', 'name type') // Populate user details
      .exec();
  }
}
