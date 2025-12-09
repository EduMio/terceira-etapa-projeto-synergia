// File: imports/modules/toDos/pages/toDosList/toDosListController.tsx
import React, { useCallback, useMemo, useState, useContext } from 'react';
import TasksListView from './toDosListView';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { tasksApi } from '../../api/toDosApi';
import { ITask } from '../../api/toDosSch';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';

interface ITasksListContollerContext {
	tasks: ITask[];
	loading: boolean;
	actionLoadingId: string | null;
	selectedTask: ITask | null;
	isModalOpen: boolean;
	onAddTaskClick: () => void;
	onEditTask: (task: ITask) => void;
	onDeleteTask: (task: ITask) => void;
	onToggleStatus: (task: ITask) => void;
	onOpenTask: (task: ITask) => void;
	onCloseModal: () => void;
}

export const TasksListControllerContext = React.createContext<ITasksListContollerContext>(
	{} as ITasksListContollerContext
);

const TasksListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	
	const { loading, tasks } = useTracker(() => {
		const subHandle = tasksApi.subscribe('tasks.recent', {}, { sort: { updatedAt: -1 }, limit: 100 });
		
		const tasks = subHandle?.ready() ? tasksApi.find({}, { sort: { updatedAt: -1 } }).fetch() : [];
		return {
			tasks,
			loading: !!subHandle && !subHandle.ready()
		};
	}, []);
	
	const onAddTaskClick = useCallback(() => {
		navigate('/tasks/create');
	}, [navigate]);

	const onEditTask = useCallback((task: ITask) => {
		if (!task?._id) return;
		navigate(`/tasks/edit/${task._id}`);
	}, [navigate]);

	const onOpenTask = useCallback((task: ITask) => {
		setSelectedTask(task);
		setIsModalOpen(true);
	}, []);

	const onCloseModal = useCallback(() => {
		setIsModalOpen(false);
		setSelectedTask(null);
	}, []);

	const onToggleStatus = useCallback((task: ITask) => {
		if (!task?._id) return;
		const newStatus = task.status === 'completed' ? 'pending' : 'completed';
		setActionLoadingId(task._id);
		tasksApi.update({ _id: task._id, status: newStatus }, (e: IMeteorError, r: any) => {
			setActionLoadingId(null);
			if (e) {
				showNotification({
					type: 'error',
					title: 'Erro ao atualizar',
					message: e.reason || 'Falha ao atualizar a tarefa'
				});
				return;
			}
			showNotification({
				type: 'success',
				title: 'Tarefa atualizada',
				message: (r && (r.message || r.reason)) || 'Status atualizado com sucesso'
			});
		});
	}, [showNotification]);

	const onDeleteTask = useCallback((task: ITask) => {
		if (!task?._id) return;
		if (selectedTask?._id === task._id) {
			setIsModalOpen(false);
			setSelectedTask(null);
		}
		setActionLoadingId(task._id);
		tasksApi.remove({ _id: task._id }, (e: IMeteorError, r: any) => {
			setActionLoadingId(null);
			if (e) {
				showNotification({
					type: 'error',
					title: 'Erro ao excluir',
					message: e.reason || 'Falha ao excluir a tarefa'
				});
				return;
			}
			showNotification({
				type: 'success',
				title: 'Tarefa excluída',
				message: (r && (r.message || r.reason)) || 'Tarefa removida com sucesso'
			});
		});
	}, [showNotification, selectedTask]);
	
	const providerValues: ITasksListContollerContext = useMemo(
		() => ({
			tasks,
			loading,
			actionLoadingId,
			selectedTask,
			isModalOpen,
			onAddTaskClick,
			onEditTask,
			onDeleteTask,
			onToggleStatus,
			onOpenTask,
			onCloseModal
		}),
		[
			tasks,
			loading,
			actionLoadingId,
			selectedTask,
			isModalOpen,
			onAddTaskClick,
			onEditTask,
			onDeleteTask,
			onToggleStatus,
			onOpenTask,
			onCloseModal
		]
	);
	
	return (
		<TasksListControllerContext.Provider value={providerValues}>
			<TasksListView />
		</TasksListControllerContext.Provider>
	);
};

export default TasksListController;
