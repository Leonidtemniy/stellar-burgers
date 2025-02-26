import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserSelector } from '../../services/slices/user';

export const AppHeader: FC = () => {
  const user = useSelector(getUserSelector);
  const userName = user?.name ?? 'Не авторизованы'; // Проверяем, есть ли пользователь
  return <AppHeaderUI userName={userName} />;
};
