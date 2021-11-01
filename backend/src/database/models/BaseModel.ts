import {
	BeforeCreate,
	BeforeUpdate,
	Column,
	Model,
} from 'sequelize-typescript';
import slugify from 'slugify';

export class BaseModel extends Model {
	@Column
	title!: string;

	@Column
	slug?: string;

	@BeforeCreate
	@BeforeUpdate
	static createSlug(instance: BaseModel) {
		instance.slug = slugify(instance.title, {
			lower: true,
			remove: /[*+~.()'"!:@]/g,
		});
	}
}
