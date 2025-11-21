// File: imports/modules/tasks/pages/tasksList/tasksListController.tsx
import React, { useCallback, useMemo } from 'react';
import TasksListView from './tasksListView';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { tasksApi } from '../../api/tasksApi';
import { ITask } from '../../api/tasksSch';

interface ITasksListContollerContext {
	tasks: ITask[];
	loading: boolean;
	onGoToTasksClick: () => void;
}

export const TasksListControllerContext = React.createContext<ITasksListContollerContext>(
	{} as ITasksListContollerContext
);

const TasksListController = () => {
	const navigate = useNavigate();
	
	const { loading, tasks } = useTracker(() => {
		const subHandle = tasksApi.subscribe('tasks.recent');
		
		const tasks = subHandle?.ready() ? tasksApi.find({}, { sort: { updatedAt: -1 }, limit: 5 }).fetch() : [];
		return {
			tasks,
			loading: !!subHandle && !subHandle.ready()
		};
	}, []);
	
	const onGoToTasksClick = useCallback(() => {
		navigate('/tasks');
	}, []);
	
	const providerValues: ITasksListContollerContext = useMemo(
		() => ({
			tasks,
			loading,
			onGoToTasksClick
		}),
		[tasks, loading]
	);
	
	return (
		<TasksListControllerContext.Provider value={providerValues}>
			<TasksListView />
		</TasksListControllerContext.Provider>
	);
};

export default TasksListController;
