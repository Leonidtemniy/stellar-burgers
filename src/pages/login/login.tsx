import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, loginUserThunk } from '@slices';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthorizedSelector } from '@slices'; // Импортируем селектор авторизации

export const Login: FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем статус авторизации
  const isAuthorized = useSelector(isAuthorizedSelector);

  // Очищаем ошибки при монтировании компонента
  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  // Перенаправляем авторизованного пользователя
  useEffect(() => {
    if (isAuthorized) {
      const from = location.state?.from || { pathname: '/' }; // Перенаправляем на главную или на страницу, с которой пришел
      navigate(from, { replace: true });
    }
  }, [isAuthorized, navigate, location]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUserThunk({ email, password }));
    navigate('/profile'); // Перенаправляем после успешного входа
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
