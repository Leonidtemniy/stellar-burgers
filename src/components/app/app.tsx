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
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { AppHeader, OrderInfo, Modal, IngredientsDetails } from '@components';
import { getIngredientsList } from '../../services/slices/ingredients';
import { fetchFeeds } from '../../services/slices/feed';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  const dispatch = useDispatch();

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
              <Modal
                title={`#${location.state?.number}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <Modal
                title={`#${location.state?.number}`}
                onClose={() => navigate(-1)}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
function apiGetUser(): any {
  throw new Error('Function not implemented.');
}
