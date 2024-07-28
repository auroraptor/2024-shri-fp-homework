import {
  compose,
  allPass,
  __,
  values,
  sort,
  equals,
  prop,
  filter,
  length,
  gte,
  all,
  converge,
  not,
  map,
  T,
} from "ramda";

import { SHAPES, COLORS } from "../constants";

// -2. Деструктуризация констант
const { TRIANGLE, SQUARE, CIRCLE, STAR } = SHAPES;
const { RED, BLUE, ORANGE, GREEN, WHITE } = COLORS;

// -1. Вспомогательные функции
const isColor = (color) => equals(color);
const getColor = (shape) => prop(shape);
const isShapeColor = (shape, color) => compose(isColor(color), getColor(shape));
const shapesToArray = ({ star, square, triangle, circle }) => [
  star,
  square,
  triangle,
  circle,
];
const countShapesByColor = (color) => compose(length, filter(isColor(color)));
const shapesWithoutWhite = filter(compose(not, isColor(WHITE)));
const sortColors = sort((a, b) => a.localeCompare(b));
const hasAtLeastThreeSameColor = (sorted) =>
  (sorted[0] === sorted[2] || sorted[1] === sorted[3]) && gte(sorted.length, 3);

// 0. Проверки для каждого цвета
const isRedStar = isShapeColor(STAR, RED);
const isGreenSquare = isShapeColor(SQUARE, GREEN);
const isWhiteTriangle = isShapeColor(TRIANGLE, WHITE);
const isWhiteCircle = isShapeColor(CIRCLE, WHITE);
const isBlueCircle = isShapeColor(CIRCLE, BLUE);
const isOrangeSquare = isShapeColor(SQUARE, ORANGE);

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
  filter(isColor(GREEN)),
  shapesToArray
);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(
  converge(equals, [countShapesByColor(RED), countShapesByColor(BLUE)]),
  shapesToArray
);

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета.
export const validateFieldN4 = allPass([
  isBlueCircle,
  isRedStar,
  isOrangeSquare,
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
  hasAtLeastThreeSameColor,
  sortColors,
  shapesWithoutWhite,
  shapesToArray
);

// 6. Ровно две зеленые фигуры (одна из них треугольник), плюс одна красная. Четвертая любая.
export const validateFieldN6 = compose(
  allPass([
    compose(equals(2), length, filter(isColor(GREEN)), values),
    compose(equals(1), length, filter(isColor(RED)), values),
    isShapeColor(TRIANGLE, GREEN),
  ]),
  ({ star, square, triangle, circle }) => ({ star, square, triangle, circle })
);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(all(isColor(ORANGE)), shapesToArray);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(
  converge(allPass, map(isColor, [RED, WHITE])),
  getColor(STAR),
  not
);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isColor(GREEN)), shapesToArray);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета.
export const validateFieldN10 = ({ triangle, square }) =>
  equals(triangle, square) && !isColor(WHITE)(triangle);
