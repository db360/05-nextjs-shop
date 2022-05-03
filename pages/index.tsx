import { Card, CardActionArea, CardMedia, Grid, Typography } from '@mui/material'
import type { NextPage } from 'next'

import { ShopLayout } from '../components/layout'
import { initialData } from '../database/products'


const Home: NextPage = () => {
  return (
    <ShopLayout title={'DaB - SHOP - HOME'} pageDescription={'Encuentra los mejores productos de DAB aquí'}>
      <Typography variant="h1" component='h1'>Tienda - HOME</Typography>
      <Typography variant="h2" sx={{marginBottom: 1}}>Todos los Productos</Typography>

      <Grid container spacing={4}>
          {
            initialData.products.map(product => (
              <Grid item xs={6} sm={4} key={product.slug}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component='img'
                      image={ `products/${product.images[0]}` }
                      alt={product.title}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))
          }
      </Grid>

    </ShopLayout>
  )
}

export default Home
