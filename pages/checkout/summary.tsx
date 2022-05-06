import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layout";
import { CartList, OrdenSummary } from "../../components/cart";

const SummaryPage = () => {
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
                            <Button
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