// region Imports
import { Meteor } from 'meteor/meteor';
import { Recurso } from '../config/recursos';
import { tasksSch, ITask } from './toDosSch';
import { ProductServerBase } from '../../../api/productServerBase';
import { IContext } from '../../../typings/IContext';

// endregion

class TasksServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('tasks', tasksSch, {
			resources: Recurso
		});

		const self = this;

		// Add publication for recent tasks
		this.addPublication('tasks.recent', function (this: any, filter = {}, options = {}) {
			const userId = this.userId;
			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId || null }]
			};
			const finalFilter = { $and: [filter, visibilityFilter] };
			const defaultOptions = {
				sort: { updatedAt: -1 },
				limit: 5,
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					status: 1,
					assignedTo: 1
				}
			};
			
			const finalOptions = { ...defaultOptions, ...options };

			return self.defaultListCollectionPublication(finalFilter, finalOptions);
		});

		// Add publication for task detail
		this.addPublication('tasksDetail', function (this: any, filter = {}) {
			const userId = this.userId;
			const visibilityFilter = {
				$or: [{ personal: { $ne: true } }, { createdBy: userId || null }]
			};
			const finalFilter = {
				// defaultDetailCollectionPublication requires _id at the root level
				_id: (filter as any)._id,
				...visibilityFilter
			};
			return self.defaultDetailCollectionPublication(finalFilter, {
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					status: 1,
					assignedTo: 1,
					personal: 1
				}
			});
		});
	}

	private resolveUserId(context: IContext): string {
		const user = context?.user as any;
		return user?._id || user?.id || user?.userId || 'Sistema';
	}

	async beforeInsert(doc: Partial<ITask>, context: IContext) {
		await super.beforeInsert(doc, context);
		const now = new Date();
		doc.createdAt = doc.createdAt || now;
		doc.updatedAt = now;
		doc.status = doc.status || 'pending';
		doc.createdBy = doc.createdBy || this.resolveUserId(context);
		doc.personal = doc.personal ?? false;
		return true;
	}

	async beforeUpdate(doc: Partial<ITask>, context: IContext) {
		await super.beforeUpdate(doc, context);
		const userId = this.resolveUserId(context);
		const existing = await this.getCollectionInstance().findOneAsync({ _id: doc._id });
		if (existing && existing.createdBy && existing.createdBy !== userId) {
			throw new Meteor.Error('not-authorized', 'Somente o criador pode alterar esta tarefa');
		}
		doc.updatedAt = new Date();
		return true;
	}

	async beforeRemove(doc: Partial<ITask>, context: IContext) {
		await super.beforeRemove(doc, context);
		const userId = this.resolveUserId(context);
		const existing = await this.getCollectionInstance().findOneAsync({ _id: doc._id });
		if (existing && existing.createdBy && existing.createdBy !== userId) {
			throw new Meteor.Error('not-authorized', 'Somente o criador pode remover esta tarefa');
		}
		return true;
	}
}

export const tasksServerApi = new TasksServerApi();
