import { Controller, Get, Delete, Put, Param, Query, HttpCode, UsePipes, ValidationPipe, Body, Post, NotFoundException } from '@nestjs/common';
import { validate } from 'class-validator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { IdValidationPipe } from 'src/pipes/id.validation.pipe';
import { CreateGenreDto } from './dto/create-genre.dto';
import { GenreService } from './genre.service';

@Controller('genres')
export class GenreController {
	constructor(private readonly genreService: GenreService) { }

	@Get('by-slug/:slug')
	async bySlug(@Param('slug') slug: string) {
		const doc = await this.genreService.bySlug(slug)
		if (!doc) {
			throw new NotFoundException('Genre not found')
		}
		return doc
	}

	@Get('collections')
	async getCollections() {
		return this.genreService.getCollections();
	}

	@Get()
	async getAll(@Query('searchTerm') searchTerm?: string) {
		return this.genreService.getAll(searchTerm)
	}

	@Get(':id')
	@Auth('admin')
	async get(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.byId(id);
	};

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth('admin')
	async update(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateGenreDto) {
		return this.genreService.update(id, dto);
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth('admin')
	async create() {
		return this.genreService.create();
	}

	@Delete(':id')
	@HttpCode(200)
	@Auth('admin')
	async delete(@Param('id', IdValidationPipe) id: string) {
		return this.genreService.delete(id);
	}
}
