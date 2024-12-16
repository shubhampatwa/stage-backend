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

const ObjectId = mongoose.Types.ObjectId;
@Injectable()
export class ListService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Movie.name) private movieModel: Model<Movie>,
    @InjectModel(TVShow.name) private tvshowModel: Model<TVShow>,
  ) {}

  async addToList(createListDto: CreateListDto) {
    const { contentId, userId } = createListDto;
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.myList.some((item) => item.contentId === contentId)) {
      throw new ConflictException('Movie/TV show already in list');
    }
    const movie = await this.movieModel.findById(new ObjectId(contentId));
    const tvshow = await this.tvshowModel.findById(new ObjectId(contentId));
    if (!movie && !tvshow) {
      throw new NotFoundException('Movie/TV show not found');
    }

    const contentType = movie ? 'Movie' : 'TVShow';

    user.myList.push({ contentId, contentType });
    const updatedUser = await user.save();
    return {
      message: 'Movie/TV show added to list',
      data: updatedUser.myList,
      statusCode: 200,
    };
  }

  async removeFromList(id: string, userId: string) {
    const user = await this.userModel.findById(new ObjectId(userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.myList.some((item) => item.contentId === id)) {
      throw new NotFoundException('Movie/TV show not found in list');
    }
    user.myList = user.myList.filter((item) => item.contentId !== id);
    const updatedUser = await user.save();
    return {
      message: 'Movie/TV show removed from list',
      data: updatedUser.myList,
      statusCode: 202,
    };
  }

  async listMyItems(getListDto: GetListDto) {
    const { userId, contentType, page, limit } = getListDto;
    const user = await this.userModel.findById(new ObjectId(userId));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const myList = contentType
      ? user.myList.filter((item) => item.contentType === contentType)
      : user.myList;
    const list = myList.slice((page - 1) * limit, page * limit);
    const total = myList.length;

    return {
      message: 'List fetched successfully',
      data: { myList: list, total },
      statusCode: 200,
    };
  }

  async listUser() {
    throw new Error('Method not implemented.');
  }
}
