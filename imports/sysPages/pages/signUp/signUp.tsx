import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import Button from '@mui/material/Button';
import { userprofileApi } from '../../../modules/userprofile/api/userProfileApi';
import SimpleForm from '/imports/ui/components/SimpleForm/SimpleForm';

import { signUpStyle } from './signUpStyle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppLayoutContext from '/imports/app/appLayoutProvider/appLayoutContext';
import AuthContext, { IAuthContext } from '/imports/app/authProvider/authContext';
import { validarEmail } from '/imports/libs/validaEmail';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';

const passwordRules = [
	{
		key: 'length',
		label: 'Mínimo de 8 caracteres',
		test: (value: string) => value.length >= 8
	},
	{
		key: 'uppercase',
		label: 'Ao menos 1 letra maiúscula',
		test: (value: string) => /[A-Z]/.test(value)
	},
	{
		key: 'lowercase',
		label: 'Ao menos 1 letra minúscula',
		test: (value: string) => /[a-z]/.test(value)
	},
	{
		key: 'number',
		label: 'Ao menos 1 número',
		test: (value: string) => /\d/.test(value)
	}
];

const passwordValidationMessage =
	'Senha muito simples. Use no mínimo 8 caracteres, com letra maiúscula, minúscula e número.';

const isPasswordValid = (value: string) => passwordRules.every((rule) => rule.test(value));

export const SignUp: React.FC = () => {
	const navigate = useNavigate();
	const { showNotification } = useContext(AppLayoutContext);
	const { user } = useContext<IAuthContext>(AuthContext);
	const [submitting, setSubmitting] = useState(false);
	const [passwordValue, setPasswordValue] = useState('');

	const handleSubmit = (doc: { email: string; password: string }) => {
		if (submitting) return;
		setSubmitting(true);
		const { email, password } = doc;

		userprofileApi.insertNewUser({ email, username: email, password }, (err, r) => {
			setSubmitting(false);
			if (err) {
				console.log('Signup error', err);
				showNotification?.({
					type: 'error',
					title: 'Problema na criação do usuário!',
					message: err?.reason || 'Erro ao fazer registro em nossa base de dados!'
				});
				return;
			}
			showNotification?.({
				type: 'success',
				title: 'Cadastrado com sucesso!',
				message: 'Registro realizado. Você já pode acessar com seu e-mail e senha.'
			});
			navigate('/signin');
		});
	};

	useEffect(() => {
		if (user) navigate('/');
	}, [user, navigate]);

	return (
		<Container style={signUpStyle.containerSignUp}>
			<Box sx={signUpStyle.labelRegisterSystem}>
				<img src="/images/wireframe/logo.png" style={signUpStyle.imageLogo} />
				{'Cadastrar no sistema'}
			</Box>
			<SimpleForm
				schema={{
					email: {
						type: String,
						label: 'Email',
						optional: false,
						validate: (value: string) => (!value ? true : validarEmail(value) || 'Email inválido.')
					},
					password: {
						type: String,
						label: 'Senha',
						optional: false,
						validate: (value: string) => (!value ? true : isPasswordValid(value) || passwordValidationMessage)
					}
				}}
				onSubmit={handleSubmit}>
				<TextField id="Email" label="Email" fullWidth name="email" type="email" placeholder="Digite um email" />
				<TextField
					id="Senha"
					label="Senha"
					fullWidth
					name="password"
					placeholder="Digite uma senha"
					type="password"
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPasswordValue(event.target.value)}
				/>
				<Box sx={{ mt: 1, mb: 2 }}>
					<Typography variant="caption" color="text.secondary">
						A senha deve conter:
					</Typography>
					<Box component="ul" sx={{ pl: 0, mt: 0.5, mb: 0, listStyle: 'none' }}>
						{passwordRules.map((rule) => {
							const isMet = rule.test(passwordValue);
							const color = isMet ? 'success.main' : 'text.secondary';
							return (
								<Box
									component="li"
									key={rule.key}
									sx={{
										display: 'flex',
										alignItems: 'center',
										gap: 1,
										color
									}}>
									<SysIcon name="check" fontSize="small" sx={{ visibility: isMet ? 'visible' : 'hidden' }} />
									<Typography variant="caption" color={color}>
										{rule.label}
									</Typography>
								</Box>
							);
						})}
					</Box>
				</Box>
				<Box sx={signUpStyle.containerButtonOptions}>
					<Button color={'primary'} variant={'outlined'} id="submit" disabled={submitting}>
						{submitting ? 'Cadastrando...' : 'Cadastrar'}
					</Button>
				</Box>
			</SimpleForm>
			<Box sx={signUpStyle.containerRouterSignIn}>
				Já tem uma conta? Faça login clicando{' '}
				<Link to="/signin" color={'secondary'}>
					aqui
				</Link>
			</Box>
		</Container>
	);
};
