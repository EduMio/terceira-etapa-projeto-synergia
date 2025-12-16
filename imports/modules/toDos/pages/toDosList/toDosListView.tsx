import React, { useContext } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
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
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { styled } from '@mui/material/styles';
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

const TasksListView = () => {
	const controller = useContext(TasksListControllerContext);
	const currentUser = useTracker(() => Meteor.user(), []);
	const username = currentUser?.profile?.name || currentUser?.username || currentUser?.emails?.[0]?.address || 'Usuário';
	const firstName = username?.split(' ')?.[0] || username;

	const renderSecondaryText = (taskCreatedBy?: string) =>
		`Criada por: ${taskCreatedBy === Meteor.userId() ? 'Você' : (username || 'N/A')}`;

	const renderStatusChip = (status: string) => (
		<Chip
			size="small"
			label={status === 'completed' ? 'Concluída' : 'Não concluída'}
			color={status === 'completed' ? 'success' : 'default'}
			variant={status === 'completed' ? 'filled' : 'outlined'}
		/>
	);
	
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
				<Typography variant="h5" sx={{ color: '#444444', fontSize: 20, fontWeight: 600 }}>
					ToDo List
				</Typography>
			</HeaderRow>

			<ListContainer>
				{controller.loading ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
						<CircularProgress size={24} />
						<Typography variant="body1">Carregando tarefas...</Typography>
					</Box>
				) : controller.tasks.length === 0 ? (
					<Box display="flex" alignItems="center" justifyContent="center" py={4}>
						<Typography variant="body1">Tarefas não encontradas</Typography>
					</Box>
				) : (
					<List disablePadding>
						{controller.tasks.map((task, idx) => (
							<React.Fragment key={task._id || idx}>
								<ListItem
									secondaryAction={
										<Stack direction="row" spacing={1} alignItems="center">
											{renderStatusChip(task.status)}
											{task.createdBy === Meteor.userId() && (
												<>
													<IconButton
														edge="end"
														aria-label="Editar tarefa"
														onClick={(e) => {
															e.stopPropagation();
															controller.onEditTask(task);
														}}
														size="small"
													>
														<SysIcon name="edit" fontSize="small" />
													</IconButton>
													<IconButton
														edge="end"
														aria-label="Excluir tarefa"
														onClick={(e) => {
															e.stopPropagation();
															controller.onDeleteTask(task);
														}}
														size="small"
														disabled={controller.actionLoadingId === task._id}
													>
														<SysIcon name="delete" fontSize="small" />
													</IconButton>
												</>
											)}
										</Stack>
									}
									disablePadding
									alignItems="flex-start"
								>
									<ListItemIcon sx={{ minWidth: 48 }}>
										<Checkbox
											edge="start"
											checked={task.status === 'completed'}
											onClick={(e) => {
												e.stopPropagation();
												controller.onToggleStatus(task);
											}}
											disabled={controller.actionLoadingId === task._id}
											inputProps={{ 'aria-label': `Marcar tarefa ${task.description || task.title} como concluída` }}
										/>
									</ListItemIcon>
									<ListItemButton onClick={() => controller.onOpenTask(task)} sx={{ py: 1.5 }}>
										<Avatar sx={{ bgcolor: '#E0E0E0', color: '#333333', mr: 2 }}>
											<SysIcon name="assignmentTurnedIn" />
										</Avatar>
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
														{renderSecondaryText(task.createdBy)}
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
								{idx < controller.tasks.length - 1 && <Divider component="li" />}
							</React.Fragment>
						))}
					</List>
				)}
			</ListContainer>

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
						{renderSecondaryText(controller.selectedTask?.createdBy)}
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
