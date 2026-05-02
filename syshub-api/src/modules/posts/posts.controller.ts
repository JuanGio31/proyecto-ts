import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@app/common/guards/jwt-auth.guard';
import { GetUser } from '@app/common/decorators/get-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPosts(@GetUser('userId') userId: number) {
    return this.postsService.findMyPosts(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/likes')
  getMyLikes(@GetUser('userId') userId: number) {
    return this.postsService.findMyLikes(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/comentarios')
  getMyComments(@GetUser('userId') userId: number) {
    return this.postsService.findMyComments(userId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Get(':id/comentarios')
  getComentarios(@Param('id') postId: number) {
    return this.postsService.getComentarios(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @GetUser('userId') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(createPostDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comentarios')
  createComentario(
    @Param('id') postId: number,
    @GetUser('userId') userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postsService.create(
      { ...createPostDto, post_respuesta_id: postId },
      userId,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
