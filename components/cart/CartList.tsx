import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';
import {initialData} from '../../database/products';
import { FC } from 'react';
import { ItemCounter } from '../ui';

const productsInCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

interface Props {
    editable: boolean;
}

export const CartList:FC<Props> = ({editable = false}) => {

  return (
    <>
        {
            productsInCart.map( product => (
                <Grid container spacing={2} key={product.slug} sx={{mb:1}}>
                    <Grid item xs={3}>
                        {/* TODO:Redireccionar a la pagina del producto */}
                        <NextLink href='/product/slug' passHref>
                            <Link>
                                <CardActionArea>
                                    <CardMedia
                                        image={`/products/${product.images[0]}`}
                                        component='img'
                                        sx={{borderRadius: '5px'}}
                                    >
                                    </CardMedia>
                                </CardActionArea>
                            </Link>
                        </NextLink>
                    </Grid>
                    <Grid item xs={7}>
                        <Box display='flex' flexDirection='column'>
                            <Typography variant='body1'>{product.title}</Typography>
                            <Typography variant='body1'>Talla: <strong>M</strong></Typography>

                            {/* CONDICIONAL */}
                            {
                                editable
                                ? <ItemCounter
                                    currentValue={0}
                                    maxValue={0}
                                    updatedQuantity={function (newValue: number): void {
                                        throw new Error('Function not implemented.');
                                    } } />
                                : <Typography variant='h5'>3 Items</Typography>
                            }

                        </Box>
                    </Grid>
                    <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                        <Typography variant='subtitle1'>{product.price}€</Typography>
                        {
                            editable && (
                                <Button   variant='text' color='secondary'>
                                    Eliminar
                                </Button>
                            )
                        }
                    </Grid>
                </Grid>
            ))
        }
    </>
  )
}
