import { IAppMenu, IModuleHub, IRoute } from './modulesTypings';
import UserProfile from './userprofile/config';
import ToDos from './toDos';

const pages: Array<IRoute | null> = [
	...UserProfile.pagesRouterList,
	...ToDos.pagesRouterList
];

const menuItens: Array<IAppMenu | null> = [
	...UserProfile.pagesMenuItemList,
	...ToDos.pagesMenuItemList
];

const Modules: IModuleHub = {
	pagesMenuItemList: menuItens,
	pagesRouterList: pages
};

export default Modules;
