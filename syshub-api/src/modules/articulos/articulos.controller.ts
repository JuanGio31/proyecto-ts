import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';
import { ReactionType } from './entities/articulo-like.entity';

@Controller('articulos')
export class ArticulosController {
  constructor(private readonly articulosService: ArticulosService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createArticuloDto: CreateArticuloDto,
    @GetUser('userId') userId: number,
  ) {
    return this.articulosService.create(createArticuloDto, userId);
  }

  @Get()
  findAll() {
    return this.articulosService.findAll();
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard)
  findMyArticles(@GetUser('userId') userId: number) {
    return this.articulosService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateArticuloDto: UpdateArticuloDto,
  ) {
    return this.articulosService.update(id, updateArticuloDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.remove(id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.articulosService.toggleReaction(id, userId, ReactionType.LIKE);
  }

  @Post(':id/dislike')
  @UseGuards(JwtAuthGuard)
  toggleDislike(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.articulosService.toggleReaction(id, userId, ReactionType.DISLIKE);
  }

  @Delete(':id/reaction')
  @UseGuards(JwtAuthGuard)
  removeReaction(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.articulosService.removeReaction(id, userId);
  }

  @Get(':id/reactions')
  getReactions(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.getCounts(id);
  }

  @Get(':id/reactions/me')
  @UseGuards(JwtAuthGuard)
  getMyReaction(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
  ) {
    return this.articulosService.getUserReaction(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/likes')
  getMyLikes(@GetUser('userId') userId: number) {
    return this.articulosService.findMyLikes(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/comentarios')
  getMyComments(@GetUser('userId') userId: number) {
    return this.articulosService.findMyComments(userId);
  }

  @Get(':id/comentarios')
  getComentarios(@Param('id', ParseIntPipe) id: number) {
    return this.articulosService.getComentarios(id);
  }

  @Post(':id/comentarios')
  @UseGuards(JwtAuthGuard)
  addComentario(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('userId') userId: number,
    @Body('contenido') contenido: string,
  ) {
    return this.articulosService.addComentario(id, userId, contenido);
  }
}