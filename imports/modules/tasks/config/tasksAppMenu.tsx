import React from 'react';
import { IAppMenu } from '../../../modules/modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';
import { Recurso } from '../config/recursos';

export const tasksMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/tasks',
		name: 'Tarefas',
		icon: <SysIcon name={'task'} />,
		resources: [Recurso.TASKS_VIEW]
	}
];
