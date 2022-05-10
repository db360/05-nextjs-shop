import { NextPage, GetServerSideProps } from "next";

import { IProduct } from "../../interfaces";
import { dbProducts } from "../../database";
import { Box, Button, Grid, Typography } from "@mui/material";

import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ShopLayout } from "../../components/layout"
import { ItemCounter } from "../../components/ui";

interface Props {
  product: IProduct
}

const ProductPage:NextPage<Props> = ({product}) => {

  // const router = useRouter();
  // const {products: product, isLoading} = useProducts(`/products/${ router.query.slug }`);

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

// getServerSideProps
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({params}) => {

  const { slug } = params as { slug: string };
  const product = await dbProducts.getProductsBySlug(slug);

  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      product
    }
  }
}

export default ProductPage;