import React, { createContext, useCallback, useContext } from 'react';
import TasksDetailView from './tasksDetailView';
import { useNavigate } from 'react-router-dom';
import { TasksModuleContext } from '../../toDosContainer';
import { useTracker } from 'meteor/react-meteor-data';
import { tasksApi } from '../../api/toDosApi';
import { ITask } from '../../api/toDosSch';
import { ISchema } from '../../../../typings/ISchema';
import { IMeteorError } from '../../../../typings/BoilerplateDefaultTypings';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';

interface ITasksDetailContollerContext {
	closePage: () => void;
	document: ITask;
	loading: boolean;
	schema: ISchema<ITask>;
	onSubmit: (doc: ITask) => void;
	changeToEdit: (id: string) => void;
}

export const TasksDetailControllerContext = createContext<ITasksDetailContollerContext>(
	{} as ITasksDetailContollerContext
);

const TasksDetailController = () => {
	const navigate = useNavigate();
	const { id, state } = useContext(TasksModuleContext);
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const { document, loading } = useTracker(() => {
		const subHandle = !!id ? tasksApi.subscribe('tasksDetail', { _id: id }) : null;
		const document = id && subHandle?.ready() ? tasksApi.findOne({ _id: id }) : {};
		return {
			document: (document as ITask) ?? ({ _id: id } as ITask),
			loading: !!subHandle && !subHandle?.ready()
		};
	}, [id]);

	const closePage = useCallback(() => {
		navigate(-1);
	}, []);
	
	const changeToEdit = useCallback((id: string) => {
		navigate(`/tasks/edit/${id}`);
	}, []);

	const onSubmit = useCallback((doc: ITask) => {
		const selectedAction = state === 'create' ? 'insert' : 'update';
		tasksApi[selectedAction](doc, (e: IMeteorError, r: any) => {
			if (e) {
				showNotification({
					type: 'error',
					title: 'Operação não realizada!',
					message: e.reason || 'Erro ao realizar a operação'
				});
				return;
			}

			closePage();
			showNotification({
				type: 'success',
				title: 'Operação realizada!',
				message: (r && (r.message || r.reason)) || `A tarefa foi ${selectedAction === 'update' ? 'atualizada' : 'cadastrada'} com sucesso!`
			});
		});
	}, [state, closePage, showNotification]);

	return (
		<TasksDetailControllerContext.Provider
			value={{
				closePage,
				document: { ...document, _id: id },
				loading,
				schema: tasksApi.getSchema(),
				onSubmit,
				changeToEdit
			}}>
			<TasksDetailView />
		</TasksDetailControllerContext.Provider>
	);
};

export default TasksDetailController;
