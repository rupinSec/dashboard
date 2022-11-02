import React, { useEffect, useState } from 'react'
import { ReactComponent as CaretIcon } from '../../assets/icons/ic-chevron-down.svg'
import { MODES } from '../../config'
import CodeEditor from '../CodeEditor/CodeEditor'
import { getCIConfigDiffValues } from './CIConfig.utils'
import { CIConfigDiffType } from './types'

export function CIBuildConfigDiff({
    _configOverridenWorkflows,
    wfId,
    configOverridenPipelines,
    materials,
    globalCIConfig,
}) {
    const [showOverrides, setShowOverrides] = useState(false)
    const [ciConfigDiffValues, setCIConfigDiffValues] = useState<CIConfigDiffType[]>([])

    useEffect(() => {
        if (_configOverridenWorkflows && configOverridenPipelines) {
            const _currentWorkflow = _configOverridenWorkflows.find((_wf) => +wfId === _wf.id)
            const _currentPipelineOverride = configOverridenPipelines.find(
                (_ci) => _currentWorkflow.ciPipelineId === _ci.id,
            )?.dockerConfigOverride
            setCIConfigDiffValues(getCIConfigDiffValues(globalCIConfig, _currentPipelineOverride, materials))
        }
    }, [_configOverridenWorkflows, configOverridenPipelines, globalCIConfig])
    const renderDetailedValue = (parentClassName: string, value: string): JSX.Element => {
        return (
            <td className={`${parentClassName} cn-9 fs-13 fw-4 lh-20 pt-8 pb-8 pl-16 pr-16 dc__ellipsis-right`}>
                {value}
            </td>
        )
    }

    const renderValueDiff = (value: CIConfigDiffType, isLastItem?: boolean): JSX.Element => {
        const { baseValue, overridenValue, changeBGColor, configName, showInEditor } = value
        const borderClass = isLastItem ? 'dc__border-right' : 'dc__border-right dc__border-bottom-n1'
        const lastColumnClass = isLastItem ? '' : 'dc__border-bottom-n1'
        return (
            <tr>
                <td className={`fs-13 fw-4 lh-20 cn-7 pt-8 pb-8 pl-16 pr-16 dc__ellipsis-right ${borderClass}`}>
                    {configName}
                </td>
                {showInEditor ? (
                    <td colSpan={2}>
                        <CodeEditor
                            defaultValue={baseValue}
                            value={overridenValue}
                            mode={MODES.DOCKERFILE}
                            height="300px"
                            readOnly={true}
                            diffView={true}
                            noParsing
                        />
                    </td>
                ) : (
                    <>
                        {baseValue ? (
                            renderDetailedValue(
                                `${borderClass} ${changeBGColor ? 'code-editor-red-diff' : ''}`,
                                baseValue,
                            )
                        ) : (
                            <td className={borderClass} />
                        )}
                        {overridenValue ? (
                            renderDetailedValue(
                                `${lastColumnClass} ${changeBGColor ? 'code-editor-green-diff' : ''}`,
                                overridenValue,
                            )
                        ) : (
                            <td className={lastColumnClass} />
                        )}
                    </>
                )}
            </tr>
        )
    }

    const renderHeader = () => {
        return (
            <tr>
                <th className="fs-12 fw-6 lh-20 cn-7 pt-8 pb-8 pl-16 pr-16 dc__border-right dc__border-bottom dc__uppercase">
                    Build Configs
                </th>
                <th className="fs-12 fw-6 lh-20 cn-7 pt-8 pb-8 pl-16 pr-16 dc__border-right dc__border-bottom dc__uppercase">
                    Basic
                </th>
                <th className="fs-12 fw-6 lh-20 cn-7 pt-8 pb-8 pl-16 pr-16 dc__border-bottom dc__uppercase">
                    Overriden
                </th>
            </tr>
        )
    }

    const toggleOverridesVisibility = () => {
        setShowOverrides(!showOverrides)
    }

    const lastIndex = ciConfigDiffValues.length - 1
    return (
        <div className="dc__border dc__bottom-radius-4">
            {showOverrides && (
                <table className="config-override-diff__values w-100">
                    {renderHeader()}

                    {ciConfigDiffValues.map((val, idx) => {
                        if (val.baseValue || val.overridenValue) {
                            return renderValueDiff(val, lastIndex === idx)
                        }
                    })}
                </table>
            )}
            <div
                className={`flex right p-10 bcn-0 cursor dc__bottom-radius-4 fs-13 fw-4 lh-20 ${
                    showOverrides ? 'dc__border-top' : ''
                }`}
                onClick={toggleOverridesVisibility}
            >
                {showOverrides ? 'Hide Overrides' : 'Show Overrides'}
                <CaretIcon
                    className="icon-dim-20 fcn-6 rotate ml-4"
                    style={{
                        ['--rotateBy' as any]: showOverrides ? '-180deg' : '0deg',
                    }}
                />
            </div>
        </div>
    )
}
