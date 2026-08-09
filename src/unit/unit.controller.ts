import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UnitService } from './unit.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { HasAccessGuard } from 'src/common/gaurds/hasAccess.gaurd';
import { User } from 'src/user/entities/user.entity';
import { CreateUnitDto, createUnitDtoSchema } from './dtos/create-unit.dto';
import { UpdateUnitDto, updateUnitDtoSchema } from './dtos/update-unit.dto';
import { GetAllUnitDto, getAllUnitDtoSchema } from './dtos/get-all-unit.dto';

@Controller('unit')
@UseGuards(HasAccessGuard)
export class UnitController {
  constructor(private unitService: UnitService) {}

  @Get()
  @UsePipes(new ZodValidationPipe(getAllUnitDtoSchema))
  async findAllUnits(
    @Req() req: { user: User },
    @Query() query: GetAllUnitDto,
  ) {
    return this.unitService.findAllUnits(query, req.user);
  }

  @Get(':id')
  async findOneUnit(@Param('id') id: number, @Req() req: { user: User }) {
    return this.unitService.findOneUnit(id, req.user);
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createUnitDtoSchema))
  async createUnit(@Req() req: { user: User }, @Body() dto: CreateUnitDto) {
    return this.unitService.createUnit(dto, req.user);
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateUnitDtoSchema))
  async updateUnit(
    @Param('id') id: number,
    @Req() req: { user: User },
    @Body() dto: UpdateUnitDto,
  ) {
    return this.unitService.updateUnit(id, dto, req.user);
  }

  @Delete(':id')
  async deleteUnit(@Param('id') id: number, @Req() req: { user: User }) {
    return this.unitService.deleteUnit(id, req.user);
  }
}
