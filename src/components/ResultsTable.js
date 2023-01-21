import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';


const columns = [
  {
    field: 'id',
    headerName: 'Video ID',
    width: 200,
  },
  {
    field: 'views',
    headerName: 'Views',
    width: 130
  },
  {
    field: 'estimatedMinutesWatched',
    headerName: 'Estimated Minutes Watched',
    width: 130
  },
  {
    field: 'subscribersGained',
    headerName: 'Subscribers Gained',
    width: 130
  },
  {
    field: 'female',
    headerName: '% female',
    width: 130
  },
  {
    field: 'male',
    headerName: '% male',
    width: 130
  },
  {
    field: 'countires',
    headerName: 'Countries',
    width: 130,
    valueGetter: (params) => JSON.stringify(params.row.countries),
  },
];

function ResultsTable({ data }) {
  return (
    <div className="ResultsTable" style={{ height: 800, width: '100%' }} >
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={20}
        rowsPerPageOptions={[20]}
      />
    </div> 
  );
}

ResultsTable.propTypes = {
  data: PropTypes.array.isRequired,
};

export default ResultsTable;
