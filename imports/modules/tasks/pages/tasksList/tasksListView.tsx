import React, { useContext } from 'react';
import { TasksListControllerContext } from './tasksListController';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'flex-start',
	width: '100%',
	maxWidth: '1200px',
	margin: '0 auto',
	padding: theme.spacing(4),
	marginTop: '56px',
}));

const WelcomeSection = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	width: '100%',
	marginBottom: theme.spacing(4),
	textAlign: 'center'
}));

const TaskSection = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	width: '100%',
	marginTop: theme.spacing(4),
}));

const TaskItem = styled(Box)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	padding: theme.spacing(2),
	marginBottom: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.paper,
	boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
	transition: 'background-color 0.2s',
	'&:hover': {
		backgroundColor: theme.palette.grey[50],
	},
}));

const TaskCheckbox = styled('div')(({ theme, completed }) => ({
	width: 24,
	height: 24,
	borderRadius: '50%',
	border: `2px solid ${theme.palette.grey[300]}`,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
	backgroundColor: completed ? theme.palette.success.main : theme.palette.common.white,
	'&:before': {
		content: completed ? '"✔"' : '""',
		color: completed ? theme.palette.common.white : 'transparent',
		fontSize: 16,
		fontWeight: 'bold',
	},
}));

const TaskInfo = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	flexGrow: 1,
	marginLeft: theme.spacing(1),
}));

const TaskTitle = styled(Typography)(({ theme }) => ({
	fontSize: 18,
	fontWeight: 'bold',
	color: theme.palette.text.primary,
}));

const TaskCreator = styled(Typography)(({ theme }) => ({
	fontSize: 14,
	color: theme.palette.text.secondary,
	marginTop: theme.spacing(0.5),
}));

const ActionsMenu = styled(Button)(({ theme }) => ({
	minWidth: 'auto',
	padding: theme.spacing(0.5),
	color: theme.palette.text.secondary,
	'&:hover': {
		backgroundColor: theme.palette.grey[100],
	},
}));

const TasksListView = () => {
	const controller = useContext(TasksListControllerContext);
	
	const handleGoToTasks = () => {
		controller.onGoToTasksClick();
	};
	
	return (
		<Container>
			<WelcomeSection>
				<Typography variant="h3" sx={{ color: '#333333', mb: 1 }}>Hello, Sandra Souza</Typography>
				<Typography variant="body1" sx={{ color: '#666666', lineHeight: 1.5, mb: 2 }}>
					Your projects much more organized. See the tasks added by your team, by you, and for you!
				</Typography>
			</WelcomeSection>
			
			<TaskSection>
				<Typography variant="h5" sx={{ color: '#444444', mb: 2 }}>Recently Added</Typography>
				
				{controller.loading ? (
					<Typography variant="body1">Loading tasks...</Typography>
				) : controller.tasks.length === 0 ? (
					<Typography variant="body1">No tasks found</Typography>
				) : (
					controller.tasks.map((task) => (
						<TaskItem key={task._id}>
							<TaskCheckbox completed={task.status === 'completed'} />
							<TaskInfo>
								<TaskTitle>{task.title}</TaskTitle>
								<TaskCreator>
									Created by: {task.createdBy === Meteor.userId() ? 'You' : task.createdBy}
								</TaskCreator>
							</TaskInfo>
							<ActionsMenu>
								<SysIcon name="moreVert" />
							</ActionsMenu>
						</TaskItem>
					))
				)}
			</TaskSection>
			
			<Box display="flex" justifyContent="center" mt={4} mb={4}>
				<Button
					variant="contained"
					sx={{
						width: 240,
						height: 52,
						borderRadius: 2,
						backgroundColor: '#E0E0E0',
						color: '#333333',
						fontWeight: 'bold',
						fontSize: 16,
						'&:hover': {
							backgroundColor: '#D0D0D0',
						},
					}}
					onClick={handleGoToTasks}
				>
					Go to Tasks
					<SysIcon name="arrowForward" sx={{ ml: 1 }} />
				</Button>
			</Box>
		</Container>
	);
};

export default TasksListView;
