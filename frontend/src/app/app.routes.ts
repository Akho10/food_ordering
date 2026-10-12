import { Routes } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { AddProduct } from './components/admin/add-product/add-product';
import { EditProduct } from './components/admin/edit-product/edit-product';
import { UserHome } from './components/user/user-home/user-home';
import { Order } from './components/user/order/order';
import { Payment } from './components/user/payment/payment';
import { Confirmation } from './components/user/confirmation/confirmation';

export const routes: Routes = [
    {
        path:'products',
        component:ProductList
    },
    {
        path:'admin/add/products',
        component: AddProduct
    },
    {
        path:'admin/edit/products/:id',
        component: EditProduct
    },
     {
        path:'',
        component: UserHome
    },
     {
        path:'order/:id',
        component: Order
    },
     {
        path:'payment/:id',
        component: Payment
    },
     {
        path:'confirmation/:id',
        component: Confirmation
    }



];
