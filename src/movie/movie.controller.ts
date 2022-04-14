// import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
// import { Auth } from 'src/auth/decorators/auth.decorator';
// import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
// import { UpdateMovieDto } from './dto/update-movie.dto';
// import { MovieService } from './movie.service';
// import { Types } from 'mongoose'
// import { GenreIdsDto } from './dto/genreIds.dto';

// @Controller('movies')
// export class MovieController {

// 	constructor(private readonly movieService: MovieService) { }
// 	/*Getting movies by slug*/
// 	@Get('by-slug/:slug')
// 	async bySlug(@Param('slug') slug: string) {
// 		const doc = await this.movieService.bySlug(slug)
// 		if (!doc) {
// 			throw new NotFoundException('Movie not found')
// 		}
// 		return doc
// 	}

// 	@Get('by-actor/:actorId')
// 	async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
// 		return this.movieService.byActor(actorId);
// 	}

// 	@UsePipes(new ValidationPipe())
// 	@Post('by-genres')
// 	@HttpCode(200)
// 	async byGenres(@Body() { genreIds }: GenreIdsDto) {
// 		return this.movieService.byGenres(genreIds);
// 	}

// 	@Get('most-popular')
// 	async getMostPopular() {
// 		return this.movieService.getMostPopular()
// 	}

// 	@Put('update-count-opened')
// 	@HttpCode(200)
// 	async updateCountOpened(@Body('slug') slug: string) {
// 		return this.movieService.updateCountOpened(slug);
// 	}
// 	@Get()
// 	async getAll(@Query('searchTerm') searchTerm?: string) {
// 		return this.movieService.getAll(searchTerm)
// 	}

// 	/**ADMIN */

// 	@Get(':id')
// 	@Auth('admin')
// 	async get(@Param('id', IdValidationPipe) id: string) {
// 		return this.movieService.byId(id);
// 	};

// 	@UsePipes(new ValidationPipe())
// 	@Put(':id')
// 	@HttpCode(200)
// 	@Auth('admin')
// 	async update(
// 		@Param('id', IdValidationPipe) id: string,
// 		@Body() dto: UpdateMovieDto
// 	) {
// 		const updateMovie = await this.movieService.update(id, dto)
// 		if (!updateMovie) throw new NotFoundException('Movie not found')
// 		return updateMovie
// 	}


// 	@Post()
// 	@HttpCode(200)
// 	@Auth('admin')
// 	async create() {
// 		return this.movieService.create();
// 	}

// 	@Delete(':id')
// 	@HttpCode(200)
// 	@Auth('admin')
// 	async delete(@Param('id', IdValidationPipe) id: string) {
// 		return this.movieService.delete(id);
// 	}
// }
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { IdValidationPipe } from '../pipes/id.validation.pipe'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'
import { Auth } from 'src/auth/decorators/Auth.decorator'
import { Types } from 'mongoose'

@Controller('movies')
export class MovieController {
	constructor(private readonly movieService: MovieService) { }

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		return this.movieService.bySlug(slug)
	}

	@Get('by-actor/:actorId')
	async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
		return this.movieService.byActor(actorId)
	}

	@Post('by-genres')
	@HttpCode(200)
	async byGenres(
		@Body('genreIds')
		genreIds: Types.ObjectId[]
	) {
		return this.movieService.byGenres(genreIds)
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.movieService.getAll(searchTerm)
	}

	@Get('/most-popular')
	async getMostPopular() {
		return this.movieService.getMostPopular()
	}

	@Post('/update-count-opened')
	@HttpCode(200)
	async updateCountOpened(@Body('slug') slug: string) {
		return this.movieService.updateCountOponed(slug)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.movieService.byId(id)
	}

	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.movieService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: UpdateMovieDto
	) {
		const updateMovie = await this.movieService.update(id, dto)
		if (!updateMovie) throw new NotFoundException('Movie not found')
		return updateMovie
	}

	@Delete(':id')
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.movieService.delete(id)
		if (!deletedDoc) throw new NotFoundException('Movie not found')
	}
}
