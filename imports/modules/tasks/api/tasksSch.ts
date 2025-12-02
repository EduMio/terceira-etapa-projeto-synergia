import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export const tasksSch: ISchema<ITask> = {
	title: {
		type: String,
		label: 'Título',
		defaultValue: '',
		optional: false
	},
	description: {
		type: String,
		label: 'Descrição',
		defaultValue: '',
		optional: true
	},
	createdAt: {
		type: Date,
		label: 'Criado em',
		defaultValue: new Date(),
		optional: true
	},
	updatedAt: {
		type: Date,
		label: 'Atualizado em',
		defaultValue: new Date(),
		optional: true
	},
	createdBy: {
		type: String,
		label: 'Criado por',
		defaultValue: '',
		optional: true
	},
	status: {
		type: String,
		label: 'Status',
		defaultValue: 'pending',
		optional: false,
		options: () => [
			{ value: 'pending', label: 'Pendente' },
			{ value: 'completed', label: 'Concluído' }
		]
	},
	assignedTo: {
		type: String,
		label: 'Atribuído para',
		defaultValue: '',
		optional: true
	}
};

export interface ITask extends IDoc {
	title: string;
	description?: string;
	createdAt?: Date;
	updatedAt?: Date;
	createdBy?: string;
	status: 'pending' | 'completed';
	assignedTo?: string;
}
