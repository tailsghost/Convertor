import { useEffect, useRef, useState } from 'react';
import { Block } from './Block';
import './index.scss';

function App() {
  const [fromCurrency, setFromCurrency] = useState('RUB');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromPrice, setFromPrice] = useState(0);
  const [toPrice, setToPrice] = useState(1);
  const rateRef = useRef({});

  const ref = /^(0|[1-9]\d*)([.,]\d+)?/;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('https://www.cbr-xml-daily.ru/latest.js');
        const data = await res.json();
        const newRates = await { ...data.rates, RUB: 1 };
        rateRef.current = newRates;
        onChangeToPrice(1);
      } catch (error) {
        console.log(error);
        alert(`Не удалось получить информацию, ошибка - ${error.message}`);
      }
    };
    fetchData();
  }, []);

  const onChangeFromPrice = (value) => {
    const price = value / rateRef.current[fromCurrency];
    const result = price * rateRef.current[toCurrency];
    if (ref.test(result)) {
      setToPrice(result.toFixed(3));
      setFromPrice(value);
    }
  };

  useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  const onChangeToPrice = (value) => {
    const price =
      (rateRef.current[fromCurrency] / rateRef.current[toCurrency]) * value;

    if (ref.test(price)) {
      setToPrice(value);
      setFromPrice(price.toFixed(3));
    }
  };

  return (
    <div className="App">
      <Block
        value={fromPrice}
        currency={fromCurrency}
        onChangeCurrency={setFromCurrency}
        onChangeValue={onChangeFromPrice}
      />
      <Block
        value={toPrice}
        currency={toCurrency}
        onChangeCurrency={setToCurrency}
        onChangeValue={onChangeToPrice}
      />
    </div>
  );
}

export default App;
