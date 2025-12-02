// region Imports
import { Recurso } from '../config/recursos';
import { tasksSch, ITask } from './tasksSch';
import { ProductServerBase } from '../../../api/productServerBase';
import { IContext } from '../../../typings/IContext';

// endregion

class TasksServerApi extends ProductServerBase<ITask> {
	constructor() {
		super('tasks', tasksSch, {
			resources: Recurso
		});

		// Add publication for recent tasks
		this.addPublication('tasks.recent', (filter = {}, options = {}) => {
			const defaultOptions = {
				sort: { updatedAt: -1 },
				limit: 5,
				projection: {
					title: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					status: 1,
					assignedTo: 1
				}
			};
			
			const finalOptions = { ...defaultOptions, ...options };
			
			return this.defaultListCollectionPublication(filter, finalOptions);
		});

		// Add publication for task detail
		this.addPublication('tasksDetail', (filter = {}) => {
			return this.defaultDetailCollectionPublication(filter, {
				projection: {
					title: 1,
					description: 1,
					createdAt: 1,
					updatedAt: 1,
					createdBy: 1,
					status: 1,
					assignedTo: 1
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
		return true;
	}

	async beforeUpdate(doc: Partial<ITask>, context: IContext) {
		await super.beforeUpdate(doc, context);
		doc.updatedAt = new Date();
		return true;
	}
}

export const tasksServerApi = new TasksServerApi();
