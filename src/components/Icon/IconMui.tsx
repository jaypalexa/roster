import AddIcon from '@material-ui/icons/Add';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/Map';
import PrintIcon from '@material-ui/icons/Print';
import React from 'react';

interface IconProps {
  icon: string;
  htmlColor?: string | undefined;
  height?: number;
  width?: number;
}

const IconMui: React.FC<IconProps> = ({icon, htmlColor, height, width}) => {
  switch (icon) {
    case 'add':
      return <AddIcon htmlColor={htmlColor} />;
    case 'home':
      return <HomeIcon htmlColor={htmlColor} />;
    case 'map':
      return <MapIcon htmlColor={htmlColor} />;
    case 'print':
      return <PrintIcon htmlColor={htmlColor} />;
    default:
      return <></>;
  }
};

export default IconMui;