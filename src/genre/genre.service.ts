import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { MovieService } from 'src/movie/movie.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { ICollection } from './genre.interface';
import { GenreModel } from './genre.model';

@Injectable()
export class GenreService {
	constructor(@InjectModel(GenreModel) private readonly genreModel: ModelType<GenreModel>,
		private readonly movieService: MovieService) { }

	async bySlug(slug: string) {
		return this.genreModel.findOne({ slug }).exec()
	}

	async getAll(searchTerm?: string) {
		let options = {};
		if (searchTerm) {
			options = {
				$or: [
					{
						name: new RegExp(searchTerm, 'i')
					},
					{
						slug: new RegExp(searchTerm, 'i')
					},
					{
						description: new RegExp(searchTerm, 'i')
					}
				]
			}
		}
		return this.genreModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc'
			})
			.exec()

	}

	/* Admin place */

	async getCollections() {
		const genres = await this.getAll()
		// const collections = await Promise.all(genres.map(async genre => {
		// 	const moviesByGenre = await this.movieService.byGenres([genre._id])
		// 	const result: ICollection = {
		// 		_id: String(genre._id),
		// 		image: moviesByGenre[0].bigPoster,
		// 		slug: genre.slug,
		// 		title: genre.name,
		// 	}
		// 	return result;
		// }))

		// return collections;
		const collections = genres
		return collections;
	}

	async byId(_id: string) {
		const genre = await this.genreModel.findById(_id);
		if (!genre) {
			throw new NotFoundException('Genre not found')
		}
		return genre
	}



	async update(_id: string, dto: CreateGenreDto) {
		const updatedDoc = await this.genreModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec();
		if (!updatedDoc) {
			throw new NotFoundException('Genre not found')

		}

		return updatedDoc;
	}

	async create() {
		const defaultValue: CreateGenreDto = {
			name: '',
			slug: '',
			description: '',
			icon: '',
		}
		const genre = await this.genreModel.create(defaultValue)
		return genre._id;
	}

	async delete(_id: string) {
		const deleteDoc = await this.genreModel.findByIdAndDelete(_id).exec()
		if (!deleteDoc) {
			throw new NotFoundException('Genre not found')
		}
		return deleteDoc;
	}

}