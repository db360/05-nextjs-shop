import React, { useEffect, useState } from 'react'
import { AdminLayout } from '../../components/layout'
import useSWR from 'swr';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material'

import { IUser } from '../../interfaces';
import { shopApi } from '../../api';


const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users');
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
      if(data) {
        setUsers(data)
      }
    }, [data]);


    if(!data && !error) return (<></>);

    const onRoleUpdate = async(userId: string, newRole: string) => {

        const previousUsers = users.map( user => ({...user}));

        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }))

        setUsers(updatedUsers);

        try {
            await shopApi.put('/admin/users', { userId, role: newRole});

        } catch (error) {
            setUsers(previousUsers);
            alert('No se pudo actualizar el rol del usuario')
            console.log(error);
        }

    };

    const cols: GridColDef[] = [
        {field: 'email', headerName: 'Correo', width: 250},
        {field: 'name', headerName: 'Nombre Completo', width: 300},
        {
            field: 'role',
            headerName: 'Rol',
            width: 150,
            renderCell: ({row}: GridValueGetterParams) => {

                return (
                    <Select
                        value={row.role}
                        label="Rol"
                        onChange={({ target }) => onRoleUpdate( row.id, target.value )}
                        sx={{width: '300px'}}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                        <MenuItem value="super-user">Super-Usuario</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>
                    </Select>
                )

            }
        },
    ];

    const rows = users.map(user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))



  return (

    <AdminLayout
        title='Usuarios'
        subTitle={'Mantenimiento de Usuarios'}
        icon={ <PeopleOutline />}
    >
        <Grid  container className="fadeInp" sx={{width: '100%'}}>
            <Grid item xs={12} sx={{height: 650, width: '100%'}}>
                <DataGrid
                    rows={rows}
                    columns={cols}
                    pageSize={10}
                    rowsPerPageOptions={ [10] }
                />


            </Grid>
        </Grid>
    </AdminLayout>

  )
}

export default UsersPage