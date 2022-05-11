import type { NextPage, GetServerSideProps } from 'next'
import { Box, Typography } from '@mui/material'

import { ShopLayout } from '../../components/layout'
import { ProductList } from '../../components/products'

import { dbProducts } from '../../database'
import { IProduct } from '../../interfaces'

interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({products, foundProducts, query}) => {


  return (
    <ShopLayout title={'DaB - SHOP - SEARCH'} pageDescription={'Encuentra los mejores productos de DAB aquí'}>
      <Typography variant="h1" component='h1'>Buscar Producto</Typography>

        {
            foundProducts
                ?   <Typography variant="h2" sx={{mb: 1}} textTransform='capitalize'>Búsqueda: {query}</Typography>
                : (
                    <Box display="flex" gap={2}>
                            <Typography variant="h2" sx={{mb: 1}}>No encontramos ningún producto por ese nombre: </Typography>
                            <Typography variant="h2" sx={{mb: 1}} color="secondary" textTransform='capitalize'> {query}</Typography>
                    </Box>
                )



        }

        <ProductList products={ products }/>

    </ShopLayout>
  )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {

    const { query = ''} = params as {query: string};

    if( query.length === 0 ) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    //si se busca y no hay producto
    let products = await dbProducts.getProductByTerm(query);
    const foundProducts = products.length > 0;

    //TODO: RETORNAR OTROS PRODUCTOS
    if( !foundProducts ) {
        products = await dbProducts.getProductByTerm('cybertruck');
    }


    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}


export default SearchPage