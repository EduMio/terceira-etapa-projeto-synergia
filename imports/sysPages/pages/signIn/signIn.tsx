import React, { useContext, useEffect } from 'react';
import SignInStyles from './signInStyles';
import { useNavigate } from 'react-router-dom';
import SysTextField from '../../../ui/components/sysFormFields/sysTextField/sysTextField';
import SysForm from '../../../ui/components/sysForm/sysForm';
import SysFormButton from '../../../ui/components/sysFormFields/sysFormButton/sysFormButton';
import { signInSchema } from './signinsch';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';

const SignInPage: React.FC = () => {
	const { showNotification } = useContext(AppLayoutContext);
	const { user, signIn } = useContext<IAuthContext>(AuthContext);
	const navigate = useNavigate();
	const { Container, Content, FormContainer, FormWrapper } = SignInStyles;

	const handleSubmit = ({ email, password }: { email: string; password: string }) => {
		signIn(email, password, (err) => {
			if (!err) 
				navigate('/');
			else
				showNotification({
					type: 'error',
					title: 'Erro ao tentar logar',
					message: 'Email ou senha inválidos',
				});
		});
	};

	const handleForgotPassword = () => navigate('/password-recovery');
	const handleRegister = () => navigate('/signup');

	useEffect(() => {
		if (user) 
			navigate('/');
	}, [user]);

	return (
		<Container>
			<Content>
				<Typography variant="h1" fontWeight="900" sx={{ 
					color: 'black', 
					fontStyle: 'normal',
					fontSize: '60px',
					lineHeight: '100%',
					letterSpacing: '0.15%',
					textAlign: 'center',
					leadingTrim: 'NONE'

				}}>
					ToDo List
				</Typography>
				
				<Typography variant="body1" sx={{ 
					color: 'black', 
					textAlign: 'center', 
					mt: 2, 
					mb: 4 ,
					fontWeight: 400,
					fontSize: 18,
				}}>
					Boas-vindas a sua lista de tarefas.<br />Insira seu e-mail e senha para efetuar o login:
				</Typography>
				
				
				<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
					<FormContainer>
						<FormWrapper>
							<SysTextField name="email" label="E-mail" fullWidth placeholder="mail@mail.com" />
							<SysTextField label="Senha" fullWidth name="password" placeholder="••••••••" type="password" />
							<SysFormButton variant="contained" color="primary" fullWidth>
								Entrar
							</SysFormButton>
						</FormWrapper>
					</FormContainer>
				</SysForm>
				
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
					<Button 
						variant="text" 
						sx={{ color: 'black', textAlign: 'left' }} 
						onClick={handleForgotPassword}
					>
						<Typography variant="body2">Esqueceu sua senha? Clique aqui</Typography>
					</Button>
					
					<Button 
						variant="text" 
						sx={{ color: 'black', textAlign: 'left' }} 
						onClick={handleRegister}
					>
						<Typography variant="body2">Novo por aqui? Cadastre-se</Typography>
					</Button>
				</Box>
			</Content>
		</Container>
	);
};

export default SignInPage;
