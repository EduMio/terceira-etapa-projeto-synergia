import { Recurso as Usuarios } from '/imports/modules/userprofile/config/recurso';
import { RoleType } from '/imports/security/config/roleType';
import { HomeResources, SysFormTestPageResources } from '/imports/sysPages/config/resources';
import { Recurso as ToDos } from '/imports/modules/toDos/config/recursos';

const _getAllValues = (obj: any) => Object.keys(obj).map(key => obj[key]);

type MapRolesRecursos = Record<RoleType, Array<string>>; 

const _mapRolesRecursos: MapRolesRecursos = {
	[RoleType.PUBLICO]: [],
	[RoleType.USUARIO]: [
		..._getAllValues(HomeResources),
		Usuarios.USUARIO_UPDATE,
		Usuarios.USUARIO_VIEW,	
		ToDos.TASKS_VIEW,
		ToDos.TASKS_CREATE
	],
	[RoleType.ADMINISTRADOR]: [
		Usuarios.USUARIO_CREATE,
		Usuarios.USUARIO_REMOVE,
		ToDos.TASKS_UPDATE,
		ToDos.TASKS_REMOVE
	],
};

/**
 * Mapeamento entre as roles (perfil de usuário) e os recursos.
 * chave: role.
 * valores: recursos.
 *
 *
 * O nome do recurso deve ser prefixado com nome do módulo.
 */
export const mapRolesRecursos: MapRolesRecursos = {
	[RoleType.PUBLICO]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
	],
	[RoleType.USUARIO]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
		..._mapRolesRecursos[RoleType.USUARIO],
	],
	[RoleType.ADMINISTRADOR]: [
		..._mapRolesRecursos[RoleType.PUBLICO],
		..._mapRolesRecursos[RoleType.USUARIO],
		..._mapRolesRecursos[RoleType.ADMINISTRADOR],
	],
};
