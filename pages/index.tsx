import { Typography } from '@mui/material'
import type { NextPage } from 'next'

import { ShopLayout } from '../components/layout'

const Home: NextPage = () => {
  return (
    <ShopLayout title={'DaB - SHOP - HOME'} pageDescription={'Encuentra los mejores productos de DAB aquí'}>
      <Typography variant="h1" component='h1'>Tienda - HOME</Typography>
      <Typography variant="h2" sx={{marginBottom: 1}}>Todos los Productos</Typography>
    </ShopLayout>
  )
}

export default Home
