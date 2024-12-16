import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedService } from './seed/seed.service';
import { User, UserSchema } from './models/user.schema';
import { TVShow, TVShowSchema } from './models/tvshow.schema';
import { Movie, MovieSchema } from './models/movie.schema';
import { ListModule } from './list/list.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NotFoundInterceptor } from './interceptor/not-found.interceptor';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    MongooseModule.forFeature([
      { name: TVShow.name, schema: TVShowSchema },
      { name: Movie.name, schema: MovieSchema },
      { name: User.name, schema: UserSchema },
    ]),
    ListModule,
  ],
  providers: [
    SeedService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NotFoundInterceptor,
    },
  ],
})
export class AppModule {}
