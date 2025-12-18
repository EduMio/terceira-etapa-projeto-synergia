import React, { useContext, useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { ITask } from '../../api/toDosSch';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { TasksListControllerContext } from './toDosListController';

const Container = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	justifyContent: 'flex-start',
	width: '100%',
	maxWidth: '1200px',
	margin: '0 auto',
	padding: theme.spacing(6),
	marginTop: '56px',
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'flex-start',
	justifyContent: 'center',
	width: '100%',
	marginBottom: theme.spacing(4),
	textAlign: 'left',
	gap: theme.spacing(1)
}));

const ListContainer = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
	border: `1px solid ${theme.palette.divider}`,
	width: '100%'
}));

const HeaderRow = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: theme.spacing(2),
	marginBottom: theme.spacing(2),
	flexWrap: 'wrap'
}));

const PaginationRow = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: theme.spacing(1.5),
	padding: theme.spacing(2),
	borderTop: `1px solid ${theme.palette.divider}`
}));

const LoadingOverlay = styled(Box)(({ theme }) => ({
	position: 'absolute',
	inset: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: theme.palette.background.paper,
	opacity: 0.8,
	zIndex: 1
}));

const TasksListView = () => {
	const controller = useContext(TasksListControllerContext);
	const currentUser = useTracker(() => Meteor.user(), []);
	const username = currentUser?.profile?.name || currentUser?.username || currentUser?.emails?.[0]?.address || 'Usuário';
	const firstName = username?.split(' ')?.[0] || username;
	const PAGE_SIZE = 4;
	const navigate = useNavigate();
	const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
	const [menuTask, setMenuTask] = useState<ITask | null>(null);

	const renderSecondaryText = (task?: ITask) => {
		const createdByLabel =
			task?.createdBy === Meteor.userId()
				? 'Você'
				: task?.createdByName || task?.createdBy || 'N/A';
		return `Criada por: ${createdByLabel}`;
	};

	const openActionsMenu = (event: React.MouseEvent<HTMLElement>, task: ITask) => {
		event.stopPropagation();
		setMenuAnchor(event.currentTarget);
		setMenuTask(task);
	};

	const closeActionsMenu = () => {
		setMenuAnchor(null);
		setMenuTask(null);
	};

	const renderStatusChip = (status: string) => (
		<Chip
			size="small"
			label={status === 'completed' ? 'Concluída' : 'Não concluída'}
			color={status === 'completed' ? 'success' : 'default'}
			variant={status === 'completed' ? 'filled' : 'outlined'}
		/>
	);

	const renderTaskList = (
		title: string,
		tasks: ITask[],
		loading: boolean,
		loadingPage: boolean,
		currentPage: number,
		total: number,
		onPageChange: (page: number) => void,
		emptyMessage: string
	) => {
		const totalPages = Math.max(1, Math.ceil((total || 0) / PAGE_SIZE));

		return (
			<Box mb={4}>
				<Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
					<Typography variant="h6" sx={{ color: '#444444', fontWeight: 700 }}>
						{title}
					</Typography>
					<Chip size="small" label={`${total || 0} ${total === 1 ? 'tarefa' : 'tarefas'}`} />
				</Stack>

				<ListContainer>
					<Box position="relative">
						{loadingPage && tasks.length > 0 && (
							<LoadingOverlay>
								<Stack direction="row" spacing={1} alignItems="center">
									<CircularProgress size={22} />
									<Typography variant="body2">Carregando...</Typography>
								</Stack>
							</LoadingOverlay>
						)}

						{loading && tasks.length === 0 ? (
							<Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
								<CircularProgress size={24} />
								<Typography variant="body1">Carregando tarefas...</Typography>
							</Box>
						) : tasks.length === 0 ? (
							<Box display="flex" alignItems="center" justifyContent="center" py={4}>
								<Typography variant="body1">{emptyMessage}</Typography>
							</Box>
						) : (
							<List disablePadding>
								{tasks.map((task, idx) => (
									<React.Fragment key={task._id || idx}>
										<ListItem
											sx={{ px: 1.5 }}
											secondaryAction={
												<Stack direction="row" spacing={1} alignItems="center">
													{task.createdBy === Meteor.userId() && (
														<IconButton
															edge="end"
															aria-label="Ações da tarefa"
															onClick={(e) => openActionsMenu(e, task)}
															size="small"
															disabled={controller.actionLoadingId === task._id}
														>
															<MoreVertIcon fontSize="small" />
														</IconButton>
													)}
												</Stack>
											}
											disablePadding
											alignItems="flex-start"
										>
											<ListItemIcon sx={{ minWidth: 56, justifyContent: 'center' }}>
												<Checkbox
													edge="start"
													checked={task.status === 'completed'}
													icon={<RadioButtonUncheckedIcon />}
													checkedIcon={<CheckCircleIcon />}
													sx={{
														p: 0.5,
														'& .MuiSvgIcon-root': { fontSize: 26 }
													}}
													onClick={(e) => {
														e.stopPropagation();
														controller.onToggleStatus(task);
													}}
													disabled={controller.actionLoadingId === task._id}
													inputProps={{ 'aria-label': `Marcar tarefa ${task.description || task.title} como concluída` }}
												/>
											</ListItemIcon>
											<ListItemButton onClick={() => controller.onOpenTask(task)} sx={{ py: 1.5 }}>
												<ListItemText
													primary={
														<Typography
															variant="subtitle1"
															sx={{
																fontWeight: 600,
																color: task.status === 'completed' ? 'text.secondary' : 'text.primary',
																textDecoration: task.status === 'completed' ? 'line-through' : 'none'
															}}
														>
															{task.title || 'Sem título'}
														</Typography>
													}
													secondary={
														<Stack spacing={0.5}>
															<Typography variant="body2" color="text.secondary">
																{renderSecondaryText(task)}
															</Typography>
															{task.description && (
																<Typography variant="body2" color="text.secondary">
																	{task.description}
																</Typography>
															)}
														</Stack>
													}
												/>
											</ListItemButton>
										</ListItem>
										{idx < tasks.length - 1 && <Divider component="li" />}
									</React.Fragment>
								))}
							</List>
						)}
					</Box>
				</ListContainer>

				<PaginationRow>
					<Button
						variant="outlined"
						size="small"
						startIcon={<SysIcon name="chevronLeft" />}
						disabled={currentPage === 1 || loadingPage}
						onClick={() => onPageChange(Math.max(1, currentPage - 1))}
					>
						Anterior
					</Button>
					<Typography variant="body2">
						Página {currentPage} de {totalPages}
					</Typography>
					<Button
						variant="outlined"
						size="small"
						endIcon={<SysIcon name="chevronRight" />}
						disabled={loadingPage || currentPage >= totalPages}
						onClick={() => onPageChange(currentPage + 1)}
					>
						Próxima
					</Button>
				</PaginationRow>
			</Box>
		);
	};
	
	return (
		<Container>
			<WelcomeSection>
				<Typography variant="h3" sx={{ color: '#333333', mb: 1, fontWeight: 'bold', fontSize: 32 }}>
					Olá, {firstName}
				</Typography>
				<Typography variant="body1" sx={{ color: '#666666', lineHeight: 1.5, mb: 2, fontSize: 16 }}>
					Organize e acompanhe suas tarefas. Marque como concluídas, edite, exclua ou visualize rapidamente.
				</Typography>
				<Button
					variant="contained"
					startIcon={<SysIcon name="add" />}
					onClick={controller.onAddTaskClick}
					sx={{
						textTransform: 'none',
						fontWeight: 600,
						backgroundColor: '#E0E0E0',
						color: '#333333',
						boxShadow: 'none',
						'&:hover': {
							backgroundColor: '#D0D0D0',
							boxShadow: 'none',
						},
						'&:active': {
							backgroundColor: '#C0C0C0',
						},
					}}
				>
					Adicionar tarefa
				</Button>
			</WelcomeSection>

			<HeaderRow>
				<Stack direction="row" spacing={1.5} alignItems="center">
					<Button
						variant="outlined"
						size="small"
						startIcon={<SysIcon name="chevronLeft" />}
						onClick={() => navigate('/')}
						sx={{ textTransform: 'none' }}
					>
						Voltar
					</Button>
					<Typography variant="h5" sx={{ color: '#444444', fontSize: 20, fontWeight: 600 }}>
						ToDo List
					</Typography>
				</Stack>
				<TextField
					placeholder="Buscar na descrição"
					value={controller.searchTerm}
					onChange={(e) => controller.onSearchChange(e.target.value)}
					size="small"
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SysIcon name="search" fontSize="small" />
							</InputAdornment>
						)
					}}
					sx={{
						minWidth: 240,
						maxWidth: 360,
						flex: '1 1 240px',
						backgroundColor: '#fafafa'
					}}
				/>
			</HeaderRow>

			{renderTaskList(
				'Tarefas pendentes',
				controller.pendingTasks,
				controller.loadingPending,
				controller.loadingPendingPage,
				controller.pendingPage,
				controller.pendingTotal,
				controller.onPendingPageChange,
				'Nenhuma tarefa pendente'
			)}

			{renderTaskList(
				'Tarefas concluídas',
				controller.completedTasks,
				controller.loadingCompleted,
				controller.loadingCompletedPage,
				controller.completedPage,
				controller.completedTotal,
				controller.onCompletedPageChange,
				'Nenhuma tarefa concluída'
			)}

			<Menu
				anchorEl={menuAnchor}
				open={!!menuAnchor}
				onClose={closeActionsMenu}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<MenuItem
					onClick={() => {
						if (menuTask) controller.onEditTask(menuTask);
						closeActionsMenu();
					}}
				>
					Editar
				</MenuItem>
				<MenuItem
					onClick={() => {
						if (menuTask) controller.onDeleteTask(menuTask);
						closeActionsMenu();
					}}
					disabled={controller.actionLoadingId === menuTask?._id}
				>
					Excluir
				</MenuItem>
			</Menu>

			<Dialog
				open={controller.isModalOpen && !!controller.selectedTask}
				onClose={controller.onCloseModal}
				maxWidth="xs"
				fullWidth={false}
				PaperProps={{
					sx: { width: '100%', maxWidth: 440, borderRadius: 3 }
				}}
			>
				<DialogTitle>Detalhes da tarefa</DialogTitle>
				<DialogContent dividers>
					<Typography variant="h6" gutterBottom>
						{controller.selectedTask?.title}
					</Typography>
					<Typography variant="body1" gutterBottom>
						{controller.selectedTask?.description}
					</Typography>
					<Stack direction="row" spacing={1} alignItems="center" mb={2}>
						{controller.selectedTask && renderStatusChip(controller.selectedTask.status)}
					</Stack>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						{renderSecondaryText(controller.selectedTask)}
					</Typography>
					{controller.selectedTask?.assignedTo && (
						<Typography variant="body2" color="text.secondary">
							Atribuída para: {controller.selectedTask.assignedTo}
						</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={controller.onCloseModal}>Fechar</Button>
					{controller.selectedTask?.createdBy === Meteor.userId() && (
						<Button
							startIcon={<SysIcon name="edit" />}
							onClick={() => controller.selectedTask && controller.onEditTask(controller.selectedTask)}
						>
							Editar
						</Button>
					)}
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default TasksListView;
