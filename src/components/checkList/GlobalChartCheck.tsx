import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { URLS } from '../../config';
import img from '../../assets/img/ic-checklist-chart@2x.png';
import './checklist.css';
import { DEPLOY_CHART_MESSAGING } from './constants';

export class GlobalChartsCheck extends Component {
    render() {
        return <div className="bcn-0 mb-20 br-4">
            <img className="img-width pt-12 pl-16" src={img} />
            <div className="pl-16 pr-16 pt-12 pb-12 fs-13">
                <div className="cn-9"> {DEPLOY_CHART_MESSAGING.DEPLOY_DEVTRON}</div>
                <NavLink to={`${URLS.CHARTS}/discover`} className="dc__no-decor cb-5 fw-6 ">{DEPLOY_CHART_MESSAGING.DISCOVER_CHART}</NavLink>
            </div>
        </div>
    }
}