import React, { FC, useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form';

import { IProduct } from '../../../interfaces';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { dbProducts } from '../../../database';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import { AdminLayout } from '../../../components/layout';
import { shopApi } from '../../../api';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData {

    _id?        : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : string[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : string;
    gender      : string;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const [ newTagValue, setNewTagValue ] = useState('');
    const [ isSaving, setIsSaving ] = useState(false);

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    });

    useEffect(() => {
        const subscription = watch( ( value, {name, type} ) => {  // subscription para manejar el watch y poder pararlo en el return
            // console.log({value, name, type})
            if( name === 'title' ) {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        } )
      return () => subscription.unsubscribe();

    }, [watch, setValue])


    const onSizesChange = ( size: string) => {
        const currentSizes = getValues('sizes');
        if(currentSizes.includes( size )) {
            return setValue('sizes', currentSizes.filter( s => s !== size ), { shouldValidate: true } );
        }

        setValue('sizes', [...currentSizes, size]);
    }

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();  // preparamos el tag quitando espacios y pasando a minusculas
        setNewTagValue('');
        const currentTags = getValues('tags');

        if( currentTags.includes(newTag) ) {
            return;
        }

        currentTags.push(newTag);

        // setValue('tags')
    }

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );
        setValue('tags', updatedTags, {shouldValidate: true})
    }

    const onSubmit = async( form: FormData ) => {

        if( form.images.length < 2 ) return alert('Mínimo son dos imágenes');

        setIsSaving(true);

        try {
            const { data } = await shopApi({
                url: '/admin/products',
                method: 'PUT', // si tenemos _id, si no, crear
                data: form
            })
            console.log({data});
            if( !form._id) {
                // Todo: recargar navegador
            } else {

                setIsSaving(false);
            }
        } catch (error) {
            console.log(error);
            setIsSaving(false);

        }
    }

    return (
        <AdminLayout
            title={'Producto'}
            subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmit )}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('title', {
                                required: 'Este título es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={ !!errors.title }
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            { ...register('description', {
                                required: 'Este título es requerido',
                            })}
                            error={ !!errors.description }
                            helperText={ errors.description?.message }

                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('inStock', {
                                required: 'Este título es requerido',
                                min: { value: 0, message: 'Mínimo Valor 0' }
                            })}
                            error={ !!errors.inStock }
                            helperText={ errors.inStock?.message }
                        />

                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('price', {
                                required: 'El Precio es requerido',
                                min: { value: 0, message: 'Mínimo Valor 0' }
                            })}
                            error={ !!errors.price }
                            helperText={ errors.price?.message }

                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('type') }  // hook de react-hook-form para atrapar valores de campos
                                onChange={ ({ target }) => setValue('type', target.value, {shouldValidate: true}) } // Llamar a una funcion cuando cambia el evento // shouldvalidate valida el campo en el formulario y lo cambia con el target value
                            >
                                {
                                    validTypes.map( option => (
                                        <FormControlLabel
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={ getValues('gender') }
                                onChange={ ({ target }) => setValue('gender', target.value, {shouldValidate: true}) }
                            >
                                {
                                    validGender.map( option => (
                                        <FormControlLabel
                                            key={ option }
                                            value={ option }
                                            control={ <Radio color='secondary' /> }
                                            label={ capitalize(option) }
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel
                                        key={size}
                                        control={ <Checkbox checked={ getValues('sizes').includes(size) } /> }
                                        label={ size }
                                        onChange={ ()=> onSizesChange(size) }
                                    />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            { ...register('slug', {
                                required: 'El Precio es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede haber espacios en blanco' : undefined
                            })}
                            error={ !!errors.slug }
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={ newTagValue }
                            onChange={ ({target }) => setNewTagValue(target.value) } // manda al state el newvalue del target
                            // onKeyUp={ ({code}) => code === 'Space' ? onNewTag() : undefined } // Cuando se pulsa barra spaceio se llama onNewTag
                            onKeyDown={({code}) => code === 'Space' ? onNewTag() : undefined}
                        />

                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {

                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                            >
                                Cargar imagen
                            </Button>

                            <Chip
                                label="Es necesario al 2 imagenes"
                                color='error'
                                variant='outlined'
                            />

                            <Grid container spacing={2}>
                                {
                                    product.images.map( img => (
                                        <Grid item xs={3} sm={4} key={img}>
                                            <Card>
                                                <CardMedia
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ `/products/${ img }` }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error">
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = ''} = query;

    const product = await dbProducts.getProductsBySlug(slug.toString());

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }


    return {
        props: {
            product
        },
        revalidate: 60 * 60 * 24
    }
}


export default ProductAdminPage