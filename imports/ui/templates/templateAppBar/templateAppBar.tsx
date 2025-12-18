import React from 'react';
import {ISysTemplateProps} from '../getTemplate';
import {BoxProps, Typography} from '@mui/material';
import TemplateAppBarStyles from './templateAppBarStyles';
import SysAppBar from '../components/sysAppBar/sysAppBarController';

export interface ITemplateAppBar extends ISysTemplateProps {
  containerProps?: BoxProps;
  logo?: React.ReactNode;
}

export const TemplateAppBar: React.FC<ITemplateAppBar> = ({
  children,
  menuOptions,
  logo,
  containerProps
}) => {
  return (
    <TemplateAppBarStyles.container>
      <SysAppBar logo={logo ?? <BoilerplateLogo />} menuOptions={menuOptions} />
      <TemplateAppBarStyles.contentWrapper>
        <TemplateAppBarStyles.contentContainer {...containerProps}>
          {children}
        </TemplateAppBarStyles.contentContainer>
      </TemplateAppBarStyles.contentWrapper>
    </TemplateAppBarStyles.container>
  );
};

const BoilerplateLogo: React.FC = () => {
	return (
		<Typography
			variant="subtitle1"
			color="#1e1e1e"
			sx={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: 42 }}>
			ToDo List
		</Typography>
	);
};
