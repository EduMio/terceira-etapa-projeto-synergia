import React from 'react';
import { IAppMenu } from '../../modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from './recursos';

export const toDosMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/tasks',
		name: 'Tarefas',
		icon: <SysIcon name={'task'} />,
		resources: [Recurso.TASKS_VIEW]
	}
];
