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
    await user.save();
    return user;
  }

  async removeFromList() {
    throw new Error('Method not implemented.');
  }

  async listMyItems() {
    throw new Error('Method not implemented.');
  }

  async listUser() {
    throw new Error('Method not implemented.');
  }
}
