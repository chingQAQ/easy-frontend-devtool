const { coin, discount } = object => {
  const type = typeof object === number;
  const x = type ? object * 10 : 0;
  const y = type ? 0.7 : 0;
  return {
    coin: x,
    discount: y 
  }
}