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
import { useEffect } from 'react';
import { AppHeader, OrderInfo, Modal, IngredientsDetails } from '@components';
import { getIngredientsList } from '../../services/slices/ingredients';
import { fetchFeeds } from '../../services/slices/feed';
import { deleteCookie, getCookie } from '../../utils/cookie';
import { getUserThunk } from '@slices';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const dispatch = useDispatch();

  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;
  const isAuthorized = useSelector((state) => state.user.isAuthorized);
  const isUserLoading = useSelector((state) => state.user.isLoading);

  // Восстановление страницы с деталями при перезагрузки
  useEffect(() => {
    const lastOpenedOrder = localStorage.getItem('lastOpenedOrder');
    if (lastOpenedOrder) {
      navigate(`/profile/orders/${lastOpenedOrder}`, {
        state: { background: location }
      });
    }
  }, [navigate, location]);

  // Проверка авторизации пользователя
  useEffect(() => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken && !isAuthorized) {
      dispatch(getUserThunk())
        .unwrap()
        .catch((err) => {
          console.error('Failed to restore auth:', err);
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        });
    }
  }, [dispatch, isAuthorized]);

  // Загрузка ингредиентов и фида
  useEffect(() => {
    dispatch(getIngredientsList());
    dispatch(fetchFeeds());
  }, [dispatch]);

  // Закрытие модального окна и очистка localStorage
  const closeOrderModal = () => {
    localStorage.removeItem('lastOpenedOrder');
    navigate(-1); // Возвращаемся на предыдущую страницу
  };

  // Отображение лоадера, пока идет загрузка состояния пользователя
  if (isUserLoading) {
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
              <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
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
