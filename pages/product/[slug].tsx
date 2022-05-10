import { NextPage, GetStaticPaths, GetStaticProps } from "next";

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

// NO USAMOS AQUI EL GETSERVERSIDEPROPS

// export const getServerSideProps: GetServerSideProps = async ({params}) => {

//   const { slug } = params as { slug: string };
//   const product = await dbProducts.getProductsBySlug(slug);

//   if (!product) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: {
//       product
//     }
//   }
// }

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