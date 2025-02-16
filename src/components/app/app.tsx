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
  const isAuthorized = useSelector((state) => state.user.isAuthorized); // Селектор для проверки авторизации
  const isUserLoading = useSelector((state) => state.user.isLoading);

  useEffect(() => {
    const accessToken = getCookie('accessToken'); // Получаем accessToken из куки
    const refreshToken = localStorage.getItem('refreshToken'); // Получаем refreshToken из localStorage

    if (accessToken && refreshToken && !isAuthorized) {
      // Если токены есть, но пользователь не авторизован, восстанавливаем состояние
      dispatch(getUserThunk())
        .unwrap()
        .catch((err) => {
          console.error('Failed to restore auth:', err);
          // Если токен невалидный, очищаем данные
          localStorage.removeItem('refreshToken');
          deleteCookie('accessToken');
        });
    }
  }, [dispatch, isAuthorized]);

  // Используем useEffect для запуска запросов
  useEffect(() => {
    // Загрузка ингредиентов
    dispatch(getIngredientsList());

    // Загрузка фида
    dispatch(fetchFeeds());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        {/*Основные маршруты*/}
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientsDetails />} />
        <Route path='*' element={<NotFound404 />} />
        {/*Защищенные маршруты*/}
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
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
      </Routes>
      {/*Модальные окна*/}
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
                {/*Используем orderNumber из параметров маршрута */}
                <OrderInfo />
              </Modal>
            }
          />
          {(isUserLoading || isAuthorized) && (
            <Route
              path='/profile/orders/:number'
              element={
                <Modal title={`#${orderNumber}`} onClose={() => navigate(-1)}>
                  <OrderInfo />
                </Modal>
              }
            />
          )}
        </Routes>
      )}
    </div>
  );
};

export default App;
function apiGetUser(): any {
  throw new Error('Function not implemented.');
}
