import React from 'react';
import { ServerError } from '../../../modals/commonTypes';
import { RouteComponentProps } from 'react-router';

export interface AppListState {
    code: number;
    view: string;
    errors: ServerError[];
    apps: App[];
    showCommandBar: boolean;
    sortRule: {
        key: string;
        order: string;
    },
    size: number;
    offset: number;
    pageSize: number;
    expandedRow: boolean;
    appData: App | null;
}

export interface App {
    id: number;
    name: string;
    environments: Array<Environment & { default: boolean }>;
    defaultEnv: Environment | null;
}

export interface Environment {
    id: number;
    name: string;
    status: string;
    lastDeployedTime: string;
    materialInfo: {
        author: string;
        branch: string;
        message: string;
        modifiedTime: string;
        revision: string;
        url: string;
        gitMaterialName: string;
        webhookData: string;
    }[];
    ciArtifactId: number;
    clusterName: string;
    namespace: string;
}

export interface AppListProps extends RouteComponentProps<{ route: string }> {
    payloadParsedFromUrl?: any;
    serverMode? : string;
    clearAllFilters: () => void;
    sortApplicationList : (key: string) => void;
    appListCount: number
    isSuperAdmin: boolean
    openDevtronAppCreateModel: (event) => void
    setAppCount: React.Dispatch<React.SetStateAction<number>>
    updateDataSyncing: (loading: boolean) => void
}

export interface AppListViewProps extends AppListState, RouteComponentProps<{}> {
  expandRow: (app: App | null) => void;
  closeExpandedRow: () => void;
  sort: (key: string) => void;
  handleEditApp: (appId: number) => void;
  redirectToAppDetails: (app, envId: number) => string;
  clearAll: () => void;
  changePage: (pageNo: number) => void;
  changePageSize: (size: number) => void;
  appListCount: number
  isSuperAdmin: boolean
  openDevtronAppCreateModel: (event) => void
  updateDataSyncing: (loading: boolean) => void
}

export interface AppListResponse {
    appId: number
    appName: string
    environments: AppListEnvironmentResponse
}

export interface AppListEnvironmentResponse {
    appId: number
    appName: string
    environmentId: number
    environmentName: string
    deploymentCounter?: number
    instanceCounter?: number
    status?: string
    lastDeployedTime?: string
    namespace?: string
    prometheusEndpoint?: string
    default?: boolean
    lastSuccessDeploymentDetail?: DeploymentDetailContainerResponse
}

export interface DeploymentDetailContainerResponse {
    appId: number
    appName: string
    environmentId: number
    environmentName: string
    statusMessage?: string
    LastDeployedBy?: string
    status?: string
    lastDeployedTime?: string
    namespace?: string
    prometheusEndpoint?: string
    default?: boolean
    materialInfo?: any
    releaseVersion?: string
    dataSource?: string
    lastDeployedPipeline?: string
}


export const OrderBy = {
    ASC: 'ASC',
    DESC: 'DESC'
}

export const SortBy = {
    APP_NAME: "appNameSort",
    LAST_DEPLOYED: "lastDeployedSort",
    STATUS: "statusSort",
    ENVIRONMENT: "environmentSort",
}

export interface AppListPropType {
  isSuperAdmin: boolean
  appListCount: number
}

export interface TriggerURL {
    appId?: string
    envId: string
    installedAppId?: string
    close: () => void
    isEAMode?: boolean
}

export interface ManifestUrlList {
    kind: string
    name: string
    pointsTo: string
    urls: string[]
}
