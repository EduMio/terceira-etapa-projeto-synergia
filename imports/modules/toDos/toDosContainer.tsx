import React from 'react';
import { IDefaultContainerProps } from '../../typings/BoilerplateDefaultTypings';
import { useParams } from 'react-router-dom';
import TasksListController from './pages/toDosList/toDosListController';
import TasksDetailController from './pages/toDosDetail/tasksDetailController';

export interface ITasksModuleContext {
	state?: string;
	id?: string;
}

export const TasksModuleContext = React.createContext<ITasksModuleContext>({});

export default (props: IDefaultContainerProps) => {
	let { screenState, taskId } = useParams();
	const state = screenState ?? props.screenState;
	const id = taskId ?? props.id;

	const validState = ['view', 'edit', 'create'];

	const renderPage = () => {
		if (!state || !validState.includes(state)) return <TasksListController />;
		return <TasksDetailController />;
	};

	const providerValue = {
		state,
		id
	};
	return <TasksModuleContext.Provider value={providerValue}>{renderPage()}</TasksModuleContext.Provider>;
};
