import { Box, Button, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layout"
import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { initialData } from '../../database/products';

const product = initialData.products[0];

const ProductPage = () => {
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={2}>
        <Grid item xs={ 12 } sm={ 7 }>
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Box display="flex" flexDirection='column'>
            {/* TITULOS */}
            <Typography variant='h1' component="h1">{product.title}</Typography>
            <Typography variant='subtitle1' component="h2">{product.price}€</Typography>
            {/* CANTIDAD */}
            <Box sx={{my: 2}}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
              <SizeSelector
                // selectedSize={product.sizes[0]}
                sizes={product.sizes}
              />
            </Box>
            {/* AGREGAR AL CARRITO */}
            <Button color="secondary" className="circular-btn">
              Agregar al Carrito
            </Button>
            {/* <Chip label="Sin Existencias" color="error" variant="outlined"/> */}
            {/* DESCRIPCION*/}
            <Box sx={{mt:3}}>
              <Typography variant="subtitle1">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

    </ShopLayout>
  )
}

export default ProductPage
