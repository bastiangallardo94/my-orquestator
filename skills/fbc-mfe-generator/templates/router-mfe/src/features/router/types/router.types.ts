/**
 * Tipos del Router de Mantenedores
 */
export type MaintainerType = '' | 'forwarder' | 'extraportuario' | 'documents' | 'hscodes';

export interface MaintainerOption {
  id: MaintainerType;
  name: string;
}

export const getMaintainerOptions = (t: (key: string) => string): MaintainerOption[] => [
  { id: 'forwarder',      name: t('router.forwarder') },
  { id: 'extraportuario', name: t('router.extraportuario') },
  { id: 'documents',      name: t('router.documents') },
  { id: 'hscodes',        name: t('router.hscodes') },
];
