import React, { useEffect, useState } from 'react';
import { getDeploymentTemplate, updateDeploymentTemplate, saveDeploymentTemplate, toggleAppMetrics as updateAppMetrics } from './service';
import { getChartReferences } from '../../services/service';
import { Toggle, Progressing, ConfirmationDialog, useJsonYaml, isVersionLessThanOrEqualToTarget } from '../common';
import { useEffectAfterMount, showError } from '../common/helpers/Helpers'
import { useParams } from 'react-router'
import { toast } from 'react-toastify';
import CodeEditor from '../CodeEditor/CodeEditor'
import warningIcon from '../../assets/icons/ic-info-filled.svg'
import { ReactComponent as File } from '../../assets/icons/ic-file.svg'
import { ReactComponent as Close } from '../../assets/icons/ic-close.svg';
import ReactSelect from 'react-select';
import { DOCUMENTATION } from '../../config';
import './deploymentConfig.scss';

export function OptApplicationMetrics({ currentVersion, onChange, opted, focus = false, loading, className = "", disabled = false }) {
    let isChartVersionSupported = isVersionLessThanOrEqualToTarget(currentVersion, [3, 7, 0]);

    return <div id="opt-metrics" className={`flex column left br-0 white-card ${focus ? 'animate-background' : ''} ${className}`}>
        <div className="p-lr-20 p-13 flex left" style={{ justifyContent: 'space-between', width: '100%' }}>
            <div className="flex column left">
                <b>Show application metrics</b>
                <div>Capture and show key application metrics over time. (E.g. Status codes 2xx, 3xx, 5xx; throughput and latency).</div>
            </div>
            <div>
                <button className="cta" type="submit">{loading ? <Progressing /> : 'Save'}</button>
            </div>
        </div>
        {isChartVersionSupported && <div className="flex left p-lr-20 chart-version-warning" style={{ width: '100%' }}>
            <img />
            <span>Application metrics is not supported for the selected chart version. Update to the latest chart version and re-deploy the application to view metrics.</span>
        </div>}
    </div>
}

export default function DeploymentConfig({ respondOnSuccess }) {
    const [loading, setLoading] = useState(false);
    const [chartVersions, setChartVersions] = useState<{ id: number, version: string; }[]>(null);
    const appMetricsEnvironmentVariableEnabled = window._env_ && window._env_.APPLICATION_METRICS_ENABLED;
    const [selectedChart, selectChart] = useState<{ id: number, version: string; }>(null)
    const [isAppMetricsEnabled, toggleAppMetrics] = useState(null);
    const [appMetricsLoading, setAppMetricsLoading] = useState(false);
    const [chartConfigLoading, setChartConfigLoading] = useState(null);
    const { appId } = useParams<{ appId }>();

    async function saveAppMetrics(appMetricsEnabled) {
        try {
            setAppMetricsLoading(true)
            await updateAppMetrics(+appId, {
                isAppMetricsEnabled: appMetricsEnabled
            })
            toast.success(`Successfully ${appMetricsEnabled ? 'subscribed' : 'unsubscribed'}.`, { autoClose: null })
            initialise();
        }
        catch (err) {
            showError(err)
            setAppMetricsLoading(false)
        }
    }

    async function initialise() {
        setChartConfigLoading(true)
        try {
            const { result: { chartRefs, latestAppChartRef, latestChartRef } } = await getChartReferences(+appId)
            setChartVersions(chartRefs);
            let selectedChartId: number = latestAppChartRef || latestChartRef;
            let chart = chartRefs.find(chart => chart.id === selectedChartId);
            selectChart(chart);
        }
        catch (err) {

        }
        finally {
            setChartConfigLoading(false)
        }
    }

    return <div style={{height:'81.5vh'}}><div style={{display:'grid', gridTemplateColumns:'1fr 1fr', height:'100%'}}>
        {/* <h3 className="form__title form__title--artifatcs">Deployment Template</h3>
        <p className="form__subtitle">Required to execute deployment pipelines for this application.&nbsp;
            <a rel="noreferrer noopener" className="learn-more__href" href={DOCUMENTATION.APP_CREATE_DEPLOYMENT_TEMPLATE} target="_blank">Learn more about Deployment Template Configurations</a>
        </p> */}
        <DeploymentConfigForm 
        respondOnSuccess={respondOnSuccess} 
        loading={loading} setLoading={setLoading} 
        chartVersions={chartVersions} 
        setChartVersions={setChartVersions}
        selectedChart={selectedChart}
        selectChart={selectChart}
        toggleAppMetrics={toggleAppMetrics}
        isAppMetricsEnabled={isAppMetricsEnabled}
        appMetricsLoading={appMetricsLoading}
        setAppMetricsLoading={setAppMetricsLoading}
        chartConfigLoading={chartConfigLoading}
        setChartConfigLoading={setChartConfigLoading}
        initialise={initialise}
        appId={appId}/>
        <ApplicationmatrixInfo/>
    </div>
                {/* {chartVersions && selectedChart && appMetricsEnvironmentVariableEnabled && */}
                <OptApplicationMetrics
                    currentVersion={selectedChart?.version}
                    onChange={e => saveAppMetrics(!isAppMetricsEnabled)}
                    opted={isAppMetricsEnabled}
                    loading={appMetricsLoading}
                />
    </div>
}

function ApplicationmatrixInfo() {
    return(
        <>
          <form action="" className="white-card white-card__deployment-config br-0 bw-0">
              <div className="p-16 flex left content-space">
                  <span className="fw-6 fs-14">Using application metrics</span>
                  <Close className="icon-dim-20"/>
              </div>
          </form>
        </>
    )
}

function DeploymentConfigForm({ respondOnSuccess, loading, setLoading, chartVersions, setChartVersions, selectedChart, selectChart, toggleAppMetrics, isAppMetricsEnabled, appMetricsLoading, setAppMetricsLoading,
    chartConfigLoading, setChartConfigLoading, initialise, appId }) {
    const [template, setTemplate] = useState("")
    const [chartConfig, setChartConfig] = useState(null)
    const [tempFormData, setTempFormData] = useState("")
    const [obj, json, yaml, error] = useJsonYaml(tempFormData, 4, 'yaml', true);
    const [showConfirmation, toggleConfirmation] = useState(false)

    useEffect(() => {
        initialise()
    }, [])

    // useEffectAfterMount(() => {
    //     if (typeof chartConfigLoading === 'boolean' && !chartConfigLoading) {
    //         fetchDeploymentTemplate()
    //     }
    // }, [chartConfigLoading])

    useEffectAfterMount(() => {
        fetchDeploymentTemplate();
        // initialise()
    }, [selectedChart])

    async function fetchDeploymentTemplate() {
        setChartConfigLoading(true)
        try {
            const { result: { globalConfig: { defaultAppOverride, id, refChartTemplate, refChartTemplateVersion, isAppMetricsEnabled, chartRefId } } } = await getDeploymentTemplate(+appId, selectedChart.id)
            setTemplate(defaultAppOverride)
            setChartConfig({ id, refChartTemplate, refChartTemplateVersion, chartRefId })
            toggleAppMetrics(isAppMetricsEnabled)
            setTempFormData(JSON.stringify(defaultAppOverride, null, 2))
        }
        catch (err) {
            showError(err);
        }
        finally {
            setChartConfigLoading(false)
            if (appMetricsLoading) {
                setAppMetricsLoading(false)
            }
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!obj) {
            toast.error(error)
            return
        }
        if (chartConfig.id) {
            //update flow, might have overridden
            toggleConfirmation(true)
        }
        else save()
    }

    async function save() {
        setLoading(true)
        try {
            let requestBody = {
                ...(chartConfig.chartRefId === selectedChart.id ? chartConfig : {}),
                appId: +appId,
                chartRefId: selectedChart.id,
                valuesOverride: obj,
                defaultAppOverride: template,
                isAppMetricsEnabled
            }
            const api = chartConfig.id ? updateDeploymentTemplate : saveDeploymentTemplate
            const { result } = await api(requestBody)
            fetchDeploymentTemplate();
            respondOnSuccess();
            toast.success(
                <div className="toast">
                    <div className="toast__title">{chartConfig.id ? 'Updated' : 'Saved'}</div>
                    <div className="toast__subtitle">Changes will be reflected after next deployment.</div>
                </div>
            )
        }
        catch (err) {
            showError(err)
        }
        finally {
            setLoading(false)
            toggleConfirmation(false)
        }
    }
    return (
        <>
            <form action="" className="p-0 white-card white-card__deployment-config br-0 bw-0" onSubmit={handleSubmit}>
                <div className="p-12 flex left content-space">
                    <ReactSelect options={chartVersions}
                        isMulti={false}
                        getOptionLabel={option => `Chart version ${option.version}`}
                        getOptionValue={option => `${option.id}`}
                        value={selectedChart}
                        components={{
                            IndicatorSeparator: null
                        }}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                boxShadow: 'none',
                                border: `solid 1px var(--N200)`,
                                width:'168px',
                                backgroundColor: '#f7fafc'
                            }),
                            option: (base, state) => {
                                return ({
                                    ...base,
                                    color: 'var(--N900)',
                                    backgroundColor: state.isFocused ? '#f7fafc' : 'white',
                                    fontSize: '12px',
                                })
                            },
                            menu: (base, state) =>{
                                return({
                                    ...base,
                                    width:'168px'
                                })
                            }
                        }}
                        onChange={(selected) => selectChart(selected as { id: number, version: string })}
                    />
                    <div className="pointer flex">
                        <File className="icon-dim-20"/>
                        <a rel="noreferrer noopener" className="ml-4 fs-13 cn-7" href={DOCUMENTATION.APP_CREATE_DEPLOYMENT_TEMPLATE} target="_blank">Readme</a>
                    </div>
                </div>
                <div className="form__row--code-editor-container">
                    <CodeEditor
                        value={tempFormData}
                        isDepConfig={true}
                        onChange={resp => { setTempFormData(resp) }}
                        mode="yaml"
                        loading={chartConfigLoading}>
                    </CodeEditor>
                </div>
            </form>
            {showConfirmation && <ConfirmationDialog>
                <ConfirmationDialog.Icon src={warningIcon} />
                <ConfirmationDialog.Body title="Retain overrides and update" />
                <p>Changes will only be applied to environments using default configuration.</p>
                <p>Environments using overriden configurations will not be updated.</p>
                <ConfirmationDialog.ButtonGroup>
                    <button type="button" className="cta cancel" onClick={e => toggleConfirmation(false)}>Cancel</button>
                    <button type="button" className="cta" onClick={e => save()}>{loading ? <Progressing /> : chartConfig.id ? 'Update' : 'Save'}</button>
                </ConfirmationDialog.ButtonGroup>
            </ConfirmationDialog>}
            {/* {chartVersions && selectedChart && appMetricsEnvironmentVariableEnabled &&
                <OptApplicationMetrics
                    currentVersion={selectedChart?.version}
                    onChange={e => saveAppMetrics(!isAppMetricsEnabled)}
                    opted={isAppMetricsEnabled}
                    loading={appMetricsLoading}
                />} */}
        </>
    )
}
