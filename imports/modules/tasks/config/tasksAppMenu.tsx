import React from 'react';
import { IAppMenu } from '../../../modules/modulesTypings';
import SysIcon from '../../../ui/components/sysIcon/sysIcon';

export const tasksMenuItemList: (IAppMenu | null)[] = [
	{
		path: '/tasks',
		name: 'Tarefas',
		icon: <SysIcon name={'arrowDropDown'} /> // This is wrong, change later
	}
];
