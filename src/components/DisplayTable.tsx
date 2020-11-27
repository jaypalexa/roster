import { IconButton } from '@material-ui/core';
import { ArrowDownward, Delete, Edit, Search } from '@material-ui/icons';
import React, { useState } from 'react';
import DataTable, { IDataTableColumn } from 'react-data-table-component';
import { filterable } from 'utils';
import TableFilter from './TableFilter';

interface DisplayTableProps {
  columns: IDataTableColumn<any>[];
  data: any[];
  defaultSortField?: string | undefined;
  defaultSortAsc?: boolean | undefined;
  onRowClicked?: ((row: any, e: MouseEvent) => void) | undefined;
  onDeleteClicked?: ((row: any, e: MouseEvent) => void) | undefined;
  readOnly?: boolean | undefined;
}

export const DisplayTable: React.FC<DisplayTableProps> = ({columns, data, defaultSortField, defaultSortAsc, onRowClicked, onDeleteClicked, readOnly}) => {

  // const useStyles = makeStyles((theme: Theme) => 
  //   createStyles({
  //     ...sharedStyles(theme),
  //     tableFilter: {
  //       marginBottom: '1rem',
  //       [theme.breakpoints.down('sm')]: {
  //         marginRight: '1rem',
  //         width: '100%',
  //       },
  //     },
  //   })
  // );
  // const classes = useStyles();

  const columnsWithActions = (() => {
    if (!readOnly) {
      // prepend the Delete button column
      columns.unshift(
        {
          name: '',
          cell: (row: any) => 
          <div title='Delete'>
            <IconButton size='small' onClick={e => onDeleteClicked ? onDeleteClicked(row, e.nativeEvent) : null}><Delete /></IconButton>
          </div>,
          allowOverflow: true,
          button: true,
          width: '36px', // custom width for icon button
        }
      );
    }

    // prepend the View/Edit button column
    columns.unshift(
      {
        name: '',
        cell: (row: any) => 
          <div title={readOnly ? 'View' : 'Edit'}>
            <IconButton size='small' onClick={e => onRowClicked ? onRowClicked(row, e.nativeEvent) : null}>
              {readOnly ? <Search /> : <Edit />}
            </IconButton>
          </div>,
        allowOverflow: true,
        button: true,
        width: '36px', // custom width for icon button
      }
    ); 

    return columns;
  });
  const [filterText, setFilterText] = useState('');
  const filtered = data.filter(x => filterable(x).includes(filterText.toLowerCase()));

  return (
    <DataTable
      noHeader
      columns={columnsWithActions()}
      data={filtered}
      highlightOnHover
      sortIcon={<ArrowDownward />}
      defaultSortField={defaultSortField}
      defaultSortAsc={defaultSortAsc}
      onRowClicked={onRowClicked}
      pagination
      paginationPerPage={5}
      paginationRowsPerPageOptions={[5, 10, 25, 50]}
      dense
      subHeader
      subHeaderComponent={<TableFilter filterText={filterText} onChange={e => setFilterText(e.target.value)}/>}
    />
  );
};

export default DisplayTable;
