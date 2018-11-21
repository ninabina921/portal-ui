// @flow
import { REHYDRATE } from 'redux-persist/constants';

// Custom
import tableModels from '@ncigdc/tableModels';
import { namespaceActions } from './utils';

/*----------------------------------------------------------------------------*/

const tableColumns = namespaceActions('tableColumns', [
  'TOGGLE_COLUMN',
  'RESTORE',
  'SET',
]);

const toggleColumn = ({ entityType, id, index }) => ({
  type: tableColumns.TOGGLE_COLUMN,
  payload: { entityType, id, index },
});

const restoreColumns = entityType => ({
  type: tableColumns.RESTORE,
  payload: { entityType },
});

const setColumns = ({ entityType, order }) => ({
  type: tableColumns.SET,
  payload: { entityType, order },
});

// Store ids of table items that are not hidden by default
// const reduceColumns = (acc, x) => [...acc, ...(!x.hidden ? [x.id] : [])];

const initialState = Object.keys(tableModels).reduce(
  (acc, key) => ({
    ...acc,
    [key]: tableModels[key],
  }),
  { version: 3 }
);

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const { version, ...tableColumns } = action.payload.tableColumns || {};
      if (version !== state.version) {
        return state;
      }
      return {
        ...state,
        ...Object.entries(
          tableColumns || {}
        ).reduce((acc, [key, val]: [string, any]) => {
          const orderArray = val.map(v => v.id);
          let order = Array.isArray(val)
            ? state[key]
                .slice()
                .sort(
                  (a, b) => orderArray.indexOf(a.id) - orderArray.indexOf(b.id)
                )
            : state[key];
          order.forEach((element, i) => {
            order[i].hidden = val[i].hidden;
          });
          return {
            ...acc,
            [key]: order,
          };
        }, {}),
      };
    }

    case tableColumns.TOGGLE_COLUMN: {
      const { entityType, index } = action.payload;
      return {
        ...state,
        [entityType]: [
          ...state[entityType].slice(0, index),
          {
            ...state[entityType][index],
            hidden: !state[entityType][index].hidden,
          },
          ...state[entityType].slice(index + 1, Infinity),
        ],
      };
    }

    case tableColumns.RESTORE: {
      const { entityType } = action.payload;
      return {
        ...state,
        [entityType]: initialState[entityType],
      };
    }

    case tableColumns.SET: {
      const { entityType, order } = action.payload;
      return { ...state, [entityType]: order.slice() };
    }

    default:
      return state;
  }
};

/*----------------------------------------------------------------------------*/

export { toggleColumn, restoreColumns, setColumns };
export default reducer;
