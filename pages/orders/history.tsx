import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import { ShopLayout } from "../../components/layout";
import { redirect } from 'next/dist/server/api-utils';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';

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
                <NextLink href={`/orders/${params.row.orderId}`} passHref>
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


interface Props {
    orders: IOrder[];
}

const HistoryPage:NextPage<Props> = ({orders}) => {

    console.log({orders})
    //id: indice + 1, paiod:true, fullname:'DAVoidd', orderID: 141414414
    const rows = orders.map((order, index) => ({
        id: index + 1,
        paid: order.isPaid,
        fullname: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id
    }))

  return (
    <ShopLayout title={"Historial de Ordenes"} pageDescription={"Historial de órdenes de compra del cliente"}>
        <Typography variant="h1" component="h1">Historial de Órdenes</Typography>

        <Grid  container className="fadeInp">
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



export const getServerSideProps: GetServerSideProps = async ({req}) => {

    const session:any = await getSession({req});

    if(!session) {
        return{
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false,
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage