import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieModel } from './movie.model';
import { Types } from 'mongoose'
import { GenreIdsDto } from './dto/genreIds.dto';
import { TelegramService } from 'src/telegram/telegram.service';

@Injectable()
export class MovieService {
	constructor(@InjectModel(MovieModel) private readonly movieModel: ModelType<MovieModel>,
		private readonly telegramService: TelegramService) { }



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


				]
			}
			// aggregation
		}
		return this.movieModel.find(options)
			.select('-updatedAt -__v')
			.sort({
				createdAt: 'desc'
			}).populate('actors genres')
			.exec()

	}


	async bySlug(slug: string) {
		const doc = this.movieModel.findOne({ slug }).populate('actors genres').exec()
		if (!doc) {
			throw new NotFoundException('Movies not found')
		}
		return doc;
	}

	async byActor(actorId: Types.ObjectId) {
		const docs = this.movieModel.findOne({ actors: actorId }).exec()
		if (!docs) {
			throw new NotFoundException('Movies not found')
		}
		return docs;
	}


	async byGenres(genreIds: Types.ObjectId[]) {
		const docs = await this.movieModel.find({ genres: { $in: genreIds } }).exec()
		if (!docs) {
			throw new NotFoundException('Movie not found')
		}
		return docs;
	}

	getMostPopular() {
		return this.movieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('genres').exec()
	}
	async updateCountOponed(slug: string) {
		const updatedDoc = await this.movieModel.findOneAndUpdate({ slug }, {
			$inc: { countOpened: 1 }
		}, {
			new: true
		}).exec();
		if (!updatedDoc) {
			throw new NotFoundException('Movies not found')

		}

		return updatedDoc;
	}

	async updateRating(id: Types.ObjectId, newRating: number) {
		return this.movieModel.findByIdAndUpdate(id, {
			rating: newRating,
		}, {
			new: true
		})
	}

	/* Admin place */



	async byId(_id: string) {
		const doc = await this.movieModel.findById(_id);
		if (!doc) {
			throw new NotFoundException('Movies not found')
		}
		return doc
	}





	async create() {
		const defaultValue = {
			bigPoster: '',
			actors: [],
			genres: [],
			description: '',
			poster: '',
			title: '',
			videoUrl: '',
			slug: ''

		}
		const movie = await this.movieModel.create(defaultValue)
		return movie._id;
	}

	async update(_id: string, dto: UpdateMovieDto) {

		if (!dto.isSendTelegram) {
			await this.sendNotification(dto)
			dto.isSendTelegram = true
		}
		const updatedDoc = await this.movieModel.findByIdAndUpdate(_id, dto, {
			new: true
		}).exec();
		if (!updatedDoc) {
			throw new NotFoundException('Movies not found')
		}

		return updatedDoc;
	}

	async delete(_id: string) {
		const deleteDoc = await this.movieModel.findByIdAndDelete(_id).exec()
		if (!deleteDoc) {
			throw new NotFoundException('Actor not found')
		}
		return deleteDoc;
	}

	async sendNotification(dto: UpdateMovieDto) {
		// if(process.env.NODE_ENV!=='development')
		// await this.telegramService.sendPhoto(dto.poster)
		await this.telegramService.sendPhoto('https://avatars.mds.yandex.net/i?id=540b739cdda7bafc2f2182227b6019ad-5877328-images-thumbs&n=13')

		const msg = `<b>${dto.title}</b>`

		await this.telegramService.sendMessage(msg, {
			reply_markup: {
				inline_keyboard: [
					[
						{
							url: 'https://okko.tv/movie/free-guy',
							text: 'Go to watch',
						}
					]
				]
			}
		})
	}


}


