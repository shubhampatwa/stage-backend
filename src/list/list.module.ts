import { Module } from '@nestjs/common';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { User, UserSchema } from 'src/models/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: TVShow.name, schema: TVShowSchema },
    ]),
  ],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
