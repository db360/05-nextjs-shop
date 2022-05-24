import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import Cookies from 'js-cookie';

import { CartContext } from '../../context';
import { ShopLayout } from "../../components/layout";
import { CartList, OrdenSummary } from "../../components/cart";
// import { countries } from '../../utils';

const SummaryPage = () => {

    const router = useRouter();
    const {shippingAddress, numberOfItems, createOrder} = useContext(CartContext)

    useEffect(() => {
      if( !Cookies.get('firstName')) {
        router.push('/checkout/address')
      }
    }, [router]);

    const onCreateOrder = () => {
        createOrder();
    }


    if(!shippingAddress) {
        return <></>;
    }

    const { firstName, lastName, address, address2 = '', city, country, phone, zip } = shippingAddress;

  return (
    <ShopLayout title='Resumen de Compra' pageDescription='Resumen de la orden de compra de la tienda'>
        <Typography variant='h1' component='h1'>Resumen de su Orden</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable={false}/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems === 1 ? 'producto' : 'productos'})</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent="space-between">
                            <Typography variant='subtitle1'>Dirección de Entrega</Typography>
                            <NextLink href="/checkout/address" passHref>
                                <Link underline="always">
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography>{firstName} {lastName}</Typography>
                        <Typography>{address} {address2 ? `, ${address2}` : ''}</Typography>
                        <Typography>{city}, {zip}</Typography>
                        {/* <Typography>{countries.find( c => c.code === country)?.name}</Typography> */}
                        <Typography>{country}</Typography>
                        <Typography>{phone}</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent="end">
                            <NextLink href="/cart" passHref>
                                <Link underline="always">
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrdenSummary />

                        <Box sx={{mt: 3}}>
                            <Button
                                onClick={onCreateOrder}
                                color='secondary'
                                className='circular-btn'
                                fullWidth
                            >Confirmar Orden</Button>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default SummaryPage;