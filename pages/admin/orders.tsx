import { ConfirmationNumberOutlined } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid'
import useSWR from 'swr';
import { AdminLayout  } from '../../components/layout'

import { IOrder, IUser } from '../../interfaces';

const cols:GridColDef[] = [
  {field: 'id', headerName: 'Orden ID', width: 250},
  {field: 'email', headerName: 'Correo', width: 250},
  {field: 'name', headerName: 'Nombre Completo', width: 200},
  {field: 'total', headerName: 'Total', width: 100},
  {
    field: 'isPaid',
    headerName: 'Pagada',
    renderCell: ({ row }:GridValueGetterParams) => {
      return row.isPaid
        ? (<Chip variant='outlined' label='Pagada' color='success'/>)
        : (<Chip variant='outlined' label='Pendiente' color='error'/>)
    }
  },
  {field: 'noProducts', headerName: 'Nº Productos', align: 'center'},
  {
    field: 'check',
    headerName: 'Ver Orden',
    renderCell: ({ row }:GridValueGetterParams) => {
      return (
        <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
          Ver Orden
        </a>
      )
    }
  },
  { field: 'createdAt', headerName: 'Creada en', width: 150},
];

const OrdersPage = () => {

  const {data, error} = useSWR<IOrder[]>('/api/admin/orders');

  if( !data && !error ) return (<></>);

  const rows = data!.map( order => ({
      id: order._id,
      email: (order.user as IUser).email,
      name: (order.user as IUser).name,
      total: order.total,
      isPaid: order.isPaid,
      noProducts: order.numberOfItems,
      createdAt: order.createdAt,
  }));

  return (
    <AdminLayout
        title={'Ordenes'}
        subTitle={'Mantenimiento de Órdenes'}
        icon={<ConfirmationNumberOutlined />}
    >
      <Grid  container className="fadeInp" sx={{width: '100%'}}>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    pageSize={10}
                    rowsPerPageOptions={ [10] }
                />


            </Grid>
        </Grid>
    </AdminLayout>
  )
}

export default OrdersPage