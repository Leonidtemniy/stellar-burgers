import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => (
  //   const location = useLocation();
  //   //const { getIsAuthChecked, getUser } = useSelector;
  //   //   const user = useSelector(getUser);
  //   //   const isAuthChecked = useSelector(getIsAuthChecked);
  //   if (!isAuthChecked) {
  //     // пока идёт чекаут пользователя, показываем прелоадер
  <Preloader />
);
//   }
//   if (!onlyUnAuth && !user) {
//     // если пользователь на странице авторизации и данных в хранилище нет, то делаем редирект
//     return <Navigate replace to='/login' />;
//   }
//   if (onlyUnAuth && user) {
//     // если пользователь на странице авторизации и данные есть в хранилище
//     return <Navigate replace to='/list' />;
//   }
//   return children;
