import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";

import { AdminLayout } from "../../../components/layout";
import { CartList, OrdenSummary } from "../../../components/cart";
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '../../../database';
import { IOrder } from '../../../interfaces';


interface Props {
    order: IOrder;
}

const OrderPage:NextPage<Props> = ({order}) => {

    const {shippingAddress} = order;


  return (
    <AdminLayout
        title={'Resumen de la Orden'}
        subTitle={`Orden ID: ${order._id}`}
    >
        {
            order.isPaid
            ? (
                <Chip
                    sx={{my: 2}}
                    label="Pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                />
            ):
            (
                <Chip
                    sx={{my: 2}}
                    label="Pendiente de Pago"
                    variant="outlined"
                    color="error"
                    icon={<CreditCardOffOutlined />}
                />
            )
        }

        <Grid container className="fadeIn">
            <Grid item xs={12} sm={7}>
                <CartList editable={false} products={order.orderItems}/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography
                            variant='h2'
                        >Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'Productos' : 'Producto'})
                        </Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent="space-between">
                            <Typography variant='subtitle1'>Dirección de Entrega</Typography>
                            <NextLink href="/checkout/address" passHref>
                                <Link underline="always">
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                        <Typography>{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                        <Typography>{shippingAddress.city}, {shippingAddress.zip}</Typography>
                        <Typography>{shippingAddress.country}</Typography>
                        <Typography>{shippingAddress.phone}</Typography>
                        <Divider sx={{my: 1}}/>

                        <OrdenSummary orderValues={{
                            numberOfItems: order.numberOfItems,
                            subTotal: order.subTotal,
                            total: order.total,
                            tax: order.tax,
                        }}/>

                        <Box sx={{mt: 3}} display='flex' flexDirection='column'>
                            {/* TODO: */}

                            <Box display="flex" flexDirection='column'>
                                {
                                    order.isPaid
                                    ? (
                                        <Chip
                                            sx={{my: 2, flex: 1}}
                                            label="Pagada"
                                            variant="outlined"
                                            color="success"
                                            icon={<CreditScoreOutlined />}
                                        />
                                    ):(
                                        <Chip
                                            sx={{my: 2, flex: 1}}
                                            label="Pendiente de PAgo"
                                            variant="outlined"
                                            color="error"
                                            icon={<CreditCardOffOutlined />}
                                        />
                                    )
                                }
                            </Box>

                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </AdminLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const { id = '' } = query;
    const order = await dbOrders.getOrderById( id.toString() );

    //Si no hay orden
    if( !order ) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage;