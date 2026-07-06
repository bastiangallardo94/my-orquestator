import { StatesType } from "../../../types/states";
import React from "react";
import { Button, IconButton } from '@mui/material';
import CloseButton from '../../assets/images/cross.svg'

interface WarningProps {
  title: string;
  description: string;
  icon: string;
  closeable?: boolean;
  type: StatesType;
}

const WarningsColor = {
  [StatesType.ERROR]: "red",
  [StatesType.WARNING]: "yellow",
  [StatesType.INFO]: "blue",
  [StatesType.SUCCESS]: "green",
};

const WarningColor = (type: StatesType): string => {
  return WarningsColor[type] || "yellow";
};

const Warning = (props: WarningProps) => {
  const { closeable = true, icon, title, description, type } = props;
  const [visible, setVisible] = React.useState(true);

  if (!visible) {
    return null;
  }

  return (
    <div className={`w-100 mf-bg-warning-primary mf-my-5 mf-flex mf-row-auto mf-gap-2 mf-pt-4 mf-pb-2 mf-px-2 mf-content-center mf-rounded-sm`} role="alert">
      <div className="mf-self-center mf-mx-4 mf-my-6"><img src={icon} alt="" /></div>
      <div>
        <div className="mf-font-bold mf-text-base">{title}</div>
        <div>{description}</div>
      </div>

      {closeable && (
		  <div  className="mf-flex mf-flex-col mf-align-items-top hover:mf-opacity-60 mf-transition-opacity mf-duration-200" >
			  <img src={CloseButton} className="mf-cursor-pointer mf-p-2" alt="close" onClick={() => setVisible(false)}/>
		  </div>
      )}
    </div>
  );
};

export default Warning;
