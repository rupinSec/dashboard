import React, { Component } from 'react'
import AppListContainer from './AppListContainer'
import { ListContainerProps, ListContainerState } from './types';
import { ReactComponent as Check } from '../../../assets/icons/ic-check.svg';
import { ReactComponent as Dropdown } from '../../../assets/icons/appstatus/ic-dropdown.svg'
import { URLS } from '../../../config';
import { AppListViewType } from '../config';
import ExternalListContainer from './ExternalListContainer';

const APP_LIST_PARAM = {
    createApp: 'create-app',
}

const QueryParams = {
    Namespace: "namespace",
    Cluster: "cluster"
}

export default class ListContainer extends Component<ListContainerProps, ListContainerState> {
    constructor(props) {
        super(props)

        this.state = {
            collapsed: false,
            code: 0,
            view: AppListViewType.LOADING,
            onShowList: true,
            selectedList: "application" || "argocd" || "k8s",
            selectedAppList: [
                { value: "application", label: "Devtron apps & Charts", description: "Apps & charts deployed using Devtron" },
                { value: "argocd", label: "External Apps", description: "Helm charts, Argocd objects" },
                { value: "k8s", label: "K8s Objects", description: "All objects for which you have direct access" }
            ],
            selectedEnvironment: []
        }
        this.toggleHeaderName = this.toggleHeaderName.bind(this)
        this.toggleSelectedList = this.toggleSelectedList.bind(this)
    }

    toggleHeaderName() {
        this.setState({ collapsed: !this.state.collapsed })
    }

    toggleSelectedList() {
        this.setState({ onShowList: !this.state.onShowList })
    }

    //     handleChartRepoChange(selected): void {
    //         let namespaceId = this.props.environment?.map((e) => { return e.key }).join(",");
    //         //let searchParams = new URLSearchParams(location.search);
    //         let cluster= searchParams.get(QueryParams.Cluster);
    //         let qs = `${QueryParams.Namespace}=${namespaceId}`;
    //         if (cluster) qs = `${qs}&${QueryParams.Cluster}=${cluster}`;
    //         // this.props.history.push(`${url}?${qs}`);
    // }


    renderPageHeader() {
        return <div className="app-header">
            <div className="p-20 flexbox left" style={{ justifyContent: "space-between" }}>
                <h1 className="app-header__text flex">Applications
                <Dropdown onClick={this.toggleHeaderName} className="icon-dim-24 rotate ml-4" style={{ ['--rotateBy' as any]: this.state.collapsed ? '180deg' : '0deg' }} />
                </h1>
                {this.state.collapsed ? <>
                    <div className="app-list-card bcn-0 br-4 en-1 bw-1 pt-8 pr-8 pb-8 pl-8 ">
                        {/* {this.state.onShowList ? : ""}*/}
                        {this.state.selectedAppList.map((list) => {
                            return <div className="flex left pt-8 pr-8 pb-8 pl-8 cursor" onClick={this.toggleSelectedList}>
                                <Check className="scb-5 mr-8 icon-dim-16" />
                                <div>
                                    <div className="cn-9 fs-13">{list.label}</div>
                                    <div className="cn-5">{list.description}</div>
                                </div>
                            </div>

                        })}
                    </div>

                </> : ""}
                {this.state.view != AppListViewType.EMPTY ? <button type="button" className="cta"
                // onClick={this.openCreateModal}
                >
                    <span className="round-button__icon"><i className="fa fa-plus" aria-hidden="true"></i></span>
                    Add new app
                </button> : null}
            </div>
        </div>
    }

    render() {
        return (
            <div>
                {/* <AppListContainer /> */}
                <ExternalListContainer
                    {...this.props}
                    environment={this.props.environment}
                />

            </div>
        )
    }
}
