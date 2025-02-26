import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSelector } from '../../services/store';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';

export const BurgerIngredients: FC = () => {
  // Получаем данные из Redux
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  // Проверяем, что ingredients существуют перед фильтрацией
  const buns =
    ingredients?.filter((item: { type: string }) => item.type === 'bun') || [];
  const mains =
    ingredients?.filter((item: { type: string }) => item.type === 'main') || [];
  const sauces =
    ingredients?.filter((item: { type: string }) => item.type === 'sauce') ||
    [];

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  // Рефы для заголовков секций
  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  // Рефы и наблюдение за секциями
  const [bunsRef, inViewBuns] = useInView({ threshold: 0 });
  const [mainsRef, inViewMains] = useInView({ threshold: 0 });
  const [saucesRef, inViewSauces] = useInView({ threshold: 0 });

  // Устанавливаем активную вкладку при прокрутке
  useEffect(() => {
    if (inViewBuns) {
      setCurrentTab('bun');
    } else if (inViewSauces) {
      setCurrentTab('sauce');
    } else if (inViewMains) {
      setCurrentTab('main');
    }
  }, [inViewBuns, inViewMains, inViewSauces]);

  // Обработка клика на вкладку
  const onTabClick = (val: string) => {
    // Параметр типизируется как string
    setCurrentTab(val as TTabMode); // Приводим val к TTabMode, так как это требуемый тип
    if (val === 'bun')
      titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (val === 'main')
      titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (val === 'sauce')
      titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      bunsRef={bunsRef}
      mainsRef={mainsRef}
      saucesRef={saucesRef}
      onTabClick={onTabClick}
    />
  );
};
