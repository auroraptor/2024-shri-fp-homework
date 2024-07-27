import {
  compose,
  allPass,
  anyPass,
  __,
  values,
  reduce,
  equals,
  prop,
  filter,
  length,
  gte,
  all,
} from "ramda";

// -1. Вспомогательные функции
const isColor = (color) => equals(color);
const getColor = (shape) => prop(shape);
const isShapeColor = (shape, color) => compose(isColor(color), getColor(shape));
const isRed = isColor("red");
const isGreen = isColor("green");
const isWhite = isColor("white");
const isBlue = isColor("blue");
const shapesToArray = ({ star, square, triangle, circle }) => [
  star,
  square,
  triangle,
  circle,
];
const countNonWhiteColors = compose(
  reduce((acc, color) => ({ ...acc, [color]: (acc[color] || 0) + 1 }), {}),
  filter((color) => color !== "white")
);

// 0. Проверки для каждого цвета
const isRedStar = isShapeColor("star", "red");
const isGreenSquare = isShapeColor("square", "green");
const isWhiteTriangle = isShapeColor("triangle", "white");
const isWhiteCircle = isShapeColor("circle", "white");
const isBlueCircle = isShapeColor("circle", "blue");
const isOrangeSquare = isShapeColor("square", "orange");

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
  isRedStar,
  isGreenSquare,
  isWhiteTriangle,
  isWhiteCircle,
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(
  gte(__, 2),
  length,
  filter(isColor("green")),
  ({ star, square, triangle, circle }) => [star, square, triangle, circle]
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
  (shapes) => length(filter(isRed, shapes)) === length(filter(isBlue, shapes)),
  shapesToArray
);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    anyPass([gte(__, 3), equals(4)]),
  values,
  countNonWhiteColors,
  shapesToArray
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = ({ star, square, triangle, circle }) =>
  allPass([
    compose(equals(2), length, filter(isGreen), values),
    compose(equals(1), length, filter(isRed), values),
    compose(isGreen, getColor("triangle")),
  ])({ star, square, triangle, circle });

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isColor("orange")), shapesToArray);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
  (color) => !isRed(color) && !isWhite(color),
  getColor("star")
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isColor("green")), shapesToArray);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = ({ triangle, square }) =>
  triangle === square && !isColor("white")(triangle);
