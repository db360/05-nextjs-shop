import { useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { getSession } from 'next-auth/react';

import { PayPalButtons } from "@paypal/react-paypal-js";

import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Link, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layout";
import { CartList, OrdenSummary } from "../../components/cart";
import { CreditScoreOutlined } from '@mui/icons-material';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { shopApi } from '../../api';

export type OrderResponseBody = {
    id: string;
    status:
        | "COMPLETED"
        | "SAVED"
        | "APPROVED"
        | "VOIDED"
        | "PAYER_ACTION_REQUIRED"
};

interface Props {
    order: IOrder;
}

const OrderPage:NextPage<Props> = ({order}) => {

    const router = useRouter();
    const {shippingAddress} = order;

    const [isPaying, setIsPaying] = useState(false)

    const onOrderCompleted = async( details:OrderResponseBody ) => {

        if(details.status !== 'COMPLETED') {
            return alert('No existe pago completado en Paypal');
        }

        setIsPaying(true);

        try {
            const { data } = await shopApi.post(`/orders/pay`, {
                transactionId: details.id,
                orderId: order._id
            });

            router.reload();


        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error');
        }
    }

  return (
    <ShopLayout title={`Resumen de la Orden Nº${order._id}`} pageDescription='Resumen final de la orden de compra de la tienda'>
        <Typography variant='h1' component='h1'>Order Nº: {order._id} </Typography>
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
            label="Pagada"
            variant="outlined"
            color="success"
            icon={<CreditScoreOutlined />}
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
                            <Box
                                display='flex'
                                justifyContent="center"
                                className="fadeIn"
                                sx={{display: isPaying ? 'flex': 'none'}}
                            >
                                <CircularProgress />
                            </Box>

                            <Box sx={{ display: isPaying ? 'none' : 'flex', flex:1}} flexDirection='column'>
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
                                    ):(
                                        <PayPalButtons
                                            createOrder={(data, actions) => {
                                                return actions.order.create({
                                                    purchase_units: [
                                                        {
                                                            amount: {
                                                                value: `${order.total}`,
                                                            },
                                                        },
                                                    ],
                                                });
                                            }}
                                            onApprove={(data, actions) => {
                                                return actions.order!.capture().then((details) => {
                                                    onOrderCompleted(details);
                                        // details devuelve el id con el estado de la transaccion id:'651651' intent: 'CAPTURE', links: 'url para confirmar'
                                                    // alert(`Transaction completed by ${name}`);
                                                });
                                            }}
                                        />
                                    )
                                }
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {

    const { id = '' } = query;
    const session:any = await getSession({ req });
    //Si no hay session
    if(!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false,
            }
        }
    }

    const order = await dbOrders.getOrderById( id.toString() );
    //Si no hay orden
    if( !order ) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    // Si el usuario de la sesion no es el mismo que el usuario de la orden
    if(order.user !== session.user._id) {
        return {
            redirect: {
                destination: '/orders/history',
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