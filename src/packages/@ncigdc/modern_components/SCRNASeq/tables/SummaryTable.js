import React from 'react';

import EntityPageHorizontalTable from '@ncigdc/components/EntityPageHorizontalTable';

const SummaryTable = ({ header, rows }) => (
  <div className="scrnaseq-card" key={header}>
    <h2
      style={{
        margin: '0 0 10px 0',
        width: '100%',
      }}
      >
      {header}
    </h2>
    <EntityPageHorizontalTable
      data={rows.map(([key, value]) => ({
        key,
        value,
      }))}
      headings={[
        {
          key: 'key',
          tdStyle: {
            whiteSpace: 'normal',
          },
        },
        {
          key: 'value',
          tdStyle: {
            textAlign: 'right',
            whiteSpace: 'normal',
          },
        },
      ]}
      showHeadings={false}
      tableContainerStyle={{ width: '100%' }}
      />
  </div>
);

export default SummaryTable;
