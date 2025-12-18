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
				<Typography
					variant="h1"
					fontWeight={900}
					sx={{
						color: '#1e1e1e',
						fontSize: 40,
						lineHeight: 1.1,
						letterSpacing: '0.4px',
						textAlign: 'center'
					}}>
					ToDo List
				</Typography>
				
				<Typography
					variant="body1"
					sx={{
						color: '#1e1e1e',
						textAlign: 'center',
						mt: 1.5,
						mb: 3,
						fontWeight: 400,
						fontSize: 16,
						maxWidth: 440
					}}>
					Boas-vindas a sua lista de tarefas.<br />Insira seu e-mail e senha para efetuar o login:
				</Typography>
				
				
				<SysForm schema={signInSchema} onSubmit={handleSubmit} debugAlerts={false}>
					<FormContainer>
						<FormWrapper>
							<SysTextField
								name="email"
								label="E-mail"
								fullWidth
								placeholder="mail@mail.com"
								sxMap={{
									textField: {
										'& .MuiOutlinedInput-root': {
											borderRadius: 6,
											height: 48
										},
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: '#4a4a4a'
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: '#4a4a4a'
										},
										'& .MuiInputBase-input': {
											padding: '12px 14px',
											fontSize: 14
										}
									}
								}}
							/>
							<SysTextField
								label="Senha"
								fullWidth
								name="password"
								placeholder="••••••••"
								type="password"
								sxMap={{
									textField: {
										'& .MuiOutlinedInput-root': {
											borderRadius: 6,
											height: 48
										},
										'& .MuiOutlinedInput-notchedOutline': {
											borderColor: '#4a4a4a'
										},
										'&:hover .MuiOutlinedInput-notchedOutline': {
											borderColor: '#4a4a4a'
										},
										'& .MuiInputBase-input': {
											padding: '12px 14px',
											fontSize: 14
										}
									}
								}}
							/>
							<SysFormButton
								variant="contained"
								color="primary"
								fullWidth
								sx={{
									mt: 0.5,
									height: 48,
									borderRadius: 7,
									backgroundColor: '#c4c4c4',
									color: '#2c2c2c',
									fontWeight: 700,
									textTransform: 'none',
									'&:hover': { backgroundColor: '#b5b5b5' },
									'&:active': { backgroundColor: '#a5a5a5' }
								}}>
								Entrar
							</SysFormButton>
						</FormWrapper>
					</FormContainer>
				</SysForm>
				
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
					<Button 
						variant="text" 
						sx={{ color: '#1e1e1e', textAlign: 'left', textTransform: 'none', fontSize: 14, fontWeight: 500 }} 
						onClick={handleForgotPassword}
					>
						<Typography variant="body2">Esqueceu sua senha? Clique aqui</Typography>
					</Button>
					
					<Button 
						variant="text" 
						sx={{ color: '#1e1e1e', textAlign: 'left', textTransform: 'none', fontSize: 14, fontWeight: 500 }} 
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
