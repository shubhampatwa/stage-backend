import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { User } from 'src/models/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TVShow } from 'src/models/tvshow.schema';
import { Movie } from 'src/models/movie.schema';
import { GetListDto } from './dto/get-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvshowModel: Model<TVShow>,
  ) {}

  async addToList(createListDto: CreateListDto) {
    const { contentId, userId } = createListDto;
    const user = await this.userModel.findById(userId, { _id: 1 });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const movie = await this.movieModel.findById(contentId);
    const tvshow = await this.tvshowModel.findById(contentId);
    if (!movie && !tvshow) {
      throw new NotFoundException('Movie/TV show not found');
    }

    const contentType = movie ? 'Movie' : 'TVShow';

    const updatedUser = await this.userModel.updateOne(
      { _id: userId, 'myList.contentId': { $ne: contentId } },
      {
        $addToSet: { myList: { contentId, contentType } },
      },
      { fields: { _id: 1 } },
    );
    if (updatedUser.modifiedCount === 0) {
      throw new ConflictException('Movie/TV show already in list');
    }

    return {
      message: 'Movie/TV show added to list',
      data: { contentId, contentType },
      statusCode: 200,
    };
  }

  async removeFromList(id: string, userId: string) {
    const user = await this.userModel.findById(userId, {
      _id: 1,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userModel.updateOne(
      { _id: userId, 'myList._id': id },
      {
        $pull: { myList: { _id: id } },
      },
      { fields: { _id: 1 } },
    );

    if (updatedUser.modifiedCount === 0) {
      throw new NotFoundException('Movie/TV show not found in list');
    }

    return {
      message: 'Movie/TV show removed from list',
      data: null,
      statusCode: 202,
    };
  }

  async listMyItems(getListDto: GetListDto) {
    const { userId, contentType, page, limit } = getListDto;
    const matchQuery = {
      _id: new mongoose.Types.ObjectId(userId),
    };
    if (contentType) {
      matchQuery['myList.contentType'] = contentType;
    }
    const mylist = await this.userModel
      .aggregate([
        { $match: matchQuery },
        { $unwind: '$myList' },
        {
          $match: {
            'myList.contentType': contentType ?? { $in: ['Movie', 'TVShow'] },
          },
        },
        { $sort: { 'myList._id': -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'movies',
            localField: 'myList.contentId',
            foreignField: '_id',
            as: 'movie',
          },
        },
        {
          $lookup: {
            from: 'tvshows',
            localField: 'myList.contentId',
            foreignField: '_id',
            as: 'tvshow',
          },
        },
        {
          $project: {
            _id: 1,
            myList: 1,
            movie: 1,
            tvshow: 1,
          },
        },
      ])
      .exec();

    if (!mylist) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'List fetched successfully',
      data: mylist,
      statusCode: 200,
    };
  }

  async listUser() {
    throw new Error('Method not implemented.');
  }
}
