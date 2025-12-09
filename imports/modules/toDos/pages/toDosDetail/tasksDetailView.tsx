import React, { useContext } from 'react';
import { TasksDetailControllerContext } from './tasksDetailController';
import { TasksModuleContext } from '../../toDosContainer';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import SysIcon from '../../../../ui/components/sysIcon/sysIcon';
import SysForm from '../../../../ui/components/sysForm/sysForm';
import SysTextField from '../../../../ui/components/sysFormFields/sysTextField/sysTextField';
import { SysSelectField } from '../../../../ui/components/sysFormFields/sysSelectField/sysSelectField';
import SysFormButton from '../../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { styled } from '@mui/material/styles';

const Container = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
	gap: theme.spacing(3),
	width: '100%',
	maxWidth: '1200px',
	margin: '0 auto',
	padding: theme.spacing(4),
	marginTop: '56px',
}));

const Header = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	width: '100%',
	marginBottom: theme.spacing(3)
}));

const Body = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
	width: '100%',
	gap: '64px',
	[theme.breakpoints.down('md')]: {
		flexDirection: 'column',
		gap: theme.spacing(3)
	}
}));

const FormColumn = styled(Box)(({ theme }) => ({
	width: '100%',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'flex-start',
	alignItems: 'flex-start',
	gap: theme.spacing(3)
}));

const Footer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-end',
	alignItems: 'center',
	width: '100%',
	gap: theme.spacing(2),
	marginTop: '40px'
}));

const TasksDetailView = () => {
	const controller = useContext(TasksDetailControllerContext);
	const { state } = useContext(TasksModuleContext);
	const isView = state === 'view';
	const isEdit = state === 'edit';
	const isCreate = state === 'create';

	return (
		<Container>
			<Header>
				{isView && (
					<IconButton onClick={controller.closePage}>
						<SysIcon name={'arrowBack'} />
					</IconButton>
				)}
				<Typography variant="h5" sx={{ flexGrow: 1 }}>
					{isCreate ? 'Adicionar Tarefa' : isEdit ? 'Editar Tarefa' : controller.document.title}
				</Typography>
				<IconButton
					onClick={!isView ? controller.closePage : () => controller.changeToEdit(controller.document._id || '')}>
					{!isView ? <SysIcon name={'close'} /> : <SysIcon name={'edit'} />}
				</IconButton>
			</Header>
			
			<SysForm
				mode={state as 'create' | 'view' | 'edit'}
				schema={controller.schema}
				doc={controller.document}
				onSubmit={controller.onSubmit}
				loading={controller.loading}>
				<Body>
					<FormColumn>
						<SysTextField name="title" placeholder="Ex.: Título da tarefa" />
						<SysTextField
							name="description"
							placeholder="Descrição da tarefa"
							multiline
							rows={4}
						/>
					</FormColumn>
					<FormColumn>
						<SysSelectField name="status" placeholder="Selecionar status" />
						<SysTextField name="assignedTo" placeholder="Atribuído para" />
					</FormColumn>
				</Body>
				<Footer>
					{!isView && (
						<Button variant="outlined" startIcon={<SysIcon name={'close'} />} onClick={controller.closePage}>
							Cancelar
						</Button>
					)}
					{!isView && <SysFormButton>Salvar</SysFormButton>}
				</Footer>
			</SysForm>
		</Container>
	);
};

export default TasksDetailView;
