import React, { useEffect, useState } from 'react';
import useSWR from 'swr';

import { AdminLayout } from '../../components/layout';
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { SummaryTile } from '../../components/admin';

import { DashboardSummaryResponse } from '../../interfaces';

const DashBoardPage = () => {

    const [refreshIn, setRefreshIn] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
        console.log('Tick');
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1 : 30 );
        }, 1000);

        return () => clearInterval(interval)
    }, []);

    const {data, error} = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 30 * 1000 // 30seg
    });

    if(!error && !data) {
        return <><h1>CARGANDO</h1></>
    }

    if( error ) {
        console.log(error);
        return <Typography>Error al Cargar la información</Typography>
    }

    const {
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders
    } = data!;

  return (
    <AdminLayout
        title='Dashboard'
        subTitle="Estadísticas Generales"
        icon={<DashboardOutlined />}
    >
        <Grid container spacing={2}>

            <SummaryTile
                title={numberOfOrders}
                subTitle="Total Órdenes"
                icon={<CreditCardOutlined color="secondary" sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={paidOrders}
                subTitle="Órdenes Pagadas"
                icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={notPaidOrders}
                subTitle="Órdenes Pendientes"
                icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={numberOfClients}
                subTitle="Clientes"
                icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={numberOfProducts}
                subTitle="Productos"
                icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={productsWithNoInventory}
                subTitle="Productos sin existencias"
                icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={lowInventory}
                subTitle="Inventario"
                icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} />}
            />
            <SummaryTile
                title={refreshIn}
                subTitle="Actualización en:"
                icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }} />}
            />

        </Grid>

    </AdminLayout>
  )
}

export default DashBoardPage