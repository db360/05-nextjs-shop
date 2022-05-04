import type { NextPage } from 'next'
import { Typography } from '@mui/material'

import { ShopLayout } from '../components/layout'
import { ProductList } from '../components/products'
import { initialData } from '../database/products'


const Home: NextPage = () => {
  return (
    <ShopLayout title={'DaB - SHOP - HOME'} pageDescription={'Encuentra los mejores productos de DAB aquí'}>
      <Typography variant="h1" component='h1'>Tienda - HOME</Typography>
      <Typography variant="h2" sx={{marginBottom: 1}}>Todos los Productos</Typography>

      <ProductList
        products={initialData.products as any}
      />

    </ShopLayout>
  )
}

export default Home
