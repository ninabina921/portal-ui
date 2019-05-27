// @flow
/* eslint-disable */
import React, { ReactNode } from 'react';
/* eslint-enable */
import { compose, withState, withProps } from 'recompose';
import {
  map, groupBy, reduce, filter,
} from 'lodash';
import { Row, Column } from '@ncigdc/uikit/Flex';
import Button from '@ncigdc/uikit/Button';
import { visualizingButton } from '@ncigdc/theme/mixins';
import EditableLabel from '@ncigdc/uikit/EditableLabel';
import { Th, Tr } from '@ncigdc/uikit/Table';

const styles = {
  button: {
    ...visualizingButton,
    minWidth: 100,
  },
  horizonalPadding: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};

const initialName = (arr: string[], prefix: string) => {
  /* @arr is the list of names
     @ prefix is the prefix for the name
     This function is to generate initial name for new file/list/element name.
     e.g: if the arr is["new name 1", "new name 3", "apple", "banana"], prefix is "new name ".
     Then the return value will be "new name 2".
     */
  const numberSet = new Set(arr);
  for (let i = 1; i <= arr.length + 1; i += 1) {
    if (!numberSet.has(prefix + i)) {
      return prefix + i;
    }
  }
  return prefix + arr.length + 1;
};
// type TOption = {
//   name: string,
// };

interface IBinProps {
  key: string,
  /* eslint-disable */
  doc_count: number,
  /* eslint-enable */
  groupName: string,
}

interface IContinuousIntervalProps {
  amount: string | number,
  min: string | number,
  max: string | number,
};

interface IEventTargetProps {
  id: string,
  value: string | number,
};

interface ISelectedBinsProps {
  [x: string]: boolean
}

interface IContinuousManualRowsProps {
  name: string,
  min: number,
  max: number,
};

interface IBinsProps { [x: string]: IBinProps }
interface IGroupValuesModalProps {
  binGrouping: () => void,
  currentBins: IBinsProps,
  setCurrentBins: (currentBins: IBinsProps) => void,
  onUpdate: (bins: IBinsProps) => void,
  onClose: () => void,
  fieldName: string,
  selectedHidingBins: ISelectedBinsProps,
  setSelectedHidingBins: (selectedHidingBins: ISelectedBinsProps) => void,
  selectedGroupBins: ISelectedBinsProps,
  setSelectedGroupBins: (selectedGroupBins: ISelectedBinsProps) => void,
  editingGroupName: string,
  setEditingGroupName: (editingGroupName: string) => void,
  children?: ReactNode,
  warning: string,
  setWarning: (warning: string) => void,
  plotType: string,
  continuousAvailableBins: IBinsProps,
  setContinuousManualRows: ([]) => void,
  continuousManualRows: [],
  setContinuousInterval: (continuousInterval: IContinuousIntervalProps) => void,
  continuousInterval: IContinuousIntervalProps,
  continuousQuartile: number,
  continuousMin: number,
  continuousMax: number,
  selectedContinuousMethod: string,
  setSelectedContinuousMethod: (selectedContinuousMethod: string) => void,
  bins: any,
};

const blockStyle = {
  height: '500px',
  margin: '20px',
  padding: '20px',
  width: '40%',
};

const listStyle = {
  borderRadius: '2px',
  borderStyle: 'inset',
  borderWidth: '2px',
  height: '100%',
  overflow: 'scroll',
};

const backgroundStyle = {
  padding: '0 20px 20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '5px',
  width: '100%',
};

const continuousIntervalInputStyle = {
  padding: '5px',
  width: '100px',
  margin: '0 10px',
};

const defaultContinuousManualRow = {
  name: '',
  min: 0,
  max: 0,
};

const defaultContinuousManualRowDisplay = Array(5).fill(defaultContinuousManualRow);

const buttonStyle = {
  float: 'right',
  margin: '10px 2px 10px 3px',
}
export default compose(
  withState('editingGroupName', 'setEditingGroupName', ''),
  withState('currentBins', 'setCurrentBins', ({ bins }: { bins: IBinsProps }) => bins),
  withState('selectedHidingBins', 'setSelectedHidingBins', {}),
  withState('selectedGroupBins', 'setSelectedGroupBins', {}),
  withState('continuousManualRows', 'setContinuousManualRows', defaultContinuousManualRowDisplay),
  withState('selectedContinuousMethod', 'setSelectedContinuousMethod', 'interval'),
  withProps(({
    continuousAvailableBins,
    plotType,
  }: any) => {
    const values = plotType === 'continuous' ? Object.keys(continuousAvailableBins).map(n => Number(n)).sort((a,b) => a - b) : [];
    const continuousMin = values.length ? values[0] : 0;
    const continuousMax = values.length ? values[values.length - 1] : 0;
    const quartileWithDecimals = (continuousMax - continuousMin) / 4;
    const continuousQuartile = quartileWithDecimals.toFixed(2);

    return ({
      continuousMin,
      continuousMax,
      continuousQuartile,
    });
  }),
  withState('continuousInterval', 'setContinuousInterval', (props:IGroupValuesModalProps) => ({
    amount: props.continuousQuartile,
    min: props.continuousMin,
    max: props.continuousMax,
  })),
  withState('warning', 'setWarning', ''),
  withProps(({
    currentBins,
    selectedGroupBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedHidingBins,
  }: any) => ({
    binGrouping: () => {
      const newGroupName = initialName(
        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
      );
      setEditingGroupName(newGroupName);
      setCurrentBins({
        ...currentBins,
        ...reduce(selectedGroupBins, (acc, val, key) => {
          if (val) {
            return {
              ...acc,
              [key]: {
                ...currentBins[key],
                groupName: newGroupName,
              },
            };
          }
          return acc;
        }, {}),
      });
      setSelectedHidingBins({});
    },
  }))
)(
  ({
    bins,
    binGrouping,
    currentBins,
    editingGroupName,
    fieldName,
    onClose,
    onUpdate,
    selectedGroupBins,
    selectedHidingBins,
    setCurrentBins,
    setEditingGroupName,
    setSelectedGroupBins,
    setSelectedHidingBins,
    setWarning,
    warning,
    plotType,
    continuousAvailableBins,
    setContinuousManualRows,
    continuousManualRows,
    continuousInterval,
    setContinuousInterval,
    continuousMin,
    continuousMax,
    continuousQuartile,
    setSelectedContinuousMethod,
    selectedContinuousMethod,
  }: IGroupValuesModalProps) => {
    const groupNameMapping = groupBy(
      Object.keys(currentBins)
        .filter((bin: string) => currentBins[bin].groupName !== ''),
      key => currentBins[key].groupName
    );

    const updateContinuousInterval = (target: IEventTargetProps) => {
      validateContinuousFieldsProps(target);
      const key = target.id.split('-')[2];
      const value = Number(target.value);
      const nextContinuousInterval = {
        ...continuousInterval, 
        [key]: value,
      };
      setContinuousInterval(nextContinuousInterval);
    };

    const validateContinuousFieldsProps = (target: IEventTargetProps) => {
      const inputValue = Number(target.value);
      const inputId = target.id;

      if (inputId.includes('interval-amount')) {
        const intervalError = inputValue > (continuousMax - continuousMin + 1);
        console.log('intervalError', intervalError);
        return;
      }

      if (inputId.includes('manual')) {
        const overlapError = continuousManualRows.some((row: IContinuousManualRowsProps) => inputValue >= row.min && inputValue <= row.max);
        console.log('overlapError', overlapError);
      }

      if (inputId.includes('min')) {
        const minError = inputValue < continuousMin;
        console.log('minError', minError);
        // const idRoot = inputId.split('min');
        // const minMaxError = checkMinMax(idRoot); 
        // console.log('minMaxError', minMaxError);
      }

      if (inputId.includes('max')) {
        const maxError = inputValue > continuousMax;
        console.log('maxError', maxError);
        // const idRoot = inputId.split('max');
        // const minMaxError = checkMinMax(idRoot); 
        // console.log('minMaxError', minMaxError);
      }
    };

    return (
      <Column style={{padding: '20px'}}>
        <h1 style={{ marginTop: 0 }}>
          {`Create Custom Bins: ${fieldName}`}
        </h1>
        {plotType === 'continuous' ? 
          (<div>
            <p>Available values from <strong>{continuousMin}</strong> to <strong>{continuousMax}</strong></p>
            <p>Quartile bin interval: <strong>{continuousQuartile}</strong></p>
            <p>Configure your bins then click <strong>Save Bins</strong> to update the analysis plots.</p>
          </div>)
          : <p>Organize values into groups of your choosing. Click <strong>Save Bins</strong> to update the analysis plots.</p>
        }
        {plotType === 'continuous' ? 
        (
          <Row>
            <Column style={backgroundStyle} className="continuous">
              <h3>Define bins by:</h3>

              <div className="continuous-interval-binning" style={{marginBottom: '15px'}}>
                <input 
                  type="radio" 
                  id="continuous-radio-interval"
                  name="continuous-radio" 
                  value="interval"
                  style={{ marginRight: '15px'}} 
                  onClick={() => {
                    setSelectedContinuousMethod('interval');
                  }}
                  defaultChecked={selectedContinuousMethod === 'interval'}
                />
                <label htmlFor="continuous-radio-interval">Bin interval:</label>
                  <input 
                    id="continuous-interval-amount" 
                    type="number" 
                    aria-label="bin interval" 
                    style={{
                      ...continuousIntervalInputStyle, 
                      background: selectedContinuousMethod === 'interval' ? '#fff' : '#efefef',
                    }}
                    onChange={e => {
                      updateContinuousInterval(e.target);
                    }}
                    value={continuousInterval.amount}
                    disabled={selectedContinuousMethod !== 'interval'}
                  />
                <span>limit values from</span>
                <input 
                  id="continuous-interval-min" 
                  type="number" 
                  aria-label="lower limit" 
                  style={{
                    ...continuousIntervalInputStyle, 
                    background: selectedContinuousMethod === 'interval' ? '#fff' : '#efefef',
                  }}
                  onChange={e => {
                    updateContinuousInterval(e.target);
                  }}
                  value={continuousInterval.min}
                  disabled={selectedContinuousMethod !== 'interval'}
                />
                <span>to</span>
                <input 
                  id="continuous-interval-max" 
                  type="number" 
                  arial-label="upper limit"
                  style={{
                    ...continuousIntervalInputStyle, 
                    background: selectedContinuousMethod === 'interval' ? '#fff' : '#efefef',
                  }}
                  onChange={e => {
                    updateContinuousInterval(e.target);
                  }}
                  value={continuousInterval.max}
                  disabled={selectedContinuousMethod !== 'interval'}
                />
              </div>

              <div className="continuous-manual-binning">
                <div style={{marginBottom: '15px'}}>
                  <input 
                    type="radio" 
                    id="continuous-radio-manual"
                    name="continuous-radio" 
                    value="manual"
                    style={{ marginRight: '15px'}} 
                    onClick={() => {
                      setSelectedContinuousMethod('manual');
                    }}
                    defaultChecked={selectedContinuousMethod === 'manual'}
                  />
                  <label htmlFor="continuous-radio-manual">Manually</label>
                </div>
                <table style={{marginBottom: '20px', width: '100%'}}>
                  <thead>
                    <tr>
                      <Th scope="col" id="continuous-manual-label-name">Bin Name</Th>
                      <Th scope="col" id="continuous-manual-label-min">From</Th>
                      <Th scope="col" id="continuous-manual-label-max">To</Th>
                      <Th scope="col">Remove</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {continuousManualRows.map((row, rowIndex) => (
                      <Tr key={`manual-row-${rowIndex}`} index={rowIndex}>
                        {Object.keys(row).map(inputKey => (
                          <td key={`manual-row-${rowIndex}-${inputKey}`} style={{padding: '5px'}}>
                            <input 
                              id={`manual-row-${rowIndex}-${inputKey}`} type={inputKey === 'name' ? 'text' : 'number'} onChange={e => {
                                validateContinuousFieldsProps(e.target);
                                const inputValue = e.target.value;
                                const nextContinuousManualRows = continuousManualRows.map((contRow, contRowIndex) => contRowIndex === rowIndex
                                  ? Object.assign(
                                    {},
                                    contRow,
                                    { [inputKey]: inputValue }
                                  ) : contRow
                                );
                                setContinuousManualRows(nextContinuousManualRows)
                              }}
                              value={continuousManualRows[rowIndex][inputKey]}
                              aria-labelledby={`continuous-manual-label-${inputKey}`}
                              style={{
                                width: '100%',
                                padding: '5px',
                                background: selectedContinuousMethod === 'manual' ? '#fff' : '#efefef',
                              }}
                              disabled={selectedContinuousMethod !== 'manual'}
                            />
                          </td>
                        ))}
                        <td>
                          <Button onClick={() => {
                              const nextContinuousManualRows = continuousManualRows.filter((filterRow, filterRowIndex) => filterRowIndex !== rowIndex);
                              setContinuousManualRows(nextContinuousManualRows);
                            }}
                            aria-label="Remove"
                            style={{margin: '0 auto'}}
                            disabled={selectedContinuousMethod !== 'manual'}
                          >
                            <i className="fa fa-trash" aria-hidden="true" />
                          </Button>
                        </td>
                      </Tr>
                    ))}
                  </tbody>
                </table>
                <Button onClick={() => {
                    const nextContinuousManualRows = [
                      ...continuousManualRows, 
                      defaultContinuousManualRow,
                    ];
                    setContinuousManualRows(nextContinuousManualRows);
                  }}
                  style={{
                    ...styles.button, 
                    maxWidth: '100px', 
                    marginLeft: 'auto', 
                    display: 'flex',
                    background: selectedContinuousMethod !== 'manual' ? '#ccc' : '#fff',
                  }}
                  disabled={selectedContinuousMethod !== 'manual'}
                >
                  <i className="fa fa-plus-circle" aria-hidden="true" /> &nbsp; Add
                </Button>
              </div>
            </Column>
          </Row>
        ) : 
        (<Row style={{ justifyContent: 'center' }}>
          <Column style={blockStyle}>
            <h3 style={{paddingBottom: '6px'}}>Hiding Values</h3>
            <Column style={listStyle}>
              {Object.keys(currentBins)
                .filter((binKey: string) => currentBins[binKey].groupName === '')
                .map((binKey: string) => (
                  <Row
                    key={binKey}
                    onClick={() => {
                      if (Object.keys(selectedGroupBins).length > 0) {
                        setSelectedGroupBins({});
                      }
                      setSelectedHidingBins({
                        ...selectedHidingBins,
                        [binKey]: !selectedHidingBins[binKey],
                      });
                    }}
                    style={{
                      backgroundColor: selectedHidingBins[binKey] ? '#d5f4e6' : '',
                      paddingLeft: '10px',
                    }}
                    >
                    {binKey}
                  </Row>
                ))}
            </Column>
          </Column>
          <Column style={{ justifyContent: 'center' }} >
            <Button
              disabled={Object.values(selectedHidingBins).every(value => !value)}
              onClick={() => {
                setCurrentBins({
                  ...currentBins,
                  ...reduce(selectedHidingBins, (acc, val, key) => {
                    if (val) {
                      const newGroupName = initialName(
                        Object.values(currentBins).map((bin: IBinProps) => bin.groupName), 'selected Value '
                      );
                      setEditingGroupName(newGroupName);
                      return {
                        ...acc,
                        [key]: {
                          ...currentBins[key],
                          groupName: newGroupName,
                        },
                      };
                    }
                    return acc;
                  }, {}),
                });
                setSelectedHidingBins({});
              }}
              style={{ margin: '10px' }}
              >
              {'>>'}
            </Button>
            <Button
              disabled={Object.values(selectedGroupBins).every(value => !value)}
              onClick={() => {
                if (filter(selectedGroupBins, Boolean).length ===
                  Object.keys(filter(currentBins, (bin: IBinProps) => !!bin.groupName)).length) {
                  setWarning('Leave at least one bin.');
                  return;
                }
                setCurrentBins({
                  ...currentBins,
                  ...reduce(selectedGroupBins, (acc, val, key) => {
                    if (val) {
                      return {
                        ...acc,
                        [key]: {
                          ...currentBins[key],
                          groupName: '',
                        },
                      };
                    }
                    return acc;
                  }, {}),
                });
                setSelectedGroupBins({});
              }}
              style={{ margin: '10px' }}
              >
              {'<<'}
            </Button>
          </Column>
          <Column style={blockStyle}>
            <Row style={{ justifyContent: 'space-between' }}>
              <span style={{
                alignItems: 'flex-end',
                display: 'flex',
              }}
              >
                Displayed Values

              </span>
              <Row>
                <Button
                  onClick={() => {
                    setCurrentBins({
                      ...reduce(currentBins, (acc, val, key) => {
                        return {
                          ...acc,
                          [key]: {
                            ...currentBins[key],
                            groupName: key,
                          },
                        };
                      }, {}),
                    });
                    setSelectedGroupBins({});
                  }}
                  style={buttonStyle}
                >
                  {'Reset'}
                </Button>
                <Button
                  disabled={Object
                    .keys(selectedGroupBins)
                    .filter(key => selectedGroupBins[key])
                    .every(key => currentBins[key].groupName === key)}
                  onClick={() => {
                    setCurrentBins({
                      ...currentBins,
                      ...reduce(selectedGroupBins, (acc, val, key) => {
                        if (val) {
                          return {
                            ...acc,
                            [key]: {
                              ...currentBins[key],
                              groupName: key,
                            },
                          };
                        }
                        return acc;
                      }, {}),
                    });
                    setSelectedGroupBins({});
                  }}
                  style={buttonStyle}
                >
                  {'Ungroup'}
                </Button>
                <Button
                  disabled={Object.values(selectedGroupBins).filter(Boolean).length < 2}
                  onClick={binGrouping}
                  style={buttonStyle}
                >
                  {'Group'}
                </Button>
              </Row>
            </Row>
            <Column style={listStyle}>
              {map(
                groupNameMapping,
                (group: string[], groupName: string) => (
                  <Column key={groupName}>
                    <Row
                      key={groupName}
                      onClick={() => {
                        if (Object.keys(selectedHidingBins).length > 0) {
                          setSelectedHidingBins({});
                        }
                        setSelectedGroupBins({
                          ...selectedGroupBins,
                          ...group.reduce((acc: ISelectedBinsProps, binKey: string) => ({
                            ...acc,
                            [binKey]: !group.every(
                              (binsWithSameGroupNameKey: string) => selectedGroupBins[binsWithSameGroupNameKey]
                            ),
                          }), {}),
                        });
                      }}
                      style={{ backgroundColor: group.every((binKey: string) => selectedGroupBins[binKey]) ? '#d5f4e6' : '' }}
                      >
                      {group.length > 1 || group[0] !== groupName
                        ? (
                          <EditableLabel
                            containerStyle={{ justifyContent: 'flex-start' }}
                            handleSave={(value: string) => setCurrentBins({
                              ...currentBins,
                              ...group.reduce((acc: ISelectedBinsProps, bin: string) => ({
                                ...acc,
                                [bin]: {
                                  ...currentBins[bin],
                                  groupName: value,
                                },
                              }), {}),
                            })
                            }
                            iconStyle={{
                              cursor: 'pointer',
                              fontSize: '1.8rem',
                              marginLeft: 10,
                            }}
                            isEditing={editingGroupName === groupName}
                            pencilEditingOnly
                            text={groupName}
                          >
                            {groupName}
                          </EditableLabel>
                        ) : currentBins[group[0]].key + ' (' + currentBins[group[0]].doc_count + ')'}
                    </Row>
                    {group.length > 1 || group[0] !== groupName
                      ? group.map((bin: string) => (
                        <Row
                          key={bin}
                          onClick={() => setSelectedGroupBins({
                            ...selectedGroupBins,
                            [bin]: !selectedGroupBins[bin],
                          })}
                          style={{
                            backgroundColor: selectedGroupBins[bin] ? '#d5f4e6' : '',
                            paddingLeft: '10px',
                          }}
                        >
                          {bin + ' (' + currentBins[bin].doc_count + ')'}
                        </Row>
                      ))
                      : null}
                  </Column>
                )
              )}
            </Column>
          </Column>
        </Row>
        <Row
          spacing="1rem"
          style={{
            justifyContent: 'flex-end',
            margin: '20px',
          }}
          >
          <span style={{
            color: 'red',
            justifyContent: 'flex-start',
            visibility: warning.length > 0 ? 'visible' : 'hidden',
          }}
                >
            {`Warning: ${warning}`}
          </span>
          <Button
            onClick={onClose}
            style={styles.button}
            >
            Cancel
          </Button>
          <Button
            onClick={() => onUpdate(currentBins)}
            style={styles.button}
            >
            Save Bins
          </Button>
        </Row>
      </Column >
    );
  }
);