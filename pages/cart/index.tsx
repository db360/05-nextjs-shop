import { useContext, useEffect } from "react";

import { Box, Button, Card, CardContent, Divider, Grid, Typography } from "@mui/material";

import { ShopLayout } from "../../components/layout";
import { CartList, OrdenSummary } from "../../components/cart";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

const CartPage = () => {

    const { numberOfItems, isLoaded, cart } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if( isLoaded && cart.length === 0 ) {
            router.replace('/cart/empty')
        }

    }, [isLoaded, cart, router]);

    if( !isLoaded || cart.length === 0 ) {
        return (<></>);
    }

  return (
    <ShopLayout title={`Carrito ${numberOfItems > 9 ? '+9' : numberOfItems} Articulos`}pageDescription='Carrito de Compras de la tienda'>
        <Typography variant='h1' component='h1'>Carrito</Typography>
        <Grid container>
            <Grid item xs={12} sm={7}>
                <CartList editable/>
            </Grid>
            <Grid item xs={12} sm={5}>
                <Card className='summary-card'>
                    <CardContent>
                        <Typography variant='h2'>Orden</Typography>
                        <Divider sx={{my: 1}}/>

                        <OrdenSummary />

                        <Box sx={{mt: 3}}>
                            <Button
                                color='secondary'
                                className='circular-btn'
                                fullWidth
                                href='/checkout/address'
                            >Checkout
                            </Button>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </ShopLayout>
  )
}

export default CartPage;