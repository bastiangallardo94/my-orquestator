import React, { useEffect, useRef, useState } from "react";
import { mountRootParcel } from "single-spa";
import { useTranslation } from "react-i18next";
import FolderIcon from "@shared/assets/images/folder_with_file.svg";
import { EmptyState } from "./components/EmptyState";
import { MaintainerType, getMaintainerOptions } from "./types/router.types";
import { Breadcrumb, BreadcrumbItem } from "@import/shipment-library-react";
import '@shared/styles/breadcrumb.scss';
import { useAppRoles } from "@shared/hooks/useAppRoles";
import { USER_ROLES } from "@core/constants/roles";
import {MenuItem, Select} from "@mui/material";

const ROUTES_PORTAL = {
  FBC_HOME: '/',
  FOREIGN_TRADE: '/foreign-trade',
} as const;

export const RouterPage: React.FC = () => {
  const { t } = useTranslation();
  const [maintainerType, setMaintainerType] = useState<MaintainerType>("");
  const { roles } = useAppRoles();
  // const hasDocumentsAccess = true; // bypass para validación local
  const hasDocumentsAccess = roles.some(r =>
    [USER_ROLES.VIEW_DOCUMENTS, USER_ROLES.UPDATE_DOCUMENTS]
      .some(required => r.toUpperCase() === required.toUpperCase())
  );
  // HsCodes maintainer is not yet available.
  // When the hs-codes MFE is ready, replace this flag with a role-based guard:
  // const hasHsCodesAccess = roles.some(r =>
    // [USER_ROLES.VIEW_HSCODES, USER_ROLES.UPDATE_HSCODES]
      // .some(required => r.toUpperCase() === required.toUpperCase())
  // );
  const hasHsCodesAccess = false
  const parcelContainerRef = useRef<HTMLDivElement>(null);
  const parcelRef = useRef<{ unmount: () => Promise<null | void> } | null>(null);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: t('common.home'), url: ROUTES_PORTAL.FBC_HOME },
    { label: t('common.foreignTrade'), url: ROUTES_PORTAL.FOREIGN_TRADE },
    { label: t('common.appTitle') },
  ];

  useEffect(() => {
    if (parcelRef.current) {
      parcelRef.current.unmount().catch(console.error);
      parcelRef.current = null;
    }

    if (maintainerType === "forwarder" && parcelContainerRef.current) {
      const parcel = mountRootParcel(
        () =>
          (import("importMaintainerForwarders/App") as Promise<any>).catch(() => ({
            bootstrap: () => Promise.resolve(),
            mount: () => Promise.resolve(),
            unmount: () => Promise.resolve(),
          })),
        { domElement: parcelContainerRef.current }
      );
      parcelRef.current = parcel;
    }
    if (maintainerType === "extraportuario" && parcelContainerRef.current) {
      const parcel = mountRootParcel(
        () =>
          (import("importMaintainerBondedWarehouses/App") as Promise<any>).catch(() => ({
            bootstrap: () => Promise.resolve(),
            mount: () => Promise.resolve(),
            unmount: () => Promise.resolve(),
          })),
        { domElement: parcelContainerRef.current }
      );
      parcelRef.current = parcel;
    }
    if (maintainerType === "documents" && hasDocumentsAccess && parcelContainerRef.current) {
      const parcel = mountRootParcel(
        () => (import("importMaintainerDocuments/App") as Promise<any>).catch(() => ({
          bootstrap: () => Promise.resolve(),
          mount: () => Promise.resolve(),
          unmount: () => Promise.resolve(),
        })),
        { domElement: parcelContainerRef.current }
      );
      parcelRef.current = parcel;
    }

    if (maintainerType === "hscodes" && hasHsCodesAccess && parcelContainerRef.current) {
      const parcel = mountRootParcel(
        () => (import("importMaintainerHsCodes/App") as Promise<any>).catch(() => ({
          bootstrap: () => Promise.resolve(),
          mount: () => Promise.resolve(),
          unmount: () => Promise.resolve(),
        })),
        { domElement: parcelContainerRef.current }
      );
      parcelRef.current = parcel;
    }

    return () => {
      if (parcelRef.current) {
        parcelRef.current.unmount().catch(console.error);
        parcelRef.current = null;
      }
    };
  }, [maintainerType, hasDocumentsAccess, hasHsCodesAccess]);

  return (
    <div className="{{SCOPE_CLASS}}">
      <Breadcrumb items={breadcrumbItems} />

      <div className="maint-p-6 maint-bg-white maint-rounded-lg maint-mt-2"
           style={{ border: '1px solid #e5e7eb' }}>

        {/* Header SIEMPRE visible */}
        <div className="maint-mb-6 maint-flex maint-justify-start maint-items-center maint-gap-3 maint-pb-2"
             style={{ borderBottom: '1px solid #e5e7eb' }}>
          <img src={FolderIcon} alt={t('common.appTitle')} />
          <h1 className="maint-text-2xl maint-font-normal" style={{ color: '#333333' }}>
            {t('common.appTitle')}
          </h1>
        </div>

        {/* Selector SIEMPRE visible */}
        <div className="maint-mb-6 maint-flex maint-justify-start maint-items-center maint-gap-3 maint-pb-2"
             style={{ borderBottom: '1px solid #e5e7eb' }}>
          <label className="maint-text-sm maint-font-medium maint-min-w-[140px]" style={{ color: '#505050' }}>
            {t('router.typeMaintainer')}
          </label>
          <Select
            variant="outlined"
            sx={{ minWidth: 240 }}
            value={maintainerType}
            displayEmpty
            onChange={(e) => setMaintainerType(e.target.value as MaintainerType)}
          >
           <MenuItem value="">
              <em>{t('router.selectAnOption')}</em>
           </MenuItem>
            {getMaintainerOptions(t)?.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))

            }
          </Select>
        </div>

        {/* Contenido */}
        <div className="maint-mt-6">
          {maintainerType === "" && (
            <EmptyState message={t('router.emptyState')} />
          )}
          {maintainerType === "forwarder" && (
            <div ref={parcelContainerRef} />
          )}
          {maintainerType === "extraportuario" && (
            <div ref={parcelContainerRef} />
          )}
          {maintainerType === "documents" && (
            hasDocumentsAccess
              ? <div ref={parcelContainerRef} />
              : <EmptyState message={t('router.accessDenied')} />
          )}
          {maintainerType === "hscodes" && (
            hasHsCodesAccess
              ? <div ref={parcelContainerRef} />
              : <EmptyState message={t('router.comingSoon')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RouterPage;
