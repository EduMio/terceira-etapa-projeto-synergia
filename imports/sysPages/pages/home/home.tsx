// File: imports/sysPages/pages/home/home.tsx
import React, { useMemo, useRef } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import { styled } from '@mui/material/styles';
import { tasksApi } from '/imports/modules/tasks/api/tasksApi';
import { ITask } from '/imports/modules/tasks/api/tasksSch';
import SysMenu, { ISysMenuItem, ISysMenuRef } from '/imports/ui/components/sysMenu/sysMenuProvider';

// Styled components for the home page
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
  textAlign: 'left'
}));

const TaskSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginTop: theme.spacing(4),
}));

const TaskSectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginBottom: theme.spacing(2)
}));

const TaskItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.5, 0),
  marginBottom: theme.spacing(0.5),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

const TaskCheckbox = styled('div', {
  shouldForwardProp: (prop) => prop !== 'completed'
})<{ completed: boolean }>(({ theme, completed }) => ({
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

const TaskMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
  marginTop: theme.spacing(0.5),
}));

const ActionsButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: theme.spacing(0.5),
  marginLeft: theme.spacing(1),
  color: '#666666',
  '&:hover': {
    backgroundColor: '#F0F0F0',
  },
}));

const FooterSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
  gap: theme.spacing(2),
}));

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const PaginationButton = styled(Button)(({ theme }) => ({
  minWidth: 0,
  width: 36,
  height: 36,
  borderRadius: 18,
  padding: 0,
  backgroundColor: '#333333',
  color: '#B0B0B0',
  '&:hover': {
    backgroundColor: '#000000',
  },
}));

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const menuRef = useRef<ISysMenuRef>(null);
  const [selectedTask, setSelectedTask] = React.useState<ITask | null>(null);
  
  const currentUser = useTracker(() => {
    return Meteor.user();
  }, []);
  
  const username = currentUser?.profile?.name || currentUser?.username || currentUser?.emails?.[0]?.address || 'Usuário';
  const firstName = username?.split(' ')?.[0] || username;

  const { loading, recentTasks } = useTracker<{ loading: boolean; recentTasks: ITask[] }>(() => {
    const userId = Meteor.userId();
    const userFilter = userId
      ? { $or: [{ createdBy: userId }, { assignedTo: userId }] }
      : { _id: null };

    const subHandle = tasksApi.subscribe('tasks.recent', userFilter);
    const isReady = !!subHandle && subHandle.ready();
    return {
      loading: !isReady,
      recentTasks: isReady ? tasksApi.find(userFilter, { sort: { updatedAt: -1 }, limit: 5 }).fetch() : []
    };
  }, []);
  
  const handleGoToTasks = () => {
    navigate('/tasks');
  };

  const handleAddTask = () => {
    navigate('/tasks/create');
  };

  const taskMenuOptions: ISysMenuItem[] = useMemo(() => [
    {
      key: 'edit',
      onClick: () => selectedTask && navigate(`/tasks/edit/${selectedTask._id}`),
      otherProps: { children: 'Editar' }
    },
    {
      key: 'delete',
      onClick: () => selectedTask && console.log('Delete task', selectedTask._id),
      otherProps: { children: 'Excluir' }
    },
    {
      key: 'share',
      onClick: () => selectedTask && console.log('Share task', selectedTask._id),
      otherProps: { children: 'Compartilhar' }
    }
  ], [navigate, selectedTask]);

  const handleOpenTaskMenu = (event: React.MouseEvent<HTMLElement>, task: ITask) => {
    setSelectedTask(task);
    menuRef.current?.openMenu(event);
  };
  
  return (
    <Container>
      <WelcomeSection>
        <Typography variant="h3" sx={{ color: '#333333', mb: 1, fontWeight: 'bold', fontSize: 32 }}>Olá, {firstName}</Typography>
        <Typography variant="body1" sx={{ color: '#666666', lineHeight: 1.5, mb: 2, fontSize: 16 }}>
          Seus projetos muito mais organizados. Veja as tarefas adicionadas pela sua equipe, por você e para você!
        </Typography>
      </WelcomeSection>
      
      <TaskSection>
        <TaskSectionHeader>
          <Typography variant="h5" sx={{ color: '#444444', fontSize: 20, fontWeight: 600 }}>Atividades recentes</Typography>
        </TaskSectionHeader>
        
        {loading ? (
          <Typography variant="body1">Loading tasks...</Typography>
        ) : recentTasks.length === 0 ? (
          <Typography variant="body1">No tasks found</Typography>
        ) : (
          recentTasks.map((task) => (
            <TaskItem key={task._id}>
              <TaskCheckbox
                completed={task.status === 'completed'}
                aria-label={`Checkbox para tarefa ${task.title}`}
              />
              <TaskInfo>
                <TaskTitle>{task.title}</TaskTitle>
                <TaskMeta>
                  <TaskCreator
                    component="span"
                    sx={{
                      color: task.createdBy === Meteor.userId() ? '#333333' : '#888888'
                    }}
                  >
                    Criada por: {task.createdBy === Meteor.userId() ? 'Você' : (task.createdBy || 'N/A')}
                  </TaskCreator>
                </TaskMeta>
              </TaskInfo>
              <ActionsButton
                aria-label="Menu de ações"
                onClick={(event) => handleOpenTaskMenu(event, task)}
              >
                <SysIcon name="moreVert" />
              </ActionsButton>
            </TaskItem>
          ))
        )}
      </TaskSection>
      
      <FooterSection>
        <Button
          variant="contained"
          sx={{
            width: 240,
            height: 52,
            borderRadius: 8,
            backgroundColor: '#E0E0E0',
            color: '#333333',
            fontWeight: 'bold',
            fontSize: 16,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#D0D0D0',
            },
            '&:active': {
              backgroundColor: '#C0C0C0',
            },
          }}
          onClick={handleGoToTasks}
        >
          Minhas Tarefas
          <SysIcon name="doubleArrow" sx={{ ml: 1 }} />
        </Button>

        <PaginationContainer aria-label="Paginação de atividades recentes">
          <PaginationButton aria-label="Página anterior">
            {'<'}
          </PaginationButton>
          <PaginationButton aria-label="Próxima página">
            {'>'}
          </PaginationButton>
        </PaginationContainer>
      </FooterSection>

      <SysMenu
        ref={menuRef}
        options={taskMenuOptions}
        MenuListProps={{ 'aria-label': 'Opções da tarefa selecionada' }}
      />
    </Container>
  );
};

export default HomePage;
