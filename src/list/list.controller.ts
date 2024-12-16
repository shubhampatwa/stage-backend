import { Controller } from '@nestjs/common';
import { ListService } from './list.servce';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}
}
