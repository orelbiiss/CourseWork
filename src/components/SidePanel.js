import React, { useContext, useState} from 'react';
import '../SidePanel.css';
import { CartContext } from '../layouts/CartContext';

function SidePanel({ isOpen, onClose }) {

  // Получение данных о корзине из контекста
  const { cart, setCart } = useContext(CartContext);

  // Вычисление общей стоимости товаров(totalCost) в корзине
  const price = cart.map(item => item.prices[item.volumes.indexOf(item.volume)] ?? item.prices[0]);
  const totalCost = price.reduce((acc, val) => acc + val, 0)

  return (
    <div className={`${isOpen ? 'side__panel__open' : 'side__panel'}`}>
      <div className='handleClickOutside' onClick={onClose}></div>
      <div className='content__block'>
        <div className='content'> 
          <img src='img/close__square__light.svg' className='close__btn' onClick={onClose}></img>
          {
            cart.length > 0
              ? <ShoppingCart cart={cart} 
                              setCart={setCart} 
                              totalCost = {totalCost} 
                              price = {price}
                              />
              : <EmptyCart />
          }
        </div>
      </div>
    </div>
  );
}


// Компонент для отображения пустой корзины
function EmptyCart() {
  return (
    <>
        <div className='text__block'>  
          <p className='text__block__title'>в корзине</p>
          <p className='text__block__title'>ничего нет...</p>  
          <p className='text__description'>Загляните в наш <a className='accent__text'>каталог товаров</a>, чтобы открыть для себя разнообразие напитков</p> 
        </div> 
        <div className='display__area'>
          <a className='btn__catalog'>Перейти к напиткам</a>
        </div>
    </>
  );
}

// Компонент для отображения содержимого корзины
function ShoppingCart({ cart, setCart, totalCost, price }){
  const cartCardsJsx = cart.map((elem, i) => {
    return(
      <ShoppingCartCard item = {elem} 
                        key={i} 
                        totalCost={totalCost} 
                        price={price[i]}
                        />
    )
  })

  // Вычисление суммарной скидки
  const lineSale = cart.map((elem, i) => {
    return 'sale' in elem ? elem.sale : 0;
  })
  const totalSale = lineSale.reduce((acc, val) => acc + val, 0);

  // Функция для удаления всех товаров из корзины
  function DeleteEach(){
    setCart(cart = [])
  }
  
  return(
    <>
      <div className='status__block'>
        <p className='basket__text'>
          корзина <span>/ {cart.length} шт.</span>
        </p>
        <button className={"btn__delete__each" + (cart.length > 1 ? ' active ' : '')} onClick={DeleteEach}>удалить всё</button>
      </div>
      <div className='product__cards__block'>
        {cartCardsJsx}
      </div>
      <input
        type="text"
        id="promo__code__fiekd"
        className="promo__code"
        placeholder="ВВЕДИТЕ ПРОМОКОД"
      />
      <div className='cost__info'>
        <p className='title__cost__info'>сумма заказа</p> 
        <div className='product__price__cart__wrapper'>
        <p className='product__price__cart'>стоимость продуктов</p>
        <span>{totalCost} ₽</span>
        </div>
          {totalSale > 0 ? 
            <div className='total__sale__wrapper'>
              <p className='total__sale'>скидка</p> 
              <span>-{totalSale} ₽</span>
            </div> : 
          '' }
        <div className='total__price__wrapper'>
          <p className='total__price'>итого</p> 
          <span>{totalCost - totalSale} ₽</span>
        </div>
        <button></button>
      </div>
    </>
  )
}

// Компонент для отображения карточки товара в корзине
function ShoppingCartCard({ item, price }) {

  const [showProductQuantity, setshowProductQuantity] = useState(false)
  return (
    <>
    <div className='cart-item' 
        onMouseEnter={() => setshowProductQuantity(true)} 
        onMouseLeave={() => setshowProductQuantity(false)}>

      <picture className='cart-item__img-wrapper'>
        <source
          className="main__block__product__img"
          type="image/webp"
          srcSet  ={` ${item.webpSrc1x} 1x, ${item.webpSrc2x} 2x`}
          />
        <img
          className="main__block__product__img"
          srcSet = {` ${item.imgSrc1x} 1x, ${item.imgSrc2x} 2x`}
          alt={item.name}
          />
      </picture>
      <div className='cart-item__content-description'>
        <div>
          <p className='item__ingredients'>{ item.ingredients }</p>
          <p className='item__name'>{ item.name }</p>
        </div>
        <p className='item__volume'>{ item.volume }</p>
      </div>
      <div className='price__selected__product'>
        <div className='block__product__quantity__management'>
          {showProductQuantity === true ? 
            
            ProductQuantityManagement() : ''
          }
        </div>
        <p className='price__selected'>{ price }</p>
      </div>
    </div>
    </>
  );


  // Компонент для управления количеством товара
  function ProductQuantityManagement(){
    return(
      <>
        <img src='img/remove.svg'></img>
        <p></p>
        <img src='img/add__ring.svg'></img>
      </>
    )
  }
}

export default SidePanel;