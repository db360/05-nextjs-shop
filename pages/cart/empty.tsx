import NextLink from 'next/link';
import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layout"

const emptyPage = () => {
  return (
    <ShopLayout title="Carrito Vacio" pageDescription="Su carrito no tiene ningún artículo">
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="70vh"
            sx={{flexDirection: {xs: 'column', sm:'row'}}}
        >
            <RemoveShoppingCartOutlined sx={{fontSize: 100}}/>
            <Box display='flex' flexDirection='column'>
                <Typography>Su Carrito está vacio</Typography>
                <NextLink href="/" passHref>
                    <Link typography="h4" color='secondary'>
                        Home
                    </Link>
                </NextLink>
            </Box>

        </Box>
    </ShopLayout>
  )
}

export default emptyPage