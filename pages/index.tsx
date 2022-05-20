import type { NextPage } from 'next'
import { Typography } from '@mui/material'


import { ShopLayout } from '../components/layout'
import { ProductList } from '../components/products'
import { useProducts } from '../hooks'
import { FullScreenLoading } from '../components/ui'



const HomePage: NextPage = () => {



  const {products, isLoading} = useProducts('/products');

  return (
    <ShopLayout title={'DaB - SHOP - HOME'} pageDescription={'Encuentra los mejores productos de DAB aquí'}>
      <Typography variant="h1" component='h1'>Tienda - HOME</Typography>
      <Typography variant="h2" sx={{marginBottom: 1}}>Todos los Productos</Typography>

      {
        isLoading
          ? <FullScreenLoading />
          : <ProductList products={ products }/>
      }


    </ShopLayout>
  )
}

export default HomePage
