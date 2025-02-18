import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { clearUserError, registerUserThunk } from '@slices';
import { useNavigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Получаем состояние ошибки из Redux
  const error = useSelector((state) => state.user.error);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const name = userName;
    console.log('Form submitted with:', { email, userName, password });
    dispatch(registerUserThunk({ email, name, password }))
      .unwrap()
      .then(() => {
        // Перенаправляем пользователя после успешной регистрации
        navigate('/');
      })
      .catch((err) => {
        console.error('Registration failed:', err);
      });
  };

  // Очистка ошибки при размонтировании компонента
  useEffect(
    () => () => {
      dispatch(clearUserError());
    },
    [dispatch]
  );

  return (
    <RegisterUI
      errorText={error || ''} // Передаем текст ошибки
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
