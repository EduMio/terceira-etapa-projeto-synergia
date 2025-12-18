// File: imports/sysPages/pages/home/home.tsx
import React, { useCallback, useContext, useState } from 'react';
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
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AppLayoutContext, { IAppLayoutContext } from '/imports/app/appLayoutProvider/appLayoutContext';
import { styled } from '@mui/material/styles';
import { tasksApi } from '/imports/modules/toDos/api/toDosApi';
import { ITask } from '/imports/modules/toDos/api/toDosSch';

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

const ListContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  border: `1px solid ${theme.palette.divider}`,
  width: '100%'
}));

const HeaderRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(2)
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
  const { showNotification } = useContext<IAppLayoutContext>(AppLayoutContext);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTask, setMenuTask] = useState<ITask | null>(null);
  
  const currentUser = useTracker(() => Meteor.user(), []);
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

  const renderSecondaryText = (taskCreatedBy?: string) =>
    `Criada por: ${taskCreatedBy === Meteor.userId() ? 'Você' : (taskCreatedBy || 'N/A')}`;

  const handleOpenTask = (task: ITask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleEditTask = useCallback((task: ITask) => {
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

  const handleDeleteTask = useCallback((task: ITask) => {
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
    tasksApi.remove({ _id: task._id }, (e) => {
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
        message: 'Tarefa removida com sucesso'
      });
    });
  }, [selectedTask, showNotification]);

  const handleToggleStatus = useCallback((task: ITask) => {
    if (!task?._id) return;
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    setActionLoadingId(task._id);
    tasksApi.update({ _id: task._id, status: newStatus, title: task.title, description: task.description }, (e) => {
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
        message: 'Status atualizado com sucesso'
      });
    });
  }, [showNotification]);

  const openActionsMenu = (event: React.MouseEvent<HTMLElement>, task: ITask) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setMenuTask(task);
  };

  const closeActionsMenu = () => {
    setMenuAnchor(null);
    setMenuTask(null);
  };
  
  return (
    <Container>
      <WelcomeSection>
        <Typography variant="h3" sx={{ color: '#333333', mb: 1, fontWeight: 'bold', fontSize: 32 }}>Olá, {firstName}</Typography>
        <Typography variant="body1" sx={{ color: '#666666', lineHeight: 1.5, mb: 2, fontSize: 16 }}>
          Seus projetos muito mais organizados. Veja as tarefas adicionadas pela sua equipe, por você e para você!
        </Typography>
      </WelcomeSection>
      
      <HeaderRow>
        <Typography variant="h5" sx={{ color: '#444444', fontSize: 20, fontWeight: 600 }}>Atividades recentes</Typography>
      </HeaderRow>

      <ListContainer>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={4} gap={2}>
            <CircularProgress size={24} />
            <Typography variant="body1">Carregando tarefas...</Typography>
          </Box>
        ) : recentTasks.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" py={4}>
            <Typography variant="body1">Tarefas não encontradas</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {recentTasks.map((task, idx) => {
              const isCompleted = task.status === 'completed';
              return (
                <React.Fragment key={task._id || idx}>
                  <ListItem
                    sx={{ px: 1.5 }}
                    secondaryAction={
                      task.createdBy === Meteor.userId() && (
                        <IconButton
                          edge="end"
                          aria-label="Ações da tarefa"
                          onClick={(e) => openActionsMenu(e, task)}
                          size="small"
                          disabled={actionLoadingId === task._id}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      )
                    }
                    disablePadding
                    alignItems="flex-start"
                  >
                    <ListItemIcon sx={{ minWidth: 56, justifyContent: 'center' }}>
                      <Checkbox
                        edge="start"
                        checked={isCompleted}
                        icon={<RadioButtonUncheckedIcon />}
                        checkedIcon={<CheckCircleIcon />}
                        sx={{
                          p: 0.5,
                          '& .MuiSvgIcon-root': { fontSize: 26 }
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(task);
                        }}
                        disabled={actionLoadingId === task._id}
                        inputProps={{ 'aria-label': `Marcar tarefa ${task.title} como concluída` }}
                      />
                    </ListItemIcon>
                    <ListItemButton onClick={() => handleOpenTask(task)} sx={{ py: 1.25 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              color: isCompleted ? 'text.secondary' : 'text.primary',
                              textDecoration: isCompleted ? 'line-through' : 'none'
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
                  {idx < recentTasks.length - 1 && <Divider component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </ListContainer>

      <Dialog
        open={isModalOpen && !!selectedTask}
        onClose={handleCloseModal}
        maxWidth="xs"
        fullWidth={false}
        PaperProps={{
          sx: { width: '100%', maxWidth: 440, borderRadius: 3 }
        }}
      >
        <DialogTitle>Detalhes da tarefa</DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>
            {selectedTask?.description || selectedTask?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {renderSecondaryText(selectedTask?.createdBy)}
          </Typography>
          {selectedTask?.assignedTo && (
            <Typography variant="body2" color="text.secondary">
              Atribuída para: {selectedTask.assignedTo}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Fechar</Button>
          {selectedTask?.createdBy === Meteor.userId() && (
            <Button
              onClick={() => selectedTask && handleEditTask(selectedTask)}
            >
              Editar
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      <Menu
        anchorEl={menuAnchor}
        open={!!menuAnchor}
        onClose={closeActionsMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            if (menuTask) handleEditTask(menuTask);
            closeActionsMenu();
          }}
        >
          Editar
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (menuTask) handleDeleteTask(menuTask);
            closeActionsMenu();
          }}
          disabled={actionLoadingId === menuTask?._id}
        >
          Excluir
        </MenuItem>
      </Menu>
      
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
          <DoubleArrowIcon sx={{ ml: 1 }} />
        </Button>

      </FooterSection>

    </Container>
  );
};

export default HomePage;
