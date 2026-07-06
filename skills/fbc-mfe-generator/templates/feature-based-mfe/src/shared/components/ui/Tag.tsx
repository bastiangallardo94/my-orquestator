import { StatesType } from '../../../types/states';
import React from 'react'

interface TagProps {
    description: string;
    type: StatesType;
}

const Tag = () => {
  return (
   <div className="mf-text-sm mf-bg-warning-primary mf-text-warning-secondary mf-rounded-md mf-px-2 mf-py-1"> Pendiente </div>
  )
}

export default Tag