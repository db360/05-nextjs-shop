import React from 'react'
import { AdminLayout } from '../../components/layout'

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { PeopleOutline } from '@mui/icons-material'
import { Grid, MenuItem, Select } from '@mui/material';
import useSWR from 'swr';
import { IUser } from '../../interfaces';
import { shopApi } from '../../api';


const UsersPage = () => {

    const {data, error} = useSWR<IUser[]>('/api/admin/users');

    if(!data && !error) return (<></>)

    const onRoleUpdate = async(userId: string, newRole: string) => {

        try {
            await shopApi.put('/admin/users', { userId, role: newRole});

        } catch (error) {
            alert('No se pudo actualizar el rol del usuario')
            console.log(error);
        }

    }

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

    const rows = data!.map(user => ({
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