import { validarEmail } from '../../../libs/validaEmail';
import { IDoc } from '../../../typings/IDoc';
import { ISchema } from '../../../typings/ISchema';

export const signInSchema: ISchema<ISignIn> = {
	email: {
		type: 'String',
		label: 'E-mail',
		optional: false,
		defaultValue: 'mail@mail.com',
		validationFunction: (value: string) => {
			if (!value) return undefined;
			const email = validarEmail(value);
			if (!email) return 'Email inválido';
			return undefined;
		}
	},
	password: {
		type: 'String',
		label: 'Senha',
		optional: false,
		defaultValue: ''
	}
};

export interface ISignIn extends IDoc {
	email: string;
	password: string;
}
