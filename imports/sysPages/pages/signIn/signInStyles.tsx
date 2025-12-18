import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

interface ISignInStyles {
	Container: React.ElementType;
	Header: React.ElementType;
	HeaderContent: React.ElementType;
	Content: React.ElementType;
	FormContainer: React.ElementType;
	FormWrapper: React.ElementType;
}

const SignInStyles: ISignInStyles = {
	Container: styled(Box)(({ theme }) => ({
		minHeight: '100vh',
		width: '100%',
		backgroundColor: theme.palette.common.white,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: theme.spacing(3)
	})),
	Header: styled(Box)(({ theme }) => ({
		width: '100%',
		padding: theme.spacing(2),
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	})),
	HeaderContent: styled(Box)(({ theme }) => ({
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		gap: theme.spacing(2)
	})),
	Content: styled(Box)(({ theme }) => ({
		width: '100%',
		maxWidth: '520px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.spacing(2.5),
		margin: '0 auto'
	})),
	FormContainer: styled(Box)(({ theme }) => ({
		width: '100%',
		maxWidth: '440px',
		padding: 0,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: theme.spacing(2)
	})),
	FormWrapper: styled(Box)(({ theme }) => ({
		width: '100%',
		maxWidth: '440px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: theme.spacing(1.75)
	}))
};

export default SignInStyles;
