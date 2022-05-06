import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layout";
import { CartList, OrdenSummary } from "../../components/cart";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

const OrderPage = () => {
  return (
    <ShopLayout title='Resumen de la Orden Nº 15468635' pageDescription='Resumen final de la orden de compra de la tienda'>
        <Typography variant='h1' component='h1'>Order Nº: 15468635 </Typography>

        {/* <Chip
            sx={{my: 2}}
            label="Pendiente de Pago"
            variant="outlined"
            color="error"
            icon={<CreditCardOffOutlined />}
        /> */}
        <Chip
            sx={{my: 2}}
            label="Pagada"
            variant="outlined"
            color="success"
            icon={<CreditScoreOutlined />}
        />

        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable={false}/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Resumen (3 Productos)</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent="space-between">
                            <Typography variant='subtitle1'>Dirección de Entrega</Typography>
                            <NextLink href="/checkout/address" passHref>
                                <Link underline="always">
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <Typography>David Martínez</Typography>
                        <Typography>C/ A tí que te importa Nº2</Typography>
                        <Typography>San Ghetto 49711</Typography>
                        <Typography>España</Typography>
                        <Typography>+34 615485135</Typography>
                        <Divider sx={{my: 1}}/>

                        <Box display='flex' justifyContent="end">
                            <NextLink href="/checkout/address" passHref>
                                <Link underline="always">
                                    Editar
                                </Link>
                            </NextLink>
                        </Box>

                        <OrdenSummary />

                        <Box sx={{mt: 3}}>
                            {/* TODO: PAYMENT */}
                            <h1>Pagar</h1>

                            <Chip
                                sx={{my: 2}}
                                label="Pagada"
                                variant="outlined"
                                color="success"
                                icon={<CreditScoreOutlined />}
                            />
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default OrderPage;