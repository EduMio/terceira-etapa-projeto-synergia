// File: imports/modules/toDos/pages/toDosList/toDosListController.tsx
import React, { useCallback, useMemo, useState, useContext, useEffect } from 'react';
import TasksListView from './toDosListView';
import { useNavigate } from 'react-router-dom';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { tasksApi } from '../../api/toDosApi';
import { ITask } from '../../api/toDosSch';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { IMeteorError } from '../../../../typings/IMeteorError';

interface ITasksListContollerContext {
	pendingTasks: ITask[];
	completedTasks: ITask[];
	loadingPending: boolean;
	loadingCompleted: boolean;
	loadingPendingPage: boolean;
	loadingCompletedPage: boolean;
	actionLoadingId: string | null;
	selectedTask: ITask | null;
	isModalOpen: boolean;
	searchTerm: string;
	pendingPage: number;
	completedPage: number;
	pendingTotal: number;
	completedTotal: number;
	onAddTaskClick: () => void;
	onEditTask: (task: ITask) => void;
	onDeleteTask: (task: ITask) => void;
	onToggleStatus: (task: ITask) => void;
	onOpenTask: (task: ITask) => void;
	onCloseModal: () => void;
	onSearchChange: (value: string) => void;
	onPendingPageChange: (page: number) => void;
	onCompletedPageChange: (page: number) => void;
}

export const TasksListControllerContext = React.createContext<ITasksListContollerContext>(
	{} as ITasksListContollerContext
);

const TasksListController = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);

	const PAGE_SIZE = 4;
	const [visiblePendingTasks, setVisiblePendingTasks] = useState<ITask[]>([]);
	const [visibleCompletedTasks, setVisibleCompletedTasks] = useState<ITask[]>([]);
	const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
	const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [pendingPage, setPendingPage] = useState(1);
	const [completedPage, setCompletedPage] = useState(1);
	
	const { loading: loadingPending, tasks: pendingTasks, total: pendingTotal } = useTracker(() => {
		const normalizedSearch = searchTerm.trim();
		const filter = normalizedSearch
			? { description: { $regex: normalizedSearch, $options: 'i' }, status: 'pending' }
			: { status: 'pending' };
		const skip = (pendingPage - 1) * PAGE_SIZE;

		const subHandle = tasksApi.subscribe('tasks.pending', filter, { sort: { updatedAt: -1 }, limit: PAGE_SIZE, skip });
		const isReady = !!subHandle && subHandle.ready();
		const tasks = isReady ? tasksApi.find(filter, { sort: { updatedAt: -1 } }).fetch() : [];
		const countDoc = tasksApi.counts.findOne({ _id: 'tasks.pendingTotal' });
		return {
			tasks,
			loading: !isReady,
			total: countDoc?.count ?? 0
		};
	}, [searchTerm, pendingPage]);

	const { loading: loadingCompleted, tasks: completedTasks, total: completedTotal } = useTracker(() => {
		const normalizedSearch = searchTerm.trim();
		const filter = normalizedSearch
			? { description: { $regex: normalizedSearch, $options: 'i' }, status: 'completed' }
			: { status: 'completed' };
		const skip = (completedPage - 1) * PAGE_SIZE;

		const subHandle = tasksApi.subscribe('tasks.completed', filter, { sort: { updatedAt: -1 }, limit: PAGE_SIZE, skip });
		const isReady = !!subHandle && subHandle.ready();
		const tasks = isReady ? tasksApi.find(filter, { sort: { updatedAt: -1 } }).fetch() : [];
		const countDoc = tasksApi.counts.findOne({ _id: 'tasks.completedTotal' });
		return {
			tasks,
			loading: !isReady,
			total: countDoc?.count ?? 0
		};
	}, [searchTerm, completedPage]);

	useEffect(() => {
		if (!loadingPending) {
			setVisiblePendingTasks(pendingTasks);
		}
	}, [loadingPending, pendingTasks]);

	useEffect(() => {
		if (!loadingCompleted) {
			setVisibleCompletedTasks(completedTasks);
		}
	}, [loadingCompleted, completedTasks]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil((pendingTotal || 0) / PAGE_SIZE));
		if (pendingPage > totalPages) {
			setPendingPage(totalPages);
		}
	}, [pendingTotal, pendingPage]);

	useEffect(() => {
		const totalPages = Math.max(1, Math.ceil((completedTotal || 0) / PAGE_SIZE));
		if (completedPage > totalPages) {
			setCompletedPage(totalPages);
		}
	}, [completedTotal, completedPage]);
	
	const onAddTaskClick = useCallback(() => {
		navigate('/tasks/create');
	}, [navigate]);

	const onEditTask = useCallback((task: ITask) => {
		if (!task?._id) return;
		if (task.createdBy && task.createdBy !== Meteor.userId()) {
			showNotification({
				type: 'error',
				title: 'Permissão negada',
				message: 'Somente o criador pode editar esta tarefa.'
			});
			return;
		}
		navigate(`/tasks/edit/${task._id}`);
	}, [navigate, showNotification]);

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
		tasksApi.update({ _id: task._id, status: newStatus, title: task.title, description: task.description }, (e: IMeteorError, r: any) => {
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
		if (task.createdBy && task.createdBy !== Meteor.userId()) {
			showNotification({
				type: 'error',
				title: 'Permissão negada',
				message: 'Somente o criador pode remover esta tarefa.'
			});
			return;
		}
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

	const onSearchChange = useCallback((value: string) => {
		setSearchTerm(value);
		setPendingPage(1);
		setCompletedPage(1);
	}, []);

	const onPendingPageChange = useCallback((page: number) => {
		setPendingPage(page);
	}, []);

	const onCompletedPageChange = useCallback((page: number) => {
		setCompletedPage(page);
	}, []);
	
	const providerValues: ITasksListContollerContext = useMemo(
		() => ({
			pendingTasks: visiblePendingTasks,
			completedTasks: visibleCompletedTasks,
			loadingPending: loadingPending && visiblePendingTasks.length === 0,
			loadingCompleted: loadingCompleted && visibleCompletedTasks.length === 0,
			loadingPendingPage: loadingPending,
			loadingCompletedPage: loadingCompleted,
			actionLoadingId,
			selectedTask,
			isModalOpen,
			searchTerm,
			pendingPage,
			completedPage,
			pendingTotal,
			completedTotal,
			onAddTaskClick,
			onEditTask,
			onDeleteTask,
			onToggleStatus,
			onOpenTask,
			onCloseModal,
			onSearchChange,
			onPendingPageChange,
			onCompletedPageChange
		}),
		[
			visiblePendingTasks,
			visibleCompletedTasks,
			loadingPending,
			loadingCompleted,
			actionLoadingId,
			selectedTask,
			isModalOpen,
			searchTerm,
			pendingPage,
			completedPage,
			pendingTotal,
			completedTotal,
			onAddTaskClick,
			onEditTask,
			onDeleteTask,
			onToggleStatus,
			onOpenTask,
			onCloseModal,
			onSearchChange,
			onPendingPageChange,
			onCompletedPageChange
		]
	);
	
	return (
		<TasksListControllerContext.Provider value={providerValues}>
			<TasksListView />
		</TasksListControllerContext.Provider>
	);
};

export default TasksListController;
