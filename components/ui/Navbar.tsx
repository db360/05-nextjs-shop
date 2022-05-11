import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { UiContext } from '../../context';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

export const Navbar = () => {

    const {asPath, push} = useRouter();
    const { toggleSideMenu } = useContext(UiContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        push(`/search/${searchTerm}`);

    }


  return (
    <AppBar>
        <Toolbar>
            <NextLink href='/' passHref>
                <Link display='flex' alignItems="center">
                    <Typography variant='h6'>Da.B |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop </Typography>
                </Link>
            </NextLink>

            <Box flex={1}/>

            <Box className="fadeIn" sx={{display: isSearchVisible ? 'none' : { xs: 'none', sm:'block'}}}>
                <NextLink href="/category/men" passHref>
                    <Link>
                        <Button color={ asPath === '/category/men' ? 'primary' : 'info'}>Hombre</Button>
                    </Link>
                </NextLink>
                <NextLink href="/category/women" passHref>
                    <Link>
                        <Button color={ asPath === '/category/women' ? 'primary' : 'info'}>Mujer</Button>
                    </Link>
                </NextLink>
                <NextLink href="/category/kids" passHref>
                    <Link>
                        <Button color={ asPath === '/category/kids' ? 'primary' : 'info'}>Niño</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box flex={1}/>

            {
                isSearchVisible
                    ? (
                    <Input
                        sx={{display: {xs: 'none', sm:'flex'}}}
                        className='fadeIn'
                        autoFocus
                        value={searchTerm}
                        onChange={ (e) => setSearchTerm(e.target.value)}
                        onKeyPress={ (e) => e.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ () => setIsSearchVisible(false)}
                                    aria-label="toggle password visibility"
                                >
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    ) : (
                        <IconButton
                            sx={{ display: {xs: 'none', sm: 'flex'}}}
                            onClick={ () => setIsSearchVisible(true)}
                        >
                            <SearchOutlined />
                        </IconButton>
                    )
            }



        {/* PANTALLAS PEQUEÑAS */}
            <IconButton
                sx={{ display: {xs: 'flex', sm: 'none'}}}
                onClick={toggleSideMenu}
            >
                <SearchOutlined />
            </IconButton>

            <NextLink href="/cart" passHref>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ 2 } color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button onClick={toggleSideMenu}>MENU</Button>

        </Toolbar>
    </AppBar>
)
}
