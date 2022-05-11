import { useState } from "react";
import { NextPage, GetStaticPaths, GetStaticProps } from "next";

import { ICartProduct, IProduct, ISize } from "../../interfaces";
import { dbProducts } from "../../database";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";

import { ProductSlideShow, SizeSelector } from "../../components/products";
import { ShopLayout } from "../../components/layout"
import { ItemCounter } from "../../components/ui";

interface Props {
  product: IProduct
}

const ProductPage:NextPage<Props> = ({product}) => {

  //Local state para validar talla
  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
  });

  const selectedSize = (size: ISize) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  const onUpdateQuantity = (quantity: number) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }))
  }

  const onAddProduct = () => {
    console.log({tempCartProduct})
  }

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

              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updatedQuantity={ onUpdateQuantity }
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />

              <SizeSelector
                // selectedSize={product.sizes[0]}
                sizes={product.sizes}
                selectedSize={ tempCartProduct.size}
                onSelectedSize={ selectedSize }
              />

            </Box>
            {/* AGREGAR AL CARRITO */}
            {
              (product.inStock > 0)
              ? (
                <Button
                  color="secondary"
                  className="circular-btn fadeIn"
                  onClick={ onAddProduct }
                >
                  {
                    tempCartProduct.size
                    ? 'Agregar al Carrito'
                    : 'Seleccione una Talla'
                  }
                </Button>
              ) : (
                <Chip label="Sin Existencias" color="error" variant="outlined"/>
              )
            }


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

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {

  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: {
        slug,
      }
    })),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = ''} = params as { slug: string };
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
    },
    revalidate: 86400
  }
}

export default ProductPage;