import {
	BeforeCreate,
	BeforeUpdate,
	Column,
	Model
} from 'sequelize-typescript';
import slugify from 'slugify';
import { SLUG_REGEX } from '../../constants';

export class BaseModel extends Model {
	@Column
	title!: string;

	@Column
	slug?: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: BaseModel) {
		instance.slug = slugify(
			instance.title,
			{
				lower: true,
				remove: SLUG_REGEX,
			}
		);
		console.log('Created slug', instance.slug);
	}
}
