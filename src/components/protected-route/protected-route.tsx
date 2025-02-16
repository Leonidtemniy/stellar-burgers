import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthorizedSelector, getRequestUser } from '@slices';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  publicRoute?: boolean; // Публичный маршрут
  onlyUnAuth?: boolean; // Доступно только для неавторизованных
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  publicRoute,
  onlyUnAuth
}) => {
  const isAuthorized = useSelector(isAuthorizedSelector); // Получаем статус авторизации
  const isUserLoading = useSelector(getRequestUser); // Состояние загрузки пользователя
  const location = useLocation();

  console.log('Is authorized:', isAuthorized);
  console.log('Is user loading:', isUserLoading);

  // Если данные пользователя ещё загружаются, отображаем прелоадер
  if (isUserLoading) {
    return <Preloader />;
  }

  // Если это публичный маршрут и пользователь авторизован
  if (publicRoute) {
    if (isAuthorized) {
      const from = location.state?.from || { pathname: '/' };
      return <Navigate replace to={from} />;
    }
    return <>{children}</>;
  }

  // Если маршрут доступен только для неавторизованных пользователей
  if (onlyUnAuth && isAuthorized) {
    return <Navigate to={location.state?.from?.pathname || '/'} />;
  }

  // Для защищённых маршрутов + Ждем загрузку статуса, не редиректим сразу
  if (!isAuthorized && !isUserLoading) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
