// region Imports
import { Recurso } from '../config/recursos';
import { tasksSch, ITask } from './tasksSch';
import { ProductServerBase } from '../../../api/productServerBase';

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
}

export const tasksServerApi = new TasksServerApi();
