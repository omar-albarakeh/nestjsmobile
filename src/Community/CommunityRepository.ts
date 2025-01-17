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

  const post = await this.communityPostModel.findOneAndUpdate(
    { _id: postObjectId, likes: { $ne: userObjectId } }, // Ensure user hasn't already liked
    { $addToSet: { likes: userObjectId } }, // Add only if not already present
    { new: true }
  );

  if (!post) throw new NotFoundException('Post not found or already liked');

  return { likes: post.likes.map((id) => id.toString()) };
}



  async unlikePost(userId: string, postId: string): Promise<{ likes: string[] }> {
  const userObjectId = this.toObjectId(userId);
  const postObjectId = this.toObjectId(postId);

  const post = await this.communityPostModel.findOneAndUpdate(
    { _id: postObjectId, likes: userObjectId }, // Ensure the user has liked the post
    { $pull: { likes: userObjectId } }, // Remove the user's `userId` from `likes`
    { new: true }
  );

  if (!post) throw new NotFoundException('Post not found or user has not liked it');

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

  async getCommentsByPost(postId: string): Promise<any[]> {
  const postObjectId = this.toObjectId(postId);

  const post = await this.communityPostModel
    .findById(postObjectId)
    .populate('comments.userId', 'name'); // Populate only the name field of the user

  if (!post) throw new NotFoundException('Post not found');

  return post.comments.map((comment) => {
    const user = comment.userId as unknown as PopulatedUser; // Explicitly type the populated userId
    return {
      userName: user.name,
      text: comment.text,
      createdAt: comment.createdAt,
    };
  });
}


}
