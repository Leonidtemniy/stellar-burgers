import { ConstructorPage } from '../../pages/constructor-page';
import { Feed } from '../../pages/feed';
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404,
  ProfileOrders,
  Profile
} from '../../pages';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect, useState, useMemo } from 'react';
import { AppHeader, OrderInfo, Modal, IngredientsDetails } from '@components';
import { getIngredientsList } from '../../services/slices/ingredients';
import { fetchFeeds } from '../../services/slices/feed';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { getUserThunk } from '@slices';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Получаем номер заказа из URL
  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = useMemo(
    () => profileMatch || feedMatch,
    [profileMatch, feedMatch]
  );

  // Проверяем авторизацию пользователя
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const isUserLoading = useSelector((state) => state.user.isLoading);

  // Ждем загрузку данных о пользователе перед рендерингом
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Восстанавливаем background из истории
  const background = location.state?.background || null;

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken && !isAuthorized) {
      dispatch(getUserThunk())
        .unwrap()
        .catch(() => {
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        })
        .finally(() => setIsAuthChecked(true));
    } else {
      setIsAuthChecked(true);
    }
  }, [dispatch, isAuthorized]);

  // Восстанавливаем background после перезагрузки
  useEffect(() => {
    const lastOpenedOrder = localStorage.getItem('lastOpenedOrder');
    const backgroundPath = localStorage.getItem('backgroundPath');

    if (lastOpenedOrder && backgroundPath && location.pathname === '/') {
      navigate(`/profile/orders/${lastOpenedOrder}`, {
        state: { background: { pathname: backgroundPath } }
      });
    }
  }, [navigate, location.pathname]);

  // Загружаем ингредиенты и заказы
  useEffect(() => {
    dispatch(getIngredientsList());
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Закрытие модального окна и очистка localStorage
  const closeOrderModal = () => {
    localStorage.removeItem('lastOpenedOrder');
    localStorage.removeItem('backgroundPath');

    if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  // Пока идет проверка авторизации — показываем лоадер
  if (!isAuthChecked || isUserLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Основные маршруты */}
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientsDetails />} />
        <Route path='*' element={<NotFound404 />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientsDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${orderNumber}`} onClose={closeOrderModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title={`#${orderNumber}`} onClose={closeOrderModal}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
