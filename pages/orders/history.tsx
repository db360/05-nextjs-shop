import NextLink from 'next/link';
import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from "../../components/layout";

const cols:GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 100},
    {field: 'fullname', headerName: 'Nombre Completo', width: 300},
    {
        field: 'orden',
        headerName: 'Numero de Orden',
        description: 'Link Hacia la Orden de Compra',
        width: 200,
        sortable:false,
        renderCell: (params:GridValueGetterParams) => {
            return (
                <NextLink href={`/orders/${params.row.id}`} passHref>
                    <Link underline="always">
                        Ver Orden
                    </Link>
                </NextLink>

            )
        }
    },
    {
        field: 'paid',
        headerName: 'Estado',
        description: 'Muestra información, si la orden está pagada',
        width: 200,
        renderCell: (params:GridValueGetterParams) => {
            return (
                params.row.paid
                    ? <Chip color="success" label="Pagada" variant="outlined"/>
                    : <Chip color="error" label="No Pagada" variant="outlined"/>

            )
        }
    }
]

const rows = [
    { id: 1, paid: true, fullname: 'David Martinez'},
    { id: 2, paid: false, fullname: 'Juan Sombra'},
    { id: 3, paid: true, fullname: 'Patricia Dominguez'},
    { id: 4, paid: false, fullname: 'Ernest Tocamela'},
    { id: 5, paid: true, fullname: 'Ana Vázquez'},
]

const HistoryPage = () => {
  return (
    <ShopLayout title={"Historial de Ordenes"} pageDescription={"Historial de órdenes de compra del cliente"}>
        <Typography variant="h1" component="h1">Historial de Órdenes</Typography>

        <Grid  container>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    pageSize={10}
                    rowsPerPageOptions={ [10] }
                />


            </Grid>
        </Grid>

    </ShopLayout>
  )
}

export default HistoryPage