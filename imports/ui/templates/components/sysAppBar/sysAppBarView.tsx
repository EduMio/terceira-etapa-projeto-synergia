import React, { Fragment, ReactNode, useContext } from 'react';
import Styles from './sysAppBarStyles';
import Context, { ISysAppBarContext } from './sysAppBarContext';
import sysRoutes from '/imports/app/routes/routes';
import SysIcon from '/imports/ui/components/sysIcon/sysIcon';
import { SysNavLink } from '/imports/ui/components/sysNavLink/sysNavLink';
import SysMenu from '/imports/ui/components/sysMenu/sysMenuProvider';
import SysAvatar from '/imports/ui/components/sysAvatar/sysAvatar';
import RenderWithPermission from '/imports/security/ui/components/renderWithPermission';

interface ISysAppBar{
  logo?: ReactNode;
}

const SysAppBarView: React.FC<ISysAppBar> = ({logo}) => {
  const controller = useContext<ISysAppBarContext>(Context);
  
  return (
    <Styles.wrapper>
      <Styles.container>
        {logo}
        {/* Navigation buttons removed per request */}
        <Fragment>
          <SysAvatar 
            name={ controller.userName } 
            activateOutline
            onClick={controller.abrirMenuPerfil}
            size='large'
          />
          <SysMenu
              ref={controller.menuPerfilRef}
              options={controller.getOpcoesMenuDeUsuario()}
              activeArrow
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            />
        </Fragment>
      </Styles.container>
    </Styles.wrapper>
  );
};

export default SysAppBarView;
