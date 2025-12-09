import { toDosRouterList } from './config/toDosRouters';
import { toDosMenuItemList } from './config/toDosAppMenu';
import { IModuleHub } from '../modulesTypings';

const ToDosModule: IModuleHub = {
	pagesRouterList: toDosRouterList,
	pagesMenuItemList: toDosMenuItemList
};

export default ToDosModule;
